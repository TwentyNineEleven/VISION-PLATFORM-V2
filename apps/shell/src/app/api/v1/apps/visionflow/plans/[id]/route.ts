/**
 * VisionFlow Plan Detail API
 * Handles individual plan operations
 *
 * @route GET    /api/v1/apps/visionflow/plans/[id] - Get plan details
 * @route PUT    /api/v1/apps/visionflow/plans/[id] - Update plan
 * @route DELETE /api/v1/apps/visionflow/plans/[id] - Delete plan
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AsyncRouteParams } from '@/types/next';

/**
 * GET /api/v1/apps/visionflow/plans/[id]
 * Get plan details with projects and shares
 */
export async function GET(
  request: NextRequest,
  { params }: AsyncRouteParams<{ id: string }>
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch plan with related data
    const { data: plan, error } = await supabase
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
          progress_percentage,
          start_date,
          due_date
        ),
        shares:plan_shares(
          id,
          access_level,
          shared_with_org_id,
          shared_with_user_id,
          shared_by,
          created_at,
          shared_with_org:organizations(id, name),
          shared_with_user:users(id, name, email)
        )
      `
      )
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
      }
      console.error('Error fetching plan:', error);
      return NextResponse.json(
        { error: 'Failed to fetch plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/apps/visionflow/plans/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/apps/visionflow/plans/[id]
 * Update plan
 */
export async function PUT(
  request: NextRequest,
  { params }: AsyncRouteParams<{ id: string }>
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get existing plan to verify ownership
    const { data: existingPlan } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!existingPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Check if user has permission (owner or shared with edit access)
    const { data: share } = await supabase
      .from('plan_shares')
      .select('access_level')
      .eq('plan_id', id)
      .eq('shared_with_user_id', user.id)
      .is('deleted_at', null)
      .single();

    const canEdit =
      existingPlan.owner_user_id === user.id ||
      share?.access_level === 'EDIT';

    if (!canEdit) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) {
      updates.title = body.title;
    }

    if (body.description !== undefined) {
      updates.description = body.description;
    }

    if (body.status !== undefined) {
      updates.status = body.status;
    }

    if (body.visibility !== undefined) {
      updates.visibility = body.visibility;
    }

    if (body.start_date !== undefined) {
      updates.start_date = body.start_date;
    }

    if (body.end_date !== undefined) {
      updates.end_date = body.end_date;
    }

    if (body.metadata !== undefined) {
      updates.metadata = body.metadata;
    }

    // Update plan
    const { data: plan, error } = await supabase
      .from('plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating plan:', error);
      return NextResponse.json(
        { error: 'Failed to update plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Unexpected error in PUT /api/v1/apps/visionflow/plans/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/apps/visionflow/plans/[id]
 * Soft delete plan
 */
export async function DELETE(
  request: NextRequest,
  { params }: AsyncRouteParams<{ id: string }>
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get existing plan to verify ownership
    const { data: existingPlan } = await supabase
      .from('plans')
      .select('owner_user_id')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!existingPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Only owner can delete
    if (existingPlan.owner_user_id !== user.id) {
      return NextResponse.json(
        { error: 'Only the plan owner can delete it' },
        { status: 403 }
      );
    }

    // Soft delete plan
    const { error } = await supabase
      .from('plans')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting plan:', error);
      return NextResponse.json(
        { error: 'Failed to delete plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/v1/apps/visionflow/plans/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

