/**
 * VisionFlow Plan Shares API
 * Handles plan sharing operations
 *
 * @route GET  /api/v1/apps/visionflow/plans/[id]/shares - List shares
 * @route POST /api/v1/apps/visionflow/plans/[id]/shares - Create share
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AsyncRouteParams } from '@/types/next';

/**
 * GET /api/v1/apps/visionflow/plans/[id]/shares
 * List all shares for a plan
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

    // Verify plan exists and user has access
    const { data: plan } = await supabase
      .from('plans')
      .select('owner_user_id')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Only owner can view shares
    if (plan.owner_user_id !== user.id) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Fetch shares
    const { data: shares, error } = await supabase
      .from('plan_shares')
      .select(
        `
        *,
        shared_with_org:organizations(id, name),
        shared_with_user:users(id, name, email, avatar_url),
        shared_by_user:users!plan_shares_shared_by_fkey(id, name, email)
      `
      )
      .eq('plan_id', id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shares:', error);
      return NextResponse.json(
        { error: 'Failed to fetch shares' },
        { status: 500 }
      );
    }

    return NextResponse.json({ shares });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/apps/visionflow/plans/[id]/shares:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/apps/visionflow/plans/[id]/shares
 * Share plan with user or organization
 */
export async function POST(
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

    // Verify plan exists and user is owner
    const { data: plan } = await supabase
      .from('plans')
      .select('owner_user_id')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    if (plan.owner_user_id !== user.id) {
      return NextResponse.json(
        { error: 'Only the plan owner can share it' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.shared_with_user_id && !body.shared_with_org_id) {
      return NextResponse.json(
        { error: 'Must specify either shared_with_user_id or shared_with_org_id' },
        { status: 400 }
      );
    }

    if (body.shared_with_user_id && body.shared_with_org_id) {
      return NextResponse.json(
        { error: 'Cannot share with both user and organization' },
        { status: 400 }
      );
    }

    // Check if share already exists
    const existingShareQuery = supabase
      .from('plan_shares')
      .select('id')
      .eq('plan_id', id)
      .is('deleted_at', null);

    if (body.shared_with_user_id) {
      existingShareQuery.eq('shared_with_user_id', body.shared_with_user_id);
    } else {
      existingShareQuery.eq('shared_with_org_id', body.shared_with_org_id);
    }

    const { data: existingShare } = await existingShareQuery.single();

    if (existingShare) {
      return NextResponse.json(
        { error: 'Plan already shared with this target' },
        { status: 409 }
      );
    }

    // Create share
    const { data: share, error } = await supabase
      .from('plan_shares')
      .insert({
        plan_id: id,
        shared_with_user_id: body.shared_with_user_id || null,
        shared_with_org_id: body.shared_with_org_id || null,
        access_level: body.access_level || 'VIEW',
        shared_by: user.id,
      })
      .select(
        `
        *,
        shared_with_org:organizations(id, name),
        shared_with_user:users(id, name, email, avatar_url)
      `
      )
      .single();

    if (error) {
      console.error('Error creating share:', error);
      return NextResponse.json(
        { error: 'Failed to create share' },
        { status: 500 }
      );
    }

    return NextResponse.json({ share }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/v1/apps/visionflow/plans/[id]/shares:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

