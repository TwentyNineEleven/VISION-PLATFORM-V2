/**
 * VisionFlow Plan Share Detail API
 * Handles individual share operations
 *
 * @route DELETE /api/v1/apps/visionflow/plans/[id]/shares/[shareId] - Remove share
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AsyncRouteParams } from '@/types/next';

/**
 * DELETE /api/v1/apps/visionflow/plans/[id]/shares/[shareId]
 * Remove a share
 */
export async function DELETE(
  request: NextRequest,
  { params }: AsyncRouteParams<{ id: string; shareId: string }>
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id, shareId } = await params;

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
        { error: 'Only the plan owner can remove shares' },
        { status: 403 }
      );
    }

    // Soft delete share
    const { error } = await supabase
      .from('plan_shares')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', shareId)
      .eq('plan_id', id);

    if (error) {
      console.error('Error removing share:', error);
      return NextResponse.json(
        { error: 'Failed to remove share' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/v1/apps/visionflow/plans/[id]/shares/[shareId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

