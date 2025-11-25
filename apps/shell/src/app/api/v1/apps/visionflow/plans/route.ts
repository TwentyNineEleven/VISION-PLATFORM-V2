/**
 * VisionFlow Plans API
 * Handles plan CRUD operations
 *
 * @route POST /api/v1/apps/visionflow/plans - Create plan
 * @route GET  /api/v1/apps/visionflow/plans - List plans
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/v1/apps/visionflow/plans
 * List plans accessible to the current user
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
    const status = searchParams.get('status');
    const visibility = searchParams.get('visibility');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('plans')
      .select(
        `
        *,
        owner:users!plans_owner_user_id_fkey(id, name, email, avatar_url),
        organization:organizations(id, name),
        projects:projects(
          id,
          title,
          status,
          progress_percentage
        )
      `
      )
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by organization (USER_PRIVATE or ORG visibility)
    query = query.or(`owner_user_id.eq.${user.id},and(visibility.eq.ORG,owner_org_id.eq.${organizationId})`);

    // Apply additional filters
    if (status) {
      query = query.eq('status', status);
    }

    if (visibility) {
      query = query.eq('visibility', visibility);
    }

    const { data: plans, error } = await query;

    if (error) {
      console.error('Error fetching plans:', error);
      return NextResponse.json(
        { error: 'Failed to fetch plans' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      plans,
      pagination: {
        limit,
        offset,
        total: plans.length,
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/apps/visionflow/plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/apps/visionflow/plans
 * Create a new plan
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

    // Create plan
    const { data: plan, error } = await supabase
      .from('plans')
      .insert({
        title: body.title,
        description: body.description,
        owner_user_id: user.id,
        owner_org_id: organizationId,
        visibility: body.visibility || 'ORG',
        status: body.status || 'DRAFT',
        start_date: body.start_date,
        end_date: body.end_date,
        ai_generated: body.ai_generated || false,
        ai_context: body.ai_context,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating plan:', error);
      return NextResponse.json(
        { error: 'Failed to create plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/v1/apps/visionflow/plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
