import { describe, it, expect, vi, beforeEach } from 'vitest';
import { teamService } from '../teamService';
import { createClient } from '@/lib/supabase/client';
import {
  createMockSupabaseClient,
  createMockSupabaseError,
  mockUser,
  mockOrganization,
  mockProfile,
} from '@/test/testUtils';

// Mock the Supabase client
vi.mock('@/lib/supabase/client');

// Mock email service
vi.mock('../emailService', () => ({
  emailService: {
    sendInvitation: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('teamService', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = createMockSupabaseClient({
      data: [],
      error: null,
    });
    (createClient as any).mockReturnValue(mockSupabase);
  });

  describe('getTeamMembers', () => {
    it('should fetch all team members for organization', async () => {
      const members = [
        {
          user_id: 'user-1',
          role: 'owner',
          profile: mockProfile,
        },
        {
          user_id: 'user-2',
          role: 'admin',
          profile: { ...mockProfile, id: 'user-2' },
        },
      ];

      mockSupabase.from().select().eq().is.mockResolvedValue({
        data: members,
        error: null,
      });

      const result = await teamService.getTeamMembers('org-123');

      expect(result).toHaveLength(2);
      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('organization_id', 'org-123');
    });

    it('should exclude deleted members', async () => {
      mockSupabase.from().select().eq().is.mockResolvedValue({
        data: [],
        error: null,
      });

      await teamService.getTeamMembers('org-123');

      expect(mockSupabase.from().is).toHaveBeenCalledWith('deleted_at', null);
    });

    it('should handle errors', async () => {
      mockSupabase.from().select().eq().is.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Database error'),
      });

      await expect(teamService.getTeamMembers('org-123')).rejects.toThrow();
    });
  });

  describe('inviteMember', () => {
    it('should send invitation to new member', async () => {
      const inviteData = {
        email: 'newuser@example.com',
        role: 'editor' as const,
        organizationId: 'org-123',
        invitedBy: 'user-123',
      };

      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: {
          id: 'invite-123',
          token: 'test-token-123',
          ...inviteData,
        },
        error: null,
      });

      const result = await teamService.inviteMember(inviteData);

      expect(result.id).toBe('invite-123');
      expect(result.email).toBe('newuser@example.com');
      expect(mockSupabase.from).toHaveBeenCalledWith('organization_invites');
    });

    it('should validate role value', async () => {
      const inviteData = {
        email: 'newuser@example.com',
        role: 'invalid-role' as any,
        organizationId: 'org-123',
        invitedBy: 'user-123',
      };

      await expect(teamService.inviteMember(inviteData)).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const inviteData = {
        email: 'invalid-email',
        role: 'editor' as const,
        organizationId: 'org-123',
        invitedBy: 'user-123',
      };

      await expect(teamService.inviteMember(inviteData)).rejects.toThrow();
    });

    it('should handle duplicate invitation', async () => {
      const inviteData = {
        email: 'existing@example.com',
        role: 'editor' as const,
        organizationId: 'org-123',
        invitedBy: 'user-123',
      };

      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Duplicate key', '23505'),
      });

      await expect(teamService.inviteMember(inviteData)).rejects.toThrow();
    });
  });

  describe('getPendingInvites', () => {
    it('should fetch pending invitations', async () => {
      const invites = [
        {
          id: 'invite-1',
          email: 'user1@example.com',
          role: 'editor',
          status: 'pending',
        },
        {
          id: 'invite-2',
          email: 'user2@example.com',
          role: 'viewer',
          status: 'pending',
        },
      ];

      mockSupabase.from().select().eq().eq.mockResolvedValue({
        data: invites,
        error: null,
      });

      const result = await teamService.getPendingInvites('org-123');

      expect(result).toHaveLength(2);
      expect(mockSupabase.from).toHaveBeenCalledWith('organization_invites');
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('status', 'pending');
    });

    it('should return empty array when no pending invites', async () => {
      mockSupabase.from().select().eq().eq.mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await teamService.getPendingInvites('org-123');

      expect(result).toEqual([]);
    });
  });

  describe('acceptInvite', () => {
    it('should accept invitation and add member', async () => {
      const invite = {
        id: 'invite-123',
        organization_id: 'org-123',
        email: 'user@example.com',
        role: 'editor',
        status: 'pending',
      };

      // Mock getting invite
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: invite,
        error: null,
      });

      // Mock updating invite status
      mockSupabase.from().update().eq.mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock adding member
      mockSupabase.from().insert.mockResolvedValue({
        data: null,
        error: null,
      });

      await teamService.acceptInvite('invite-token', 'user-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('organization_invites');
      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
    });

    it('should reject expired invitation', async () => {
      const expiredInvite = {
        id: 'invite-123',
        organization_id: 'org-123',
        email: 'user@example.com',
        role: 'editor',
        status: 'pending',
        expires_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      };

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: expiredInvite,
        error: null,
      });

      await expect(teamService.acceptInvite('expired-token', 'user-123')).rejects.toThrow();
    });

    it('should reject already accepted invitation', async () => {
      const acceptedInvite = {
        id: 'invite-123',
        organization_id: 'org-123',
        email: 'user@example.com',
        role: 'editor',
        status: 'accepted',
      };

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: acceptedInvite,
        error: null,
      });

      await expect(teamService.acceptInvite('used-token', 'user-123')).rejects.toThrow();
    });
  });

  describe('cancelInvite', () => {
    it('should cancel pending invitation', async () => {
      mockSupabase.from().update().eq().eq.mockResolvedValue({
        data: null,
        error: null,
      });

      await teamService.cancelInvite('invite-123', 'org-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('organization_invites');
      expect(mockSupabase.from().update).toHaveBeenCalledWith({
        status: 'cancelled',
        updated_at: expect.any(String),
      });
    });

    it('should throw error when cancellation fails', async () => {
      mockSupabase.from().update().eq().eq.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Cancellation failed'),
      });

      await expect(teamService.cancelInvite('invite-123', 'org-123')).rejects.toThrow();
    });
  });

  describe('removeMember', () => {
    it('should remove member from organization', async () => {
      mockSupabase.from().delete().eq().eq.mockResolvedValue({
        data: null,
        error: null,
      });

      await teamService.removeMember('org-123', 'user-456');

      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
      expect(mockSupabase.from().delete().eq).toHaveBeenCalledWith('organization_id', 'org-123');
    });

    it('should prevent removing last owner', async () => {
      // Mock checking if user is last owner
      mockSupabase.from().select().eq().eq().eq.mockResolvedValue({
        data: [{ user_id: 'user-123' }], // Only one owner
        error: null,
      });

      await expect(teamService.removeMember('org-123', 'user-123')).rejects.toThrow();
    });

    it('should handle removal errors', async () => {
      mockSupabase.from().delete().eq().eq.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Removal failed'),
      });

      await expect(teamService.removeMember('org-123', 'user-456')).rejects.toThrow();
    });
  });

  describe('updateMemberRole', () => {
    it('should update member role', async () => {
      mockSupabase.from().update().eq().eq.mockResolvedValue({
        data: null,
        error: null,
      });

      await teamService.updateMemberRole('org-123', 'user-456', 'admin');

      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
      expect(mockSupabase.from().update).toHaveBeenCalledWith({
        role: 'admin',
        updated_at: expect.any(String),
      });
    });

    it('should validate role value', async () => {
      await expect(
        teamService.updateMemberRole('org-123', 'user-456', 'invalid-role' as any)
      ).rejects.toThrow();
    });

    it('should prevent changing last owner role', async () => {
      // Mock checking if user is last owner
      mockSupabase.from().select().eq().eq().eq.mockResolvedValue({
        data: [{ user_id: 'user-123' }], // Only one owner
        error: null,
      });

      await expect(
        teamService.updateMemberRole('org-123', 'user-123', 'admin')
      ).rejects.toThrow();
    });
  });

  describe('getMemberRole', () => {
    it('should return member role', async () => {
      mockSupabase.from().select().eq().eq().single.mockResolvedValue({
        data: { role: 'admin' },
        error: null,
      });

      const role = await teamService.getMemberRole('org-123', 'user-123');

      expect(role).toBe('admin');
      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
    });

    it('should return null when member not found', async () => {
      mockSupabase.from().select().eq().eq().single.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Not found', 'PGRST116'),
      });

      const role = await teamService.getMemberRole('org-123', 'user-999');

      expect(role).toBeNull();
    });
  });

  describe('getTeamStats', () => {
    it('should return team statistics', async () => {
      const members = [
        { role: 'owner' },
        { role: 'admin' },
        { role: 'admin' },
        { role: 'editor' },
        { role: 'viewer' },
      ];

      mockSupabase.from().select().eq().is.mockResolvedValue({
        data: members,
        error: null,
      });

      const stats = await teamService.getTeamStats('org-123');

      expect(stats.totalMembers).toBe(5);
      expect(stats.byRole.owner).toBe(1);
      expect(stats.byRole.admin).toBe(2);
      expect(stats.byRole.editor).toBe(1);
      expect(stats.byRole.viewer).toBe(1);
    });

    it('should handle organization with no members', async () => {
      mockSupabase.from().select().eq().is.mockResolvedValue({
        data: [],
        error: null,
      });

      const stats = await teamService.getTeamStats('org-123');

      expect(stats.totalMembers).toBe(0);
      expect(stats.byRole).toEqual({
        owner: 0,
        admin: 0,
        editor: 0,
        viewer: 0,
      });
    });
  });

  describe('resendInvite', () => {
    it('should resend invitation email', async () => {
      const invite = {
        id: 'invite-123',
        email: 'user@example.com',
        organization_id: 'org-123',
        role: 'editor',
        token: 'test-token',
        status: 'pending',
      };

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: invite,
        error: null,
      });

      await teamService.resendInvite('invite-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('organization_invites');
    });

    it('should not resend accepted invitation', async () => {
      const invite = {
        id: 'invite-123',
        email: 'user@example.com',
        organization_id: 'org-123',
        role: 'editor',
        status: 'accepted',
      };

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: invite,
        error: null,
      });

      await expect(teamService.resendInvite('invite-123')).rejects.toThrow();
    });
  });

  describe('bulkInviteMembers', () => {
    it('should send multiple invitations', async () => {
      const invites = [
        { email: 'user1@example.com', role: 'editor' as const },
        { email: 'user2@example.com', role: 'viewer' as const },
      ];

      mockSupabase.from().insert.mockResolvedValue({
        data: null,
        error: null,
      });

      await teamService.bulkInviteMembers('org-123', invites, 'user-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('organization_invites');
      expect(mockSupabase.from().insert).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ email: 'user1@example.com' }),
          expect.objectContaining({ email: 'user2@example.com' }),
        ])
      );
    });

    it('should validate all emails', async () => {
      const invites = [
        { email: 'valid@example.com', role: 'editor' as const },
        { email: 'invalid-email', role: 'viewer' as const },
      ];

      await expect(
        teamService.bulkInviteMembers('org-123', invites, 'user-123')
      ).rejects.toThrow();
    });

    it('should handle empty array', async () => {
      await expect(teamService.bulkInviteMembers('org-123', [], 'user-123')).rejects.toThrow();
    });
  });
});
