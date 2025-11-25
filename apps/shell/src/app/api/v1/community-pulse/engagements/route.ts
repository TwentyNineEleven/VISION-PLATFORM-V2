/**
 * CommunityPulse Engagements API
 * GET /api/v1/community-pulse/engagements - List engagements
 * POST /api/v1/community-pulse/engagements - Create engagement
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createEngagementSchema } from '@/lib/validations/community-pulse';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get organization_id from query params or user's active org
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organization_id');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organization_id is required' },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase
      .from('community_pulse_engagements')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    } else {
      query = query.neq('status', 'archived');
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching engagements:', error);
      return NextResponse.json(
        { error: 'Failed to fetch engagements' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      meta: {
        total: count,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Engagements API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = createEngagementSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { title, learningGoal, goalType } = validation.data;

    // Get organization_id from body or query
    const organizationId = body.organization_id;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organization_id is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this organization
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'Not authorized for this organization' },
        { status: 403 }
      );
    }

    // Create the engagement
    const { data, error } = await supabase
      .from('community_pulse_engagements')
      .insert({
        organization_id: organizationId,
        created_by: user.id,
        title,
        learning_goal: learningGoal,
        goal_type: goalType,
        status: 'draft',
        current_stage: 1,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating engagement:', error);
      return NextResponse.json(
        { error: 'Failed to create engagement' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Engagements API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
