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
import { mockTeamMembers, mockPendingInvites } from '@/lib/mock-data';
import { type TeamMember, type PendingInvite, type TeamRole } from '@/types/team';
import { teamService } from '@/services/teamService';
import { PermissionsMatrix } from '@/components/settings/PermissionsMatrix';
import { ConfirmDialog } from '@/components/settings/ConfirmDialog';
import { Plus, Send, Users, Clock3, RefreshCcw } from 'lucide-react';
import { Grid, Stack, spacing, semanticColors } from '@/design-system';

export default function TeamSettingsPage() {
  const [invites, setInvites] = React.useState<PendingInvite[]>([]);
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [inviteForm, setInviteForm] = React.useState({ email: '', role: 'Viewer' as TeamRole });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Load data on mount
  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Initialize with mock data if empty
      await teamService.initializeMockData(mockTeamMembers, mockPendingInvites);

      const [loadedMembers, loadedInvites] = await Promise.all([
        teamService.getTeamMembers(),
        teamService.getPendingInvites(),
      ]);

      setMembers(loadedMembers);
      setInvites(loadedInvites);
    } catch (err) {
      console.error('Failed to load team data:', err);
    }
  };

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inviteForm.email) return;

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await teamService.inviteMember({ email: inviteForm.email, role: inviteForm.role });
      setInviteForm({ email: '', role: inviteForm.role });
      setSuccess(`Invitation sent to ${inviteForm.email}`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (inviteId: string) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await teamService.resendInvite(inviteId);
      setSuccess('Invitation resent successfully');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await teamService.cancelInvite(inviteId);
      setSuccess('Invitation cancelled');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await teamService.removeMember(memberId);
      setSuccess('Member removed successfully');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: TeamRole) => {
    setError(null);
    setSuccess(null);

    try {
      await teamService.updateMemberRole(memberId, newRole);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update member role');
    }
  };

  return (
    <Stack gap="6xl">
      {error && (
        <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success/10 border border-success/50 text-success px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <GlowCard variant="elevated">
        <GlowCardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <GlowCardTitle>Invite team members</GlowCardTitle>
            <GlowCardDescription>Send an invite to collaborate in this workspace.</GlowCardDescription>
          </div>
          <GlowBadge variant="info" size="sm">SSO enabled</GlowBadge>
        </GlowCardHeader>
        <GlowCardContent>
          <form onSubmit={handleInvite}>
            <Grid columns={3} gap="lg">
              <GlowInput
                label="Email"
                placeholder="teammate@organization.org"
                value={inviteForm.email}
                onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                leftIcon={<Users className="h-4 w-4" />}
                disabled={isLoading}
              />
              <div className="space-y-2">
                <GlowSelect
                  label="Role"
                  name="invite-role"
                  data-testid="invite-role-select"
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, role: e.target.value as TeamRole }))}
                  className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
                  data-glow-select="true"
                >
                  {(['Owner', 'Admin', 'Editor', 'Viewer'] as TeamRole[]).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </GlowSelect>
              </div>
              <GlowButton type="submit" leftIcon={<Send className="h-4 w-4" />}>
                Send invite
              </GlowButton>
            </Grid>
          </form>
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="flat">
        <GlowCardHeader>
          <GlowCardTitle>Pending invites</GlowCardTitle>
          <GlowCardDescription>Track outstanding invitations.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent>
          <Stack gap="lg">
            {invites.map((invite) => (
              <Stack
                key={invite.id}
                direction="row"
                justify="space-between"
                align="center"
                style={{
                  borderRadius: spacing['3xl'],
                  border: `1px solid ${semanticColors.borderSecondary}`,
                  padding: spacing['3xl'],
                }}
              >
                <Stack gap="xs">
                  <p className="text-sm font-semibold text-foreground">{invite.email}</p>
                  <Stack direction="row" gap="xs" align="center" className="text-xs text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" />
                    Invited {invite.invitedAt.toLocaleDateString()}
                  </Stack>
                </Stack>
                <Stack direction="row" gap="sm" align="center">
                  <GlowBadge variant="outline" size="sm">
                    {invite.role}
                  </GlowBadge>
                  <GlowButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    leftIcon={<RefreshCcw className="h-3.5 w-3.5" />}
                    onClick={() => handleResend(invite.id)}
                    disabled={isLoading}
                  >
                    Resend
                  </GlowButton>
                  <GlowButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancelInvite(invite.id)}
                    disabled={isLoading}
                  >
                    Cancel
                  </GlowButton>
                </Stack>
              </Stack>
            ))}
            {invites.length === 0 && (
              <p className="text-sm text-muted-foreground">No pending invites.</p>
            )}
          </Stack>
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="elevated">
        <GlowCardHeader>
          <GlowCardTitle>Members</GlowCardTitle>
          <GlowCardDescription>Manage roles and access for your team.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent>
          <Stack gap="lg">
            {members.map((member) => (
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
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <Stack gap="xs">
                    <p className="text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {member.joinedAt.toLocaleDateString()}
                    </p>
                  </Stack>
                </Stack>
                <Stack direction="row" gap="xs" align="center">
                  <GlowBadge variant="outline" size="sm">
                    {member.role}
                  </GlowBadge>
                  <GlowSelect
                    aria-label={`${member.name} role`}
                    name={`member-role-${member.id}`}
                    data-testid={`member-role-${member.id}`}
                    value={member.role}
                    onChange={(e) =>
                      setMembers((prev) =>
                        prev.map((m) => (m.id === member.id ? { ...m, role: e.target.value as TeamRole } : m))
                      )
                    }
                    className="h-9 rounded-md border border-input bg-transparent px-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
                    data-glow-select="true"
                  >
                    {(['Owner', 'Admin', 'Editor', 'Viewer'] as TeamRole[]).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </GlowSelect>
                  <ConfirmDialog
                    title="Remove member"
                    description={`Remove ${member.name} from this workspace? They will lose access immediately.`}
                    triggerLabel="Remove"
                    triggerVariant="ghost"
                    triggerSize="sm"
                    onConfirm={() => handleRemoveMember(member.id)}
                  />
                </Stack>
              </Stack>
            ))}
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
