/**
 * VisionFlow Projects API
 * Handles project CRUD operations
 *
 * @route POST /api/v1/apps/visionflow/projects - Create project
 * @route GET  /api/v1/apps/visionflow/projects - List projects
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/v1/apps/visionflow/projects
 * List projects for the current user's organization
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
    const planId = searchParams.get('plan_id');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('projects')
      .select(
        `
        *,
        plan:plans(id, title),
        milestones:milestones(
          id,
          title,
          status,
          due_date
        )
      `
      )
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (planId) {
      query = query.eq('plan_id', planId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (priority) {
      query = query.eq('priority', priority);
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      projects,
      pagination: {
        limit,
        offset,
        total: projects.length,
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/apps/visionflow/projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/apps/visionflow/projects
 * Create a new project
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
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        title: body.title,
        description: body.description,
        plan_id: body.plan_id,
        organization_id: organizationId,
        status: body.status || 'NOT_STARTED',
        priority: body.priority,
        start_date: body.start_date,
        due_date: body.due_date,
        progress_percentage: body.progress_percentage || 0,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/v1/apps/visionflow/projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

