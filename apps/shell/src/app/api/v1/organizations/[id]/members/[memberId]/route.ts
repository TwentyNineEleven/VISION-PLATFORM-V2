import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * PATCH /api/v1/organizations/[id]/members/[memberId]
 * Update member role
 * Requires: Owner or Admin role
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id, memberId } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check current user's role (must be Owner or Admin)
    const { data: currentUserMembership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (!currentUserMembership || !['Owner', 'Admin'].includes(currentUserMembership.role)) {
      return NextResponse.json(
        { error: 'Forbidden - requires Owner or Admin role' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { role } = body;

    if (!role || !['Owner', 'Admin', 'Editor', 'Viewer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be Owner, Admin, Editor, or Viewer' },
        { status: 400 }
      );
    }

    // Get target member details
    const { data: targetMember } = await supabase
      .from('organization_members')
      .select('user_id, role')
      .eq('id', memberId)
      .eq('organization_id', id)
      .is('deleted_at', null)
      .single();

    if (!targetMember) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Prevent changing own role
    if (targetMember.user_id === user.id) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 }
      );
    }

    // Only Owner can change roles to/from Owner
    if ((role === 'Owner' || targetMember.role === 'Owner') && currentUserMembership.role !== 'Owner') {
      return NextResponse.json(
        { error: 'Only organization Owner can assign or change Owner role' },
        { status: 403 }
      );
    }

    // Update member role
    const { data: updated, error: updateError } = await supabase
      .from('organization_members')
      .update({ role })
      .eq('id', memberId)
      .eq('organization_id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (updateError || !updated) {
      console.error('Error updating member role:', updateError);
      return NextResponse.json(
        { error: 'Failed to update member role' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/v1/organizations/[id]/members/[memberId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/organizations/[id]/members/[memberId]
 * Remove member from organization
 * Requires: Owner or Admin role
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id, memberId } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check current user's role (must be Owner or Admin)
    const { data: currentUserMembership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (!currentUserMembership || !['Owner', 'Admin'].includes(currentUserMembership.role)) {
      return NextResponse.json(
        { error: 'Forbidden - requires Owner or Admin role' },
        { status: 403 }
      );
    }

    // Get target member details
    const { data: targetMember } = await supabase
      .from('organization_members')
      .select('user_id, role')
      .eq('id', memberId)
      .eq('organization_id', id)
      .is('deleted_at', null)
      .single();

    if (!targetMember) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Prevent removing self
    if (targetMember.user_id === user.id) {
      return NextResponse.json(
        { error: 'Cannot remove yourself from the organization' },
        { status: 400 }
      );
    }

    // Only Owner can remove other Owners or Admins
    if (['Owner', 'Admin'].includes(targetMember.role) && currentUserMembership.role !== 'Owner') {
      return NextResponse.json(
        { error: 'Only organization Owner can remove Owners or Admins' },
        { status: 403 }
      );
    }

    // Soft delete the member
    const { error: deleteError } = await supabase
      .from('organization_members')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
      })
      .eq('id', memberId)
      .eq('organization_id', id);

    if (deleteError) {
      console.error('Error removing member:', deleteError);
      return NextResponse.json(
        { error: 'Failed to remove member' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/v1/organizations/[id]/members/[memberId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
