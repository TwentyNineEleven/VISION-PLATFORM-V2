import type { TeamMember, PendingInvite, TeamInvite, TeamRole } from '@/types/team';

const TEAM_MEMBERS_KEY = 'vision_team_members';
const PENDING_INVITES_KEY = 'vision_pending_invites';

export const teamService = {
  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    if (typeof window === 'undefined') return [];

    const members = localStorage.getItem(TEAM_MEMBERS_KEY);
    if (!members) return [];

    return JSON.parse(members, (key, value) => {
      if (key === 'joinedAt' && value) {
        return new Date(value);
      }
      return value;
    });
  },

  async removeMember(memberId: string): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot remove member on server');

    const members = await this.getTeamMembers();
    const filtered = members.filter((m) => m.id !== memberId);

    if (filtered.length === members.length) {
      throw new Error('Member not found');
    }

    localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(filtered));
  },

  async updateMemberRole(memberId: string, newRole: TeamRole): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot update member role on server');

    const members = await this.getTeamMembers();
    const member = members.find((m) => m.id === memberId);

    if (!member) {
      throw new Error('Member not found');
    }

    member.role = newRole;
    localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(members));
  },

  // Pending Invites
  async getPendingInvites(): Promise<PendingInvite[]> {
    if (typeof window === 'undefined') return [];

    const invites = localStorage.getItem(PENDING_INVITES_KEY);
    if (!invites) return [];

    return JSON.parse(invites, (key, value) => {
      if (key === 'invitedAt' && value) {
        return new Date(value);
      }
      return value;
    });
  },

  async inviteMember(invite: TeamInvite): Promise<PendingInvite> {
    if (typeof window === 'undefined') throw new Error('Cannot invite member on server');

    // Validate email
    if (!invite.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.email)) {
      throw new Error('Invalid email address');
    }

    // Check for duplicate in members
    const members = await this.getTeamMembers();
    if (members.some((m) => m.email.toLowerCase() === invite.email.toLowerCase())) {
      throw new Error('This email is already a team member');
    }

    // Check for duplicate in pending invites
    const invites = await this.getPendingInvites();
    if (invites.some((i) => i.email.toLowerCase() === invite.email.toLowerCase() && i.status === 'pending')) {
      throw new Error('An invitation has already been sent to this email');
    }

    const newInvite: PendingInvite = {
      id: `inv-${Date.now()}`,
      email: invite.email,
      role: invite.role,
      invitedAt: new Date(),
      status: 'pending',
    };

    invites.push(newInvite);
    localStorage.setItem(PENDING_INVITES_KEY, JSON.stringify(invites));
    return newInvite;
  },

  async resendInvite(inviteId: string): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot resend invite on server');

    const invites = await this.getPendingInvites();
    const invite = invites.find((i) => i.id === inviteId);

    if (!invite) {
      throw new Error('Invite not found');
    }

    if (invite.status !== 'pending') {
      throw new Error('Can only resend pending invitations');
    }

    // Update invited timestamp
    invite.invitedAt = new Date();
    localStorage.setItem(PENDING_INVITES_KEY, JSON.stringify(invites));
  },

  async cancelInvite(inviteId: string): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot cancel invite on server');

    const invites = await this.getPendingInvites();
    const filtered = invites.filter((i) => i.id !== inviteId);

    if (filtered.length === invites.length) {
      throw new Error('Invite not found');
    }

    localStorage.setItem(PENDING_INVITES_KEY, JSON.stringify(filtered));
  },

  // Initialize with mock data if empty
  async initializeMockData(members: TeamMember[], invites: PendingInvite[]): Promise<void> {
    if (typeof window === 'undefined') return;

    const existingMembers = await this.getTeamMembers();
    const existingInvites = await this.getPendingInvites();

    if (existingMembers.length === 0) {
      localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(members));
    }

    if (existingInvites.length === 0) {
      localStorage.setItem(PENDING_INVITES_KEY, JSON.stringify(invites));
    }
  },
};
