'use client';

import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/types/supabase';
import type { TeamMember, PendingInvite, TeamInvite, TeamRole } from '@/types/team';

type DbOrganizationMember = Tables<'organization_members'>;
type DbOrganizationInvite = Tables<'organization_invites'>;
type DbUser = Tables<'users'>;

/**
 * Convert database member + user to TeamMember type
 */
function dbToTeamMember(dbMember: DbOrganizationMember, user: DbUser): TeamMember {
  return {
    id: dbMember.id,
    name: user.name,
    email: user.email,
    role: dbMember.role as TeamRole,
    avatar: user.avatar_url || undefined,
    joinedAt: new Date(dbMember.joined_at),
    status: dbMember.status as 'active' | 'invited' | 'inactive',
  };
}

/**
 * Convert database invite to PendingInvite type
 */
function dbToPendingInvite(dbInvite: DbOrganizationInvite): PendingInvite {
  return {
    id: dbInvite.id,
    email: dbInvite.email,
    role: dbInvite.role as TeamRole,
    invitedAt: new Date(dbInvite.created_at),
    status: dbInvite.status as 'pending' | 'accepted' | 'expired',
  };
}

export const teamService = {
  /**
   * Get all team members for an organization
   */
  async getTeamMembers(organizationId: string): Promise<TeamMember[]> {
    const supabase = createClient();

    const { data: members, error } = await supabase
      .from('organization_members')
      .select(`
        *,
        users (*)
      `)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('joined_at', { ascending: false });

    if (error || !members) {
      console.error('Error fetching team members:', error);
      return [];
    }

    return members
      .filter(m => m.users && !Array.isArray(m.users))
      .map(m => {
        const user = m.users as unknown as DbUser;
        return dbToTeamMember(m, user);
      });
  },

  /**
   * Remove a team member (soft delete)
   */
  async removeMember(organizationId: string, memberId: string): Promise<void> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('organization_members')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
      })
      .eq('id', memberId)
      .eq('organization_id', organizationId);

    if (error) {
      throw new Error(`Failed to remove member: ${error.message}`);
    }
  },

  /**
   * Update a member's role
   */
  async updateMemberRole(organizationId: string, memberId: string, newRole: TeamRole): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('organization_members')
      .update({ role: newRole })
      .eq('id', memberId)
      .eq('organization_id', organizationId)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to update member role: ${error.message}`);
    }
  },

  /**
   * Get pending invites for an organization
   */
  async getPendingInvites(organizationId: string): Promise<PendingInvite[]> {
    const supabase = createClient();

    // First, expire any old invites
    await supabase.rpc('expire_old_invites');

    const { data: invites, error } = await supabase
      .from('organization_invites')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error || !invites) {
      console.error('Error fetching invites:', error);
      return [];
    }

    return invites.map(dbToPendingInvite);
  },

  /**
   * Send an invitation to join the organization
   */
  async inviteMember(organizationId: string, invite: TeamInvite): Promise<PendingInvite> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Validate email
    if (!invite.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.email)) {
      throw new Error('Invalid email address');
    }

    // Check if email is already a member
    const { data: existingMember } = await supabase
      .from('organization_members')
      .select(`
        id,
        users!inner(email)
      `)
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    // Note: The above query might not work correctly with the join, 
    // so let's check differently
    const members = await this.getTeamMembers(organizationId);
    if (members.some(m => m.email.toLowerCase() === invite.email.toLowerCase())) {
      throw new Error('This email is already a team member');
    }

    // Check for existing pending invite
    const { data: existingInvite } = await supabase
      .from('organization_invites')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('email', invite.email.toLowerCase())
      .eq('status', 'pending')
      .is('deleted_at', null)
      .single();

    if (existingInvite) {
      throw new Error('An invitation has already been sent to this email');
    }

    // Get user info for invite
    const { data: inviter } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', user.id)
      .single();

    // Generate secure token
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Create invite
    const { data: newInvite, error } = await supabase
      .from('organization_invites')
      .insert({
        organization_id: organizationId,
        email: invite.email.toLowerCase(),
        role: invite.role,
        token,
        invited_by: user.id,
        invited_by_name: inviter?.name || '',
        invited_by_email: inviter?.email || '',
      })
      .select()
      .single();

    if (error || !newInvite) {
      throw new Error(`Failed to create invite: ${error?.message || 'Unknown error'}`);
    }

    // TODO: Send email with invite link
    // Email would contain: ${process.env.NEXT_PUBLIC_APP_URL}/invite/accept?token=${token}

    return dbToPendingInvite(newInvite);
  },

  /**
   * Resend an invitation
   */
  async resendInvite(organizationId: string, inviteId: string): Promise<void> {
    const supabase = createClient();

    const { data: invite, error: fetchError } = await supabase
      .from('organization_invites')
      .select('*')
      .eq('id', inviteId)
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .single();

    if (fetchError || !invite) {
      throw new Error('Invite not found');
    }

    if (invite.status !== 'pending') {
      throw new Error('Can only resend pending invitations');
    }

    // Update resend count and last sent time
    const { error } = await supabase
      .from('organization_invites')
      .update({
        resend_count: (invite.resend_count ?? 0) + 1,
        last_sent_at: new Date().toISOString(),
      })
      .eq('id', inviteId);

    if (error) {
      throw new Error(`Failed to resend invite: ${error.message}`);
    }

    // TODO: Send email again
  },

  /**
   * Cancel an invitation
   */
  async cancelInvite(organizationId: string, inviteId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('organization_invites')
      .update({ status: 'cancelled' })
      .eq('id', inviteId)
      .eq('organization_id', organizationId)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to cancel invite: ${error.message}`);
    }
  },

  /**
   * Get invite details by token (public - for acceptance page)
   */
  async getInviteByToken(token: string): Promise<{
    invite: PendingInvite;
    organizationName: string;
    invitedByName: string;
    isValid: boolean;
  } | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('organization_invites')
      .select(`
        *,
        organizations (name)
      `)
      .eq('token', token)
      .is('deleted_at', null)
      .single();

    if (error || !data) {
      return null;
    }

    const org = data.organizations as unknown as { name: string };
    const isValid = data.status === 'pending' && new Date(data.expires_at) > new Date();

    return {
      invite: dbToPendingInvite(data),
      organizationName: org?.name || 'Unknown Organization',
      invitedByName: data.invited_by_name || 'Someone',
      isValid,
    };
  },

  /**
   * Accept an invitation (user must be authenticated)
   */
  async acceptInvite(token: string): Promise<{ organizationId: string; organizationName: string }> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to accept invite');
    }

    // Get invite details
    const inviteDetails = await this.getInviteByToken(token);
    if (!inviteDetails) {
      throw new Error('Invite not found');
    }

    if (!inviteDetails.isValid) {
      throw new Error('This invite has expired or is no longer valid');
    }

    const { invite } = inviteDetails;

    // Verify email matches (optional - you might allow any authenticated user)
    const { data: userProfile } = await supabase
      .from('users')
      .select('email')
      .eq('id', user.id)
      .single();

    if (userProfile?.email.toLowerCase() !== invite.email.toLowerCase()) {
      throw new Error('This invite was sent to a different email address');
    }

    // Get the organization_id from the invite
    const { data: inviteData } = await supabase
      .from('organization_invites')
      .select('organization_id, role')
      .eq('token', token)
      .single();

    if (!inviteData) {
      throw new Error('Invite not found');
    }

    // Create organization membership
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: inviteData.organization_id,
        user_id: user.id,
        role: inviteData.role,
        status: 'active',
      });

    if (memberError) {
      throw new Error(`Failed to join organization: ${memberError.message}`);
    }

    // Mark invite as accepted
    const { error: updateError } = await supabase
      .from('organization_invites')
      .update({
        status: 'accepted',
        accepted_by: user.id,
        accepted_at: new Date().toISOString(),
      })
      .eq('token', token);

    if (updateError) {
      console.warn('Failed to update invite status:', updateError);
    }

    return {
      organizationId: inviteData.organization_id,
      organizationName: inviteDetails.organizationName,
    };
  },

  /**
   * Get member count for an organization
   */
  async getMemberCount(organizationId: string): Promise<number> {
    const supabase = createClient();

    const { count, error } = await supabase
      .from('organization_members')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .is('deleted_at', null);

    if (error) {
      console.error('Error counting members:', error);
      return 0;
    }

    return count || 0;
  },

  /**
   * Check if user can invite members (Owner or Admin)
   */
  async canInviteMembers(organizationId: string): Promise<boolean> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }

    const { data } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    return data?.role === 'Owner' || data?.role === 'Admin';
  },
};
