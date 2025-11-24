export type TeamRole = 'Owner' | 'Admin' | 'Editor' | 'Viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatar?: string;
  joinedAt: Date;
  status?: 'active' | 'invited' | 'inactive';
}

export interface PendingInvite {
  id: string;
  email: string;
  role: TeamRole;
  invitedAt: Date;
  status: 'pending' | 'accepted' | 'expired';
}

export interface TeamInvite {
  email: string;
  role: TeamRole;
}
