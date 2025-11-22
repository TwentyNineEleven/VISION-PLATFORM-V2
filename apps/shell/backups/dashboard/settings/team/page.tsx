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
import { Plus, Send, Users, Clock3 } from 'lucide-react';

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
    <div className="space-y-6">
      <GlowCard variant="elevated">
        <GlowCardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <GlowCardTitle>Invite team members</GlowCardTitle>
            <GlowCardDescription>Send an invite to collaborate in this workspace.</GlowCardDescription>
          </div>
          <GlowBadge variant="info" size="sm">SSO enabled</GlowBadge>
        </GlowCardHeader>
        <GlowCardContent>
          <form onSubmit={handleInvite} className="grid gap-4 sm:grid-cols-[2fr,1fr,auto]">
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
            <GlowButton type="submit" className="self-end" leftIcon={<Send className="h-4 w-4" />}>
              Send invite
            </GlowButton>
          </form>
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="flat">
        <GlowCardHeader>
          <GlowCardTitle>Pending invites</GlowCardTitle>
          <GlowCardDescription>Track outstanding invitations.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent className="space-y-3">
          {invites.map((invite) => (
            <div key={invite.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{invite.email}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5" />
                  Invited {invite.invitedAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <GlowBadge variant="outline" size="sm">
                  {invite.role}
                </GlowBadge>
                <GlowButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setInvites((prev) => prev.filter((i) => i.id !== invite.id))}
                >
                  Cancel
                </GlowButton>
              </div>
            </div>
          ))}
          {invites.length === 0 && (
            <p className="text-sm text-muted-foreground">No pending invites.</p>
          )}
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="elevated">
        <GlowCardHeader>
          <GlowCardTitle>Members</GlowCardTitle>
          <GlowCardDescription>Manage roles and access for your team.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
                <GlowButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMembers((prev) => prev.filter((m) => m.id !== member.id))}
                >
                  Remove
                </GlowButton>
              </div>
            </div>
          ))}
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
    </div>
  );
}
