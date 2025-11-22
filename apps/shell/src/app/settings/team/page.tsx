'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowInput, GlowButton, GlowBadge } from '@/components/glow-ui';
import { mockTeamMembers, mockPendingInvites, TeamRole } from '@/lib/mock-data';
import { PermissionsMatrix } from '@/components/settings/PermissionsMatrix';
import { ConfirmDialog } from '@/components/settings/ConfirmDialog';
import { Plus, Send, Users, Clock3, RefreshCcw } from 'lucide-react';
import { Grid, Stack, spacing, semanticColors } from '@/design-system';

export default function TeamSettingsPage() {
  const [invites, setInvites] = React.useState(mockPendingInvites);
  const [members, setMembers] = React.useState(mockTeamMembers);
  const [inviteForm, setInviteForm] = React.useState({ email: '', role: 'Viewer' as TeamRole });

  const handleInvite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inviteForm.email) return;
    setInvites((prev) => [
      ...prev,
      {
        id: `inv-${Date.now()}`,
        email: inviteForm.email,
        role: inviteForm.role,
        invitedAt: new Date(),
        status: 'pending',
      },
    ]);
    setInviteForm({ email: '', role: inviteForm.role });
  };

  return (
    <Stack gap="6xl">
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
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, role: e.target.value as TeamRole }))}
                  className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
                >
                  {(['Owner', 'Admin', 'Editor', 'Viewer'] as TeamRole[]).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
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
                    onClick={() => console.log('resend invite', invite.id)}
                  >
                    Resend
                  </GlowButton>
                  <GlowButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setInvites((prev) => prev.filter((i) => i.id !== invite.id))}
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
                  <select
                    value={member.role}
                    onChange={(e) =>
                      setMembers((prev) =>
                        prev.map((m) => (m.id === member.id ? { ...m, role: e.target.value as TeamRole } : m))
                      )
                    }
                    className="h-9 rounded-md border border-input bg-transparent px-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
                  >
                    {(['Owner', 'Admin', 'Editor', 'Viewer'] as TeamRole[]).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <ConfirmDialog
                    title="Remove member"
                    description={`Remove ${member.name} from this workspace? They will lose access immediately.`}
                    triggerLabel="Remove"
                    triggerVariant="ghost"
                    triggerSize="sm"
                    onConfirm={() => setMembers((prev) => prev.filter((m) => m.id !== member.id))}
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
