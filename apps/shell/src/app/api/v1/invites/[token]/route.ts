import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/v1/invites/[token]
 * Get invite details by token (PUBLIC - no auth required)
 * Used for the invite acceptance page
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { token } = params;

    // Get invite with organization details
    const { data: invite, error } = await supabase
      .from('organization_invites')
      .select(`
        id,
        email,
        role,
        message,
        invited_by_name,
        invited_by_email,
        status,
        expires_at,
        created_at,
        organizations (
          id,
          name,
          logo_url
        )
      `)
      .eq('token', token)
      .is('deleted_at', null)
      .single();

    if (error || !invite) {
      return NextResponse.json(
        { error: 'Invite not found' },
        { status: 404 }
      );
    }

    // Check if invite is valid
    const isExpired = new Date(invite.expires_at) < new Date();
    const isValid = invite.status === 'pending' && !isExpired;

    // Get organization details
    const org = invite.organizations as any;

    return NextResponse.json({
      data: {
        inviteId: invite.id,
        email: invite.email,
        role: invite.role,
        message: invite.message,
        invitedBy: invite.invited_by_name,
        invitedByEmail: invite.invited_by_email,
        status: invite.status,
        expiresAt: invite.expires_at,
        createdAt: invite.created_at,
        isValid,
        organization: {
          id: org?.id,
          name: org?.name,
          logoUrl: org?.logo_url,
        },
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/invites/[token]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/invites/[token]/accept
 * Accept an invitation (requires authentication)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { token } = params;

    // Get current user (must be authenticated)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required to accept invite' },
        { status: 401 }
      );
    }

    // Get invite details
    const { data: invite, error: inviteError } = await supabase
      .from('organization_invites')
      .select('*')
      .eq('token', token)
      .is('deleted_at', null)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json(
        { error: 'Invite not found' },
        { status: 404 }
      );
    }

    // Validate invite
    if (invite.status !== 'pending') {
      return NextResponse.json(
        { error: 'This invite is no longer valid' },
        { status: 400 }
      );
    }

    if (new Date(invite.expires_at) < new Date()) {
      // Mark as expired
      await supabase
        .from('organization_invites')
        .update({ status: 'expired' })
        .eq('id', invite.id);

      return NextResponse.json(
        { error: 'This invite has expired' },
        { status: 400 }
      );
    }

    // Verify email matches (optional check)
    const { data: userProfile } = await supabase
      .from('users')
      .select('email')
      .eq('id', user.id)
      .single();

    if (userProfile && userProfile.email.toLowerCase() !== invite.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'This invite was sent to a different email address' },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', invite.organization_id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already a member of this organization' },
        { status: 400 }
      );
    }

    // Create membership
    const { data: newMember, error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: invite.organization_id,
        user_id: user.id,
        role: invite.role,
        status: 'active',
      })
      .select()
      .single();

    if (memberError || !newMember) {
      console.error('Error creating membership:', memberError);
      return NextResponse.json(
        { error: 'Failed to join organization' },
        { status: 500 }
      );
    }

    // Mark invite as accepted
    await supabase
      .from('organization_invites')
      .update({
        status: 'accepted',
        accepted_by: user.id,
        accepted_at: new Date().toISOString(),
      })
      .eq('id', invite.id);

    // Set as active organization if user doesn't have one
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('active_organization_id')
      .eq('user_id', user.id)
      .single();

    if (!prefs?.active_organization_id) {
      await supabase
        .from('user_preferences')
        .update({ active_organization_id: invite.organization_id })
        .eq('user_id', user.id);
    }

    // Get organization details for response
    const { data: org } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('id', invite.organization_id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        organizationId: invite.organization_id,
        organizationName: org?.name || 'Organization',
        membership: newMember,
      },
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/v1/invites/[token]/accept:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
