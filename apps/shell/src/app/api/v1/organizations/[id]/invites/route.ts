import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { emailService } from '@/services/emailService';

/**
 * GET /api/v1/organizations/[id]/invites
 * List all invites for an organization
 * Requires: Owner or Admin role
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = params;

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

    // Expire old invites first
    await supabase.rpc('expire_old_invites');

    // Get all invites
    const { data: invites, error } = await supabase
      .from('organization_invites')
      .select('*')
      .eq('organization_id', id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invites:', error);
      return NextResponse.json(
        { error: 'Failed to fetch invites' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: invites || [] });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/organizations/[id]/invites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/organizations/[id]/invites
 * Send a new invitation
 * Requires: Owner or Admin role
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = params;

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

    // Parse request body
    const body = await request.json();
    const { email, role, message } = body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate role
    if (!role || !['Owner', 'Admin', 'Editor', 'Viewer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be Owner, Admin, Editor, or Viewer' },
        { status: 400 }
      );
    }

    // Check if email is already a member
    const { data: existingMembers } = await supabase
      .from('organization_members')
      .select(`
        id,
        users!inner(email)
      `)
      .eq('organization_id', id)
      .eq('status', 'active')
      .is('deleted_at', null);

    // Check if any member has this email
    const memberExists = existingMembers?.some((m: any) => {
      const userEmail = m.users?.email;
      return userEmail && userEmail.toLowerCase() === email.toLowerCase();
    });

    if (memberExists) {
      return NextResponse.json(
        { error: 'This email is already a team member' },
        { status: 400 }
      );
    }

    // Check for existing pending invite
    const { data: existingInvite } = await supabase
      .from('organization_invites')
      .select('id')
      .eq('organization_id', id)
      .eq('email', email.toLowerCase())
      .eq('status', 'pending')
      .is('deleted_at', null)
      .single();

    if (existingInvite) {
      return NextResponse.json(
        { error: 'An invitation has already been sent to this email' },
        { status: 400 }
      );
    }

    // Get inviter info
    const { data: inviter } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', user.id)
      .single();

    // Generate secure token
    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);
    const token = Array.from(tokenBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Create invite
    const { data: newInvite, error: createError } = await supabase
      .from('organization_invites')
      .insert({
        organization_id: id,
        email: email.toLowerCase(),
        role,
        token,
        message: message || null,
        invited_by: user.id,
        invited_by_name: inviter?.name || user.email || '',
        invited_by_email: inviter?.email || user.email || '',
      })
      .select()
      .single();

    if (createError || !newInvite) {
      console.error('Error creating invite:', createError);
      return NextResponse.json(
        { error: 'Failed to create invite' },
        { status: 500 }
      );
    }

    // Get organization details for email
    const { data: organization } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', id)
      .single();

    // Send invite email
    try {
      await emailService.sendInviteEmail({
        email: newInvite.email,
        token: newInvite.token,
        organizationName: organization?.name || 'the organization',
        invitedByName: inviter?.name || 'A team member',
        role: newInvite.role,
      });
    } catch (emailError) {
      console.error('Failed to send invite email:', emailError);
      // Don't fail the request if email fails - invite was created successfully
    }

    return NextResponse.json({ data: newInvite }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/v1/organizations/[id]/invites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
