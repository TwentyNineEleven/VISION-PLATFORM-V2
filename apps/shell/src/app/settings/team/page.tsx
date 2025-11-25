'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowInput, GlowButton, GlowBadge, GlowSelect } from '@/components/glow-ui';
import { type TeamRole } from '@/types/team';
import { useOrganization } from '@/contexts/OrganizationContext';
import { toast } from '@/lib/toast';
import { PermissionsMatrix } from '@/components/settings/PermissionsMatrix';
import { ConfirmDialog } from '@/components/settings/ConfirmDialog';
import { Plus, Send, Users, Clock3, RefreshCcw, Loader2, Mail } from 'lucide-react';
import { Grid, Stack, spacing, semanticColors } from '@/design-system';

interface TeamMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: TeamRole;
  status: string;
  invited_by: string | null;
  joined_at: string;
  created_at: string;
  user_name: string;
  user_email: string;
}

interface PendingInvite {
  id: string;
  organization_id: string;
  email: string;
  role: TeamRole;
  status: string;
  token: string;
  invited_by_name: string;
  invited_by_email: string;
  expires_at: string;
  created_at: string;
  resend_count: number;
}

export default function TeamSettingsPage() {
  const { activeOrganization, canManageMembers, currentRole, refreshOrganizations } = useOrganization();
  
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [invites, setInvites] = React.useState<PendingInvite[]>([]);
  const [inviteForm, setInviteForm] = React.useState({ email: '', role: 'Viewer' as TeamRole, message: '' });
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [isInviting, setIsInviting] = React.useState(false);
  const [updatingMemberId, setUpdatingMemberId] = React.useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = React.useState<string | null>(null);
  const [resendingInviteId, setResendingInviteId] = React.useState<string | null>(null);
  const [cancellingInviteId, setCancellingInviteId] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    if (!activeOrganization?.id) return;

    try {
      setIsLoading(true);
      
      const [membersRes, invitesRes] = await Promise.all([
        fetch(`/api/v1/organizations/${activeOrganization.id}/members`),
        fetch(`/api/v1/organizations/${activeOrganization.id}/invites`),
      ]);

      if (!membersRes.ok || !invitesRes.ok) {
        throw new Error('Failed to load team data');
      }

      const membersData = await membersRes.json();
      const invitesData = await invitesRes.json();

      setMembers(membersData.data || []);
      setInvites(invitesData.data || []);
    } catch (error) {
      console.error('Error loading team data:', error);
      toast.error('Failed to Load', 'Could not load team members and invites');
    } finally {
      setIsLoading(false);
    }
  }, [activeOrganization]);

  // Load data on mount
  React.useEffect(() => {
    if (activeOrganization) {
      loadData();
    }
  }, [activeOrganization, loadData]);

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!activeOrganization?.id) {
      toast.error('Error', 'No active organization');
      return;
    }

    if (!canManageMembers) {
      toast.error('Permission Denied', 'You do not have permission to invite members');
      return;
    }

    if (!inviteForm.email) {
      toast.error('Validation Error', 'Please enter an email address');
      return;
    }

    setIsInviting(true);

    try {
      const response = await fetch(`/api/v1/organizations/${activeOrganization.id}/invites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteForm.email,
          role: inviteForm.role,
          message: inviteForm.message || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send invitation');
      }

      toast.success('Invitation Sent', `Invitation sent to ${inviteForm.email}`);
      setInviteForm({ email: '', role: inviteForm.role, message: '' });
      await loadData();
    } catch (error: any) {
      console.error('Error sending invite:', error);
      toast.error('Invite Failed', error.message || 'Could not send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleResend = async (inviteId: string) => {
    if (!activeOrganization?.id) return;

    setResendingInviteId(inviteId);

    try {
      const response = await fetch(
        `/api/v1/organizations/${activeOrganization.id}/invites/${inviteId}`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to resend invitation');
      }

      toast.success('Invitation Resent', 'The invitation has been resent');
      await loadData();
    } catch (error: any) {
      console.error('Error resending invite:', error);
      toast.error('Resend Failed', error.message || 'Could not resend invitation');
    } finally {
      setResendingInviteId(null);
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    if (!activeOrganization?.id) return;

    setCancellingInviteId(inviteId);

    try {
      const response = await fetch(
        `/api/v1/organizations/${activeOrganization.id}/invites/${inviteId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel invitation');
      }

      toast.success('Invitation Cancelled', 'The invitation has been cancelled');
      await loadData();
    } catch (error: any) {
      console.error('Error cancelling invite:', error);
      toast.error('Cancel Failed', error.message || 'Could not cancel invitation');
    } finally {
      setCancellingInviteId(null);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!activeOrganization?.id) return;

    setRemovingMemberId(memberId);

    try {
      const response = await fetch(
        `/api/v1/organizations/${activeOrganization.id}/members/${memberId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove member');
      }

      toast.success('Member Removed', `${memberName} has been removed from the organization`);
      await loadData();
      await refreshOrganizations();
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast.error('Remove Failed', error.message || 'Could not remove member');
    } finally {
      setRemovingMemberId(null);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: TeamRole, memberName: string) => {
    if (!activeOrganization?.id) return;

    setUpdatingMemberId(memberId);

    try {
      const response = await fetch(
        `/api/v1/organizations/${activeOrganization.id}/members/${memberId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update member role');
      }

      toast.success('Role Updated', `${memberName}'s role has been changed to ${newRole}`);
      await loadData();
      await refreshOrganizations();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Update Failed', error.message || 'Could not update member role');
      // Reload to revert optimistic update
      await loadData();
    } finally {
      setUpdatingMemberId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading team members...</p>
        </div>
      </div>
    );
  }

  if (!activeOrganization) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">No Organization Selected</p>
          <p className="text-sm text-muted-foreground">Please select an organization to manage its team</p>
        </div>
      </div>
    );
  }

  const canManage = canManageMembers;

  return (
    <Stack gap="6xl">
      {!canManage && (
        <div className="bg-muted border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>View Only:</strong> You do not have permission to manage team members. 
            Contact an Owner or Admin to invite or manage members.
          </p>
        </div>
      )}

      <GlowCard variant="elevated">
        <GlowCardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <GlowCardTitle>Invite team members</GlowCardTitle>
            <GlowCardDescription>Send an invite to collaborate in this workspace.</GlowCardDescription>
          </div>
        </GlowCardHeader>
        <GlowCardContent>
          <form onSubmit={handleInvite}>
            <Stack gap="lg">
              <Grid columns={3} gap="lg">
                <GlowInput
                  label="Email"
                  type="email"
                  placeholder="teammate@organization.org"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                  leftIcon={<Mail className="h-4 w-4" />}
                  disabled={!canManage || isInviting}
                  required
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm((prev) => ({ ...prev, role: e.target.value as TeamRole }))}
                    disabled={!canManage || isInviting}
                    className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {(['Owner', 'Admin', 'Editor', 'Viewer'] as TeamRole[]).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <GlowButton 
                    type="submit" 
                    className="w-full"
                    leftIcon={isInviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    disabled={!canManage || isInviting}
                  >
                    {isInviting ? 'Sending...' : 'Send invite'}
                  </GlowButton>
                </div>
              </Grid>
              <GlowInput
                label="Message (optional)"
                placeholder="Add a personal message to the invitation"
                value={inviteForm.message}
                onChange={(e) => setInviteForm((prev) => ({ ...prev, message: e.target.value }))}
                disabled={!canManage || isInviting}
              />
            </Stack>
          </form>
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="flat">
        <GlowCardHeader>
          <GlowCardTitle>Pending invites ({invites.length})</GlowCardTitle>
          <GlowCardDescription>Track outstanding invitations.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent>
          <Stack gap="lg">
            {invites.map((invite) => {
              const isExpired = new Date(invite.expires_at) < new Date();
              const isResending = resendingInviteId === invite.id;
              const isCancelling = cancellingInviteId === invite.id;

              return (
                <Stack
                  key={invite.id}
                  direction="row"
                  justify="space-between"
                  align="center"
                  style={{
                    borderRadius: spacing['3xl'],
                    border: `1px solid ${semanticColors.borderSecondary}`,
                    padding: spacing['3xl'],
                    opacity: isExpired ? 0.6 : 1,
                  }}
                >
                  <Stack gap="xs">
                    <p className="text-sm font-semibold text-foreground">{invite.email}</p>
                    <Stack direction="row" gap="xs" align="center" className="text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      Invited {new Date(invite.created_at).toLocaleDateString()}
                      {invite.resend_count > 0 && ` • Resent ${invite.resend_count}x`}
                    </Stack>
                    {isExpired && (
                      <p className="text-xs text-destructive">Expired</p>
                    )}
                  </Stack>
                  <Stack direction="row" gap="sm" align="center">
                    <GlowBadge variant="outline" size="sm">
                      {invite.role}
                    </GlowBadge>
                    {canManage && !isExpired && (
                      <>
                        <GlowButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          leftIcon={isResending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
                          onClick={() => handleResend(invite.id)}
                          disabled={isResending || isCancelling}
                        >
                          {isResending ? 'Resending...' : 'Resend'}
                        </GlowButton>
                        <GlowButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelInvite(invite.id)}
                          disabled={isResending || isCancelling}
                        >
                          {isCancelling ? 'Cancelling...' : 'Cancel'}
                        </GlowButton>
                      </>
                    )}
                  </Stack>
                </Stack>
              );
            })}
            {invites.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No pending invites.</p>
            )}
          </Stack>
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="elevated">
        <GlowCardHeader>
          <GlowCardTitle>Members ({members.length})</GlowCardTitle>
          <GlowCardDescription>Manage roles and access for your team.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent>
          <Stack gap="lg">
            {members.map((member) => {
              const isUpdating = updatingMemberId === member.id;
              const isRemoving = removingMemberId === member.id;
              const isCurrentUser = member.role === currentRole;
              
              return (
                <Stack
                  key={member.id}
                  direction="row"
                  justify="space-between"
                  align="center"
                  style={{
                    borderRadius: spacing['3xl'],
                    border: `1px solid ${semanticColors.borderSecondary}`,
                    padding: spacing['3xl'],
                  }}
                >
                  <Stack direction="row" gap="md" align="center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                      {member.user_name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || member.user_email[0].toUpperCase()}
                    </div>
                    <Stack gap="xs">
                      <p className="text-sm font-semibold text-foreground">
                        {member.user_name || member.user_email}
                      </p>
                      <p className="text-xs text-muted-foreground">{member.user_email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(member.joined_at || member.created_at).toLocaleDateString()}
                      </p>
                    </Stack>
                  </Stack>
                  <Stack direction="row" gap="xs" align="center">
                    <GlowBadge variant={member.role === 'Owner' ? 'default' : 'outline'} size="sm">
                      {member.role}
                    </GlowBadge>
                    {canManage && member.role !== 'Owner' && (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateRole(member.id, e.target.value as TeamRole, member.user_name || member.user_email)}
                          disabled={isUpdating || isRemoving}
                          className="h-9 rounded-md border border-input bg-transparent px-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {(['Admin', 'Editor', 'Viewer'] as TeamRole[]).map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        <ConfirmDialog
                          title="Remove member"
                          description={`Remove ${member.user_name || member.user_email} from this workspace? They will lose access immediately.`}
                          triggerLabel={isRemoving ? 'Removing...' : 'Remove'}
                          triggerVariant="ghost"
                          triggerSize="sm"
                          onConfirm={() => handleRemoveMember(member.id, member.user_name || member.user_email)}
                        />
                      </>
                    )}
                    {isUpdating && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="flat">
        <GlowCardHeader>
          <GlowCardTitle>Role permissions</GlowCardTitle>
          <GlowCardDescription>Preview what each role can access.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent>
          <PermissionsMatrix />
        </GlowCardContent>
      </GlowCard>
    </Stack>
  );
}
