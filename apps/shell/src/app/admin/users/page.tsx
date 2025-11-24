'use client';

import * as React from 'react';
import {
  GlowBadge,
  GlowButton,
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowInput,
  GlowModal,
  GlowSelect,
} from '@/components/glow-ui';
import {
  mockAdminUsers,
  mockAdminInvites,
  mockAdminOrganizations,
  mockPermissionMatrix,
  type AdminUserRecord,
  type AdminUserStatus,
} from '@/lib/mock-admin';
import type { UserRole } from '@/lib/auth';
import { formatDistanceToNow } from 'date-fns';
import { UserPlus, ShieldCheck } from 'lucide-react';
import { userAdminService } from '@/services/userAdminService';

const roles: UserRole[] = ['super_admin', 'org_admin', 'funder_admin', 'member', 'viewer'];

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<AdminUserRecord[]>(mockAdminUsers);
  const [invites, setInvites] = React.useState(mockAdminInvites);
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<UserRole | 'all'>('all');
  const [orgFilter, setOrgFilter] = React.useState<string>('all');
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<AdminUserRecord | null>(null);
  const [inviteForm, setInviteForm] = React.useState({
    email: '',
    role: 'member' as UserRole,
    orgId: mockAdminOrganizations[0]?.id ?? '',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Clear messages after 5 seconds
  React.useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const loadUsers = async () => {
    try {
      const savedUsers = await userAdminService.getUsers();
      if (savedUsers.length > 0) {
        setUsers(savedUsers);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !search ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesOrg = orgFilter === 'all' || user.orgId === orgFilter;
    return matchesSearch && matchesRole && matchesOrg;
  });

  const handleSendInvite = () => {
    if (!inviteForm.email) return;
    const org = mockAdminOrganizations.find((organization) => organization.id === inviteForm.orgId);
    const newInvite = {
      id: `invite-${Date.now()}`,
      email: inviteForm.email,
      role: inviteForm.role,
      orgId: inviteForm.orgId,
      orgName: org?.name ?? 'Workspace',
      invitedAt: new Date(),
      status: 'pending' as const,
    };
    setInvites((prev) => [newInvite, ...prev]);
    setUsers((prev) => [
      {
        id: `user-${Date.now()}`,
        name: inviteForm.email.split('@')[0],
        email: inviteForm.email,
        role: inviteForm.role,
        orgId: inviteForm.orgId,
        orgName: org?.name ?? 'Workspace',
        lastLogin: null,
        status: 'invited',
      },
      ...prev,
    ]);
    setInviteForm({
      email: '',
      role: 'member',
      orgId: mockAdminOrganizations[0]?.id ?? '',
    });
    setInviteModalOpen(false);
  };

  const openEditModal = (user: AdminUserRecord) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    try {
      const updatedUsers = users.map((user) => (user.id === selectedUser.id ? selectedUser : user));
      setUsers(updatedUsers);
      await userAdminService.saveUsers(updatedUsers);
      setSuccess('User updated successfully');
      setEditModalOpen(false);
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (user: AdminUserRecord) => {
    const action = user.status === 'active' ? 'deactivate' : 'activate';

    if (!confirm(`${action.toUpperCase()} user "${user.email}"?\n\nThis will ${action} their access to the platform.`)) {
      return;
    }

    setIsLoading(true);

    try {
      await userAdminService.toggleUserStatus(user.id, user.status !== 'active');
      await loadUsers();
      setSuccess(`User ${action}d successfully`);
    } catch (err) {
      setError(`Failed to ${action} user`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (user: AdminUserRecord) => {
    if (
      !confirm(
        `Reset password for "${user.email}"?\n\nA temporary password will be generated. In production, this would be emailed to the user.`
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const tempPassword = await userAdminService.resetPassword(user.id);
      alert(`Temporary password: ${tempPassword}\n\nIn production, this would be emailed to the user.`);
      setSuccess('Password reset email sent');
    } catch (err) {
      setError('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (user: AdminUserRecord) => {
    if (
      !confirm(
        `⚠️ DELETE user "${user.email}"?\n\nThis will:\n- Remove their access to all organizations\n- Delete all their data\n- This action CANNOT be undone\n\nType the email to confirm:`
      )
    ) {
      return;
    }

    const typedEmail = prompt(`Type "${user.email}" to confirm deletion:`);

    if (typedEmail !== user.email) {
      alert('Email does not match. Deletion cancelled.');
      return;
    }

    setIsLoading(true);

    try {
      await userAdminService.deleteUser(user.id);
      await loadUsers();
      setSuccess('User deleted successfully');
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-vision-error-600 bg-vision-error-50 px-4 py-3 text-vision-error-600" role="alert">
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-vision-success-600 bg-vision-success-50 px-4 py-3 text-vision-success-600" role="status">
          <strong className="font-semibold">Success:</strong> {success}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Users & access</h1>
          <p className="text-sm text-muted-foreground">
            Grant or revoke access to organizations, funder cohorts, and billing tools.
          </p>
        </div>
        <GlowButton glow="subtle" leftIcon={<UserPlus className="h-4 w-4" />} onClick={() => setInviteModalOpen(true)}>
          Invite user
        </GlowButton>
      </div>

      <GlowCard variant="interactive">
        <GlowCardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <GlowCardTitle>People directory</GlowCardTitle>
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <GlowInput
              placeholder="Search by name or email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <GlowSelect value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as UserRole | 'all')}>
              <option value="all">All roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.replace('_', ' ')}
                </option>
              ))}
            </GlowSelect>
            <GlowSelect value={orgFilter} onChange={(event) => setOrgFilter(event.target.value)}>
              <option value="all">All orgs</option>
              {mockAdminOrganizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </GlowSelect>
          </div>
        </GlowCardHeader>
        <GlowCardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              List of users with name, email, role, organization, last login, status, and actions
            </caption>
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-3 py-2 font-semibold">User</th>
                <th scope="col" className="px-3 py-2 font-semibold">Role</th>
                <th scope="col" className="px-3 py-2 font-semibold">Organization</th>
                <th scope="col" className="px-3 py-2 font-semibold">Last login</th>
                <th scope="col" className="px-3 py-2 font-semibold">Status</th>
                <th scope="col" className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">{user.role.replace('_', ' ')}</td>
                  <td className="px-3 py-3">{user.orgName}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">
                    {user.lastLogin ? formatDistanceToNow(user.lastLogin, { addSuffix: true }) : 'Never'}
                  </td>
                  <td className="px-3 py-3">
                    <GlowBadge
                      variant={
                        user.status === 'active' ? 'success' : user.status === 'invited' ? 'info' : 'warning'
                      }
                    >
                      {user.status}
                      <span className="sr-only">user status</span>
                    </GlowBadge>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <GlowButton
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(user)}
                        aria-label={`Edit user ${user.email}`}
                      >
                        Edit
                      </GlowButton>
                      <GlowButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                        disabled={isLoading}
                        aria-label={`${user.status === 'active' ? 'Deactivate' : 'Activate'} user ${user.email}`}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </GlowButton>
                      <GlowButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResetPassword(user)}
                        disabled={isLoading}
                        aria-label={`Reset password for ${user.email}`}
                      >
                        Reset Password
                      </GlowButton>
                      <GlowButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        disabled={isLoading}
                        aria-label={`Delete user ${user.email}`}
                      >
                        Delete
                      </GlowButton>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredUsers.length && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </GlowCardContent>
      </GlowCard>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <GlowCard variant="flat">
          <GlowCardHeader>
            <GlowCardTitle>Permissions matrix</GlowCardTitle>
          </GlowCardHeader>
          <GlowCardContent className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Permissions matrix showing capabilities available to each user role
              </caption>
              <thead>
                <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="px-3 py-2 font-semibold">Capability</th>
                  {roles.map((role) => (
                    <th key={role} scope="col" className="px-3 py-2 font-semibold text-center">
                      {role.replace('_', ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockPermissionMatrix.map((row) => (
                  <tr key={row.capability}>
                    <td className="px-3 py-3 font-medium text-foreground">{row.capability}</td>
                    {roles.map((role) => (
                      <td key={role} className="px-3 py-3 text-center">
                        {row.roles[role] ? (
                          <ShieldCheck className="mx-auto h-4 w-4 text-vision-success-600" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </GlowCardContent>
        </GlowCard>

        <GlowCard variant="interactive">
          <GlowCardHeader>
            <GlowCardTitle>Pending invites</GlowCardTitle>
          </GlowCardHeader>
          <GlowCardContent className="space-y-3">
            {invites.slice(0, 5).map((invite) => (
              <div key={invite.id} className="rounded-lg border border-border px-3 py-2">
                <p className="text-sm font-semibold text-foreground">{invite.email}</p>
                <p className="text-xs text-muted-foreground">
                  {invite.role.replace('_', ' ')} · {invite.orgName}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Invited {formatDistanceToNow(invite.invitedAt, { addSuffix: true })}
                </p>
              </div>
            ))}
            {!invites.length && (
              <p className="text-sm text-muted-foreground">No pending invitations.</p>
            )}
          </GlowCardContent>
        </GlowCard>
      </div>

      <GlowModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        title="Invite user"
        description="Send an invite with predefined org access."
        size="lg"
        footer={
          <>
            <GlowButton variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </GlowButton>
            <GlowButton glow="subtle" onClick={handleSendInvite}>
              Send invite
            </GlowButton>
          </>
        }
      >
        <div className="space-y-4">
          <GlowInput
            label="Email"
            type="email"
            value={inviteForm.email}
            onChange={(event) => setInviteForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <GlowSelect
            label="Role"
            value={inviteForm.role}
            onChange={(event) =>
              setInviteForm((prev) => ({ ...prev, role: event.target.value as UserRole }))
            }
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.replace('_', ' ')}
              </option>
            ))}
          </GlowSelect>
          <GlowSelect
            label="Organization"
            value={inviteForm.orgId}
            onChange={(event) => setInviteForm((prev) => ({ ...prev, orgId: event.target.value }))}
          >
            {mockAdminOrganizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </GlowSelect>
        </div>
      </GlowModal>

      <GlowModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="Edit user"
        description="Update role or deactivate access."
        size="lg"
        footer={
          <>
            <GlowButton variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </GlowButton>
            <GlowButton glow="subtle" onClick={handleSaveUser}>
              Save changes
            </GlowButton>
          </>
        }
      >
        {selectedUser && (
          <div className="space-y-4">
            <GlowInput label="Name" value={selectedUser.name} readOnly />
            <GlowInput label="Email" value={selectedUser.email} readOnly />
            <GlowSelect
              label="Role"
              value={selectedUser.role}
              onChange={(event) =>
                setSelectedUser((prev) => prev && { ...prev, role: event.target.value as UserRole })
              }
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.replace('_', ' ')}
                </option>
              ))}
            </GlowSelect>
            <GlowSelect
              label="Status"
              value={selectedUser.status}
              onChange={(event) =>
                setSelectedUser(
                  (prev) => prev && { ...prev, status: event.target.value as AdminUserStatus }
                )
              }
            >
              {['active', 'invited', 'suspended'].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </GlowSelect>
          </div>
        )}
      </GlowModal>
    </div>
  );
}

