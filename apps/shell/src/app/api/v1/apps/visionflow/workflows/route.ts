/**
 * VisionFlow Workflows API
 * Handles workflow CRUD operations
 *
 * @route POST /api/v1/apps/visionflow/workflows - Create workflow
 * @route GET  /api/v1/apps/visionflow/workflows - List workflows
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/v1/apps/visionflow/workflows
 * List workflows (user-created and public templates)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's active organization
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('active_organization_id')
      .eq('user_id', user.id)
      .single();

    if (!preferences?.active_organization_id) {
      return NextResponse.json(
        { error: 'No active organization' },
        { status: 400 }
      );
    }

    const organizationId = preferences.active_organization_id;

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const isPublic = searchParams.get('is_public');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query for user's workflows
    let query = supabase
      .from('workflows')
      .select(
        `
        *,
        created_by_user:users!workflows_created_by_fkey(id, name, email, avatar_url),
        steps:workflow_steps(
          id,
          title,
          description,
          sort_order,
          duration_days,
          assignee_role
        )
      `
      )
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by public/private
    let workflows: any[] = [];
    
    if (isPublic === 'true') {
      query = query.eq('is_public', true);
      const result = await query;
      workflows = result.data || [];
      
      if (result.error) {
        throw result.error;
      }
    } else if (isPublic === 'false') {
      // Private workflows: must be private AND (owned by user OR belong to their organization)
      // Fetch private workflows first, then filter by ownership
      const privateQuery = supabase
        .from('workflows')
        .select(
          `
          *,
          created_by_user:users!workflows_created_by_fkey(id, name, email, avatar_url),
          steps:workflow_steps(
            id,
            title,
            description,
            sort_order,
            duration_days,
            assignee_role
          )
        `
        )
        .eq('is_public', false)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
        
      const result = await privateQuery;
      
      if (result.error) {
        throw result.error;
      }
      
      // Filter by ownership in JavaScript (more reliable than complex SQL)
      workflows = (result.data || []).filter(
        (w: any) => w.organization_id === organizationId || w.created_by === user.id
      );
    } else {
      // Get both public workflows OR user's private workflows
      // Fetch all accessible workflows
      query = query.or(
        `is_public.eq.true,organization_id.eq.${organizationId},created_by.eq.${user.id}`
      );
      
      const result = await query;
      workflows = result.data || [];
      
      if (result.error) {
        throw result.error;
      }
      
      // Filter out private workflows that don't belong to user
      workflows = workflows.filter(
        (w: any) => 
          w.is_public === true || 
          w.organization_id === organizationId || 
          w.created_by === user.id
      );
    }
    
    const error = null; // Errors handled above

    return NextResponse.json({
      workflows,
      pagination: {
        limit,
        offset,
        total: workflows.length,
      },
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/v1/apps/visionflow/workflows:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error',
        code: error?.code || 'UNKNOWN'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/apps/visionflow/workflows
 * Create a new workflow
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's active organization
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('active_organization_id')
      .eq('user_id', user.id)
      .single();

    if (!preferences?.active_organization_id) {
      return NextResponse.json(
        { error: 'No active organization' },
        { status: 400 }
      );
    }

    const organizationId = preferences.active_organization_id;

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!body.steps || !Array.isArray(body.steps) || body.steps.length === 0) {
      return NextResponse.json(
        { error: 'At least one step is required' },
        { status: 400 }
      );
    }

    // Calculate estimated days
    const estimatedDays = body.steps.reduce(
      (sum: number, step: any) => sum + (step.duration_days || 0),
      0
    );

    // Create workflow
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .insert({
        name: body.name,
        description: body.description,
        organization_id: organizationId,
        created_by: user.id,
        is_public: body.is_public || false,
        estimated_days: estimatedDays,
      })
      .select()
      .single();

    if (workflowError) {
      console.error('Error creating workflow:', workflowError);
      return NextResponse.json(
        { error: 'Failed to create workflow' },
        { status: 500 }
      );
    }

    // Create workflow steps
    const steps = body.steps.map((step: any, index: number) => ({
      workflow_id: workflow.id,
      title: step.title || step.name,
      description: step.description,
      sort_order: step.sort_order !== undefined ? step.sort_order : index,
      duration_days: step.duration_days || 0,
      assignee_role: step.assignee_role || 'ORG_STAFF',
    }));

    const { error: stepsError } = await supabase
      .from('workflow_steps')
      .insert(steps);

    if (stepsError) {
      console.error('Error creating workflow steps:', stepsError);
      // Rollback workflow creation
      await supabase.from('workflows').delete().eq('id', workflow.id);
      return NextResponse.json(
        { error: 'Failed to create workflow steps' },
        { status: 500 }
      );
    }

    // Fetch complete workflow with steps
    const { data: completeWorkflow } = await (supabase as any)
      .from('workflows')
      .select(
        `
        *,
        steps:workflow_steps(
          id,
          name,
          description,
          order_index,
          duration_days,
          assignee_type,
          assignee_id
        )
      `
      )
      .eq('id', workflow.id)
      .single();

    return NextResponse.json({ workflow: completeWorkflow }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/v1/apps/visionflow/workflows:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

