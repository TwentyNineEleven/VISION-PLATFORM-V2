import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * POST /api/v1/organizations/[id]/invites/[inviteId]/resend
 * Resend an invitation
 * Requires: Owner or Admin role
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; inviteId: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id, inviteId } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check user's role (must be Owner or Admin)
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (!membership || !['Owner', 'Admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Forbidden - requires Owner or Admin role' },
        { status: 403 }
      );
    }

    // Get invite
    const { data: invite, error: fetchError } = await supabase
      .from('organization_invites')
      .select('*')
      .eq('id', inviteId)
      .eq('organization_id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError || !invite) {
      return NextResponse.json(
        { error: 'Invite not found' },
        { status: 404 }
      );
    }

    if (invite.status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only resend pending invitations' },
        { status: 400 }
      );
    }

    // Update resend count and timestamp
    const { data: updated, error: updateError } = await supabase
      .from('organization_invites')
      .update({
        resend_count: (invite.resend_count ?? 0) + 1,
        last_sent_at: new Date().toISOString(),
      })
      .eq('id', inviteId)
      .select()
      .single();

    if (updateError || !updated) {
      console.error('Error resending invite:', updateError);
      return NextResponse.json(
        { error: 'Failed to resend invite' },
        { status: 500 }
      );
    }

    // TODO: Send email again
    // Email would contain: ${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Unexpected error in POST /api/v1/organizations/[id]/invites/[inviteId]/resend:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/organizations/[id]/invites/[inviteId]
 * Cancel an invitation
 * Requires: Owner or Admin role
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; inviteId: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id, inviteId } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check user's role (must be Owner or Admin)
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (!membership || !['Owner', 'Admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Forbidden - requires Owner or Admin role' },
        { status: 403 }
      );
    }

    // Cancel invite (mark as cancelled)
    const { error: cancelError } = await supabase
      .from('organization_invites')
      .update({ status: 'cancelled' })
      .eq('id', inviteId)
      .eq('organization_id', id)
      .is('deleted_at', null);

    if (cancelError) {
      console.error('Error cancelling invite:', cancelError);
      return NextResponse.json(
        { error: 'Failed to cancel invite' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/v1/organizations/[id]/invites/[inviteId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
