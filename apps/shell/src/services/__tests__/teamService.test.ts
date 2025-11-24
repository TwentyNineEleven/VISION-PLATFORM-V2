import { describe, it, expect, vi, beforeEach } from 'vitest';
import { teamService } from '../teamService';
import { createClient } from '@/lib/supabase/client';
import {
  createMockSupabaseClient,
  createMockSupabaseError,
  mockUser,
} from '@/test/testUtils';

// Mock the Supabase client
vi.mock('@/lib/supabase/client');

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
          id: 'member-1',
          organization_id: 'org-123',
          user_id: 'user-1',
          role: 'Owner',
          status: 'active',
          joined_at: new Date().toISOString(),
          deleted_at: null,
          users: {
            id: 'user-1',
            name: 'User One',
            email: 'user1@example.com',
            avatar_url: null,
          },
        },
        {
          id: 'member-2',
          organization_id: 'org-123',
          user_id: 'user-2',
          role: 'Admin',
          status: 'active',
          joined_at: new Date().toISOString(),
          deleted_at: null,
          users: {
            id: 'user-2',
            name: 'User Two',
            email: 'user2@example.com',
            avatar_url: null,
          },
        },
      ];

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().is().order as any).mockResolvedValue({
        data: members,
        error: null,
      });

      const result = await teamService.getTeamMembers('org-123');

      expect(result).toHaveLength(2);
      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
      expect(mockQuery.eq).toHaveBeenCalledWith('organization_id', 'org-123');
      expect(mockQuery.is).toHaveBeenCalledWith('deleted_at', null);
    });

    it('should exclude deleted members', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().is().order as any).mockResolvedValue({
        data: [],
        error: null,
      });

      await teamService.getTeamMembers('org-123');

      expect(mockQuery.is).toHaveBeenCalledWith('deleted_at', null);
    });

    it('should return empty array on error', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().is().order as any).mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Database error'),
      });

      const result = await teamService.getTeamMembers('org-123');

      expect(result).toEqual([]);
    });
  });

  describe('inviteMember', () => {
    it('should send invitation to new member', async () => {
      const organizationId = 'org-123';
      const invite = {
        email: 'newuser@example.com',
        role: 'Editor' as const,
      };

      // Set up mocks for each from() call in order
      let fromCallCount = 0;
      mockSupabase.from.mockImplementation(() => {
        const query = createMockSupabaseClient().from();
        fromCallCount++;
        
        // First call: getTeamMembers - returns empty array
        if (fromCallCount === 1) {
          (query.select().eq().is().order as any).mockResolvedValue({
            data: [],
            error: null,
          });
        }
        // Second call: check for existing invite - return null (not found)
        else if (fromCallCount === 2) {
          query.single.mockResolvedValue({
            data: null,
            error: createMockSupabaseError('Not found', 'PGRST116'),
          });
        }
        // Third call: get inviter info
        else if (fromCallCount === 3) {
          query.single.mockResolvedValue({
            data: { name: 'Inviter', email: 'inviter@example.com' },
            error: null,
          });
        }
        // Fourth call: insert invite
        else if (fromCallCount === 4) {
          const newInvite = {
            id: 'invite-123',
            organization_id: organizationId,
            email: invite.email.toLowerCase(),
            role: invite.role,
            token: 'test-token-123',
            status: 'pending',
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          };
          query.single.mockResolvedValue({
            data: newInvite,
            error: null,
          });
        }
        
        return query;
      });

      const result = await teamService.inviteMember(organizationId, invite);

      expect(result.id).toBe('invite-123');
      expect(result.email).toBe('newuser@example.com');
    });

    it('should validate email format', async () => {
      const invite = {
        email: 'invalid-email',
        role: 'Editor' as const,
      };

      await expect(teamService.inviteMember('org-123', invite)).rejects.toThrow('Invalid email address');
    });

    it('should reject if email is already a member', async () => {
      const organizationId = 'org-123';
      const invite = {
        email: 'existing@example.com',
        role: 'Editor' as const,
      };

      // Mock getTeamMembers returning existing member
      const mockMembersQuery = mockSupabase.from();
      (mockMembersQuery.select().eq().is().order as any).mockResolvedValue({
        data: [
          {
            id: 'member-1',
            organization_id: organizationId,
            users: {
              email: 'existing@example.com',
            },
          },
        ],
        error: null,
      });

      await expect(teamService.inviteMember(organizationId, invite)).rejects.toThrow('already a team member');
    });

    it('should reject if pending invite already exists', async () => {
      const organizationId = 'org-123';
      const invite = {
        email: 'pending@example.com',
        role: 'Editor' as const,
      };

      // Mock getTeamMembers (no existing members)
      const mockMembersQuery = mockSupabase.from();
      (mockMembersQuery.select().eq().is().order as any).mockResolvedValue({
        data: [],
        error: null,
      });

      // Mock checking for existing invite - returns existing invite
      const mockInviteCheckQuery = mockSupabase.from();
      (mockInviteCheckQuery.select().eq().eq().eq().is().single as any).mockResolvedValue({
        data: { id: 'existing-invite' },
        error: null,
      });

      await expect(teamService.inviteMember(organizationId, invite)).rejects.toThrow('already been sent');
    });
  });

  describe('getPendingInvites', () => {
    it('should fetch pending invitations', async () => {
      const invites = [
        {
          id: 'invite-1',
          organization_id: 'org-123',
          email: 'user1@example.com',
          role: 'Editor',
          status: 'pending',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'invite-2',
          organization_id: 'org-123',
          email: 'user2@example.com',
          role: 'Viewer',
          status: 'pending',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      // Mock RPC call
      mockSupabase.rpc.mockResolvedValue({ data: null, error: null });

      // Mock query
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().is().order as any).mockResolvedValue({
        data: invites,
        error: null,
      });

      const result = await teamService.getPendingInvites('org-123');

      expect(result).toHaveLength(2);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('expire_old_invites');
      expect(mockSupabase.from).toHaveBeenCalledWith('organization_invites');
      expect(mockQuery.eq).toHaveBeenCalledWith('organization_id', 'org-123');
    });

    it('should return empty array when no pending invites', async () => {
      mockSupabase.rpc.mockResolvedValue({ data: null, error: null });

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().is().order as any).mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await teamService.getPendingInvites('org-123');

      expect(result).toEqual([]);
    });
  });

  describe('acceptInvite', () => {
    it('should accept invitation and add member', async () => {
      const token = 'test-token-123';
      const inviteData = {
        organization_id: 'org-123',
        role: 'Editor',
      };

      // Mock getInviteByToken
      const mockInviteQuery = mockSupabase.from();
      (mockInviteQuery.select().eq().is().single as any).mockResolvedValue({
        data: {
          id: 'invite-123',
          organization_id: 'org-123',
          email: 'user@example.com',
          role: 'Editor',
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          organizations: { name: 'Test Org' },
        },
        error: null,
      });

      // Mock getting user profile
      const mockUserQuery = mockSupabase.from();
      (mockUserQuery.select().eq().single as any).mockResolvedValue({
        data: { email: 'user@example.com' },
        error: null,
      });

      // Mock getting invite data
      const mockInviteDataQuery = mockSupabase.from();
      (mockInviteDataQuery.select().eq().single as any).mockResolvedValue({
        data: inviteData,
        error: null,
      });

      // Mock creating member
      const mockMemberQuery = mockSupabase.from();
      (mockMemberQuery.insert as any).mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock updating invite status
      const mockUpdateQuery = mockSupabase.from();
      (mockUpdateQuery.update().eq as any).mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await teamService.acceptInvite(token);

      expect(result.organizationId).toBe('org-123');
      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
    });

    it('should reject expired invitation', async () => {
      const mockInviteQuery = mockSupabase.from();
      (mockInviteQuery.select().eq().is().single as any).mockResolvedValue({
        data: {
          id: 'invite-123',
          organization_id: 'org-123',
          email: 'user@example.com',
          role: 'Editor',
          status: 'pending',
          expires_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          organizations: { name: 'Test Org' },
        },
        error: null,
      });

      await expect(teamService.acceptInvite('expired-token')).rejects.toThrow('expired');
    });
  });

  describe('cancelInvite', () => {
    it('should cancel pending invitation', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.update().eq().eq().is as any).mockResolvedValue({
        data: null,
        error: null,
      });

      await teamService.cancelInvite('org-123', 'invite-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('organization_invites');
      expect(mockQuery.update).toHaveBeenCalledWith({ status: 'cancelled' });
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'invite-123');
      expect(mockQuery.eq).toHaveBeenCalledWith('organization_id', 'org-123');
    });

    it('should throw error when cancellation fails', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.update().eq().eq().is as any).mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Cancellation failed'),
      });

      await expect(teamService.cancelInvite('org-123', 'invite-123')).rejects.toThrow();
    });
  });

  describe('removeMember', () => {
    it('should remove member from organization', async () => {
      const mockQuery = mockSupabase.from();
      // Mock the final chain result - update().eq().eq() returns the query, which is then awaited
      (mockQuery as any).mockResolvedValue = vi.fn((value: any) => {
        const promise = Promise.resolve(value);
        mockQuery.then = promise.then.bind(promise);
        return mockQuery;
      });
      (mockQuery.update().eq().eq as any).mockResolvedValue({
        data: null,
        error: null,
      });

      await teamService.removeMember('org-123', 'member-456');

      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
      expect(mockQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          deleted_at: expect.any(String),
          deleted_by: mockUser.id,
        })
      );
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'member-456');
      expect(mockQuery.eq).toHaveBeenCalledWith('organization_id', 'org-123');
    });

    it('should handle removal errors', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.update().eq().eq as any).mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Removal failed'),
      });

      await expect(teamService.removeMember('org-123', 'member-456')).rejects.toThrow();
    });
  });

  describe('updateMemberRole', () => {
    it('should update member role', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.update().eq().eq().is as any).mockResolvedValue({
        data: null,
        error: null,
      });

      await teamService.updateMemberRole('org-123', 'member-456', 'Admin');

      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
      expect(mockQuery.update).toHaveBeenCalledWith({ role: 'Admin' });
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'member-456');
      expect(mockQuery.eq).toHaveBeenCalledWith('organization_id', 'org-123');
      expect(mockQuery.is).toHaveBeenCalledWith('deleted_at', null);
    });

    it('should handle update errors', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.update().eq().eq().is as any).mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Update failed'),
      });

      await expect(teamService.updateMemberRole('org-123', 'member-456', 'Admin')).rejects.toThrow();
    });
  });

  describe('resendInvite', () => {
    it('should resend invitation', async () => {
      const invite = {
        id: 'invite-123',
        email: 'user@example.com',
        organization_id: 'org-123',
        role: 'Editor',
        token: 'test-token',
        status: 'pending',
        resend_count: 0,
      };

      // Mock fetching invite
      const mockFetchQuery = mockSupabase.from();
      (mockFetchQuery.select().eq().eq().is().single as any).mockResolvedValue({
        data: invite,
        error: null,
      });

      // Mock updating invite
      const mockUpdateQuery = mockSupabase.from();
      (mockUpdateQuery.update().eq as any).mockResolvedValue({
        data: null,
        error: null,
      });

      await teamService.resendInvite('org-123', 'invite-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('organization_invites');
      expect(mockUpdateQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          resend_count: 1,
          last_sent_at: expect.any(String),
        })
      );
    });

    it('should not resend accepted invitation', async () => {
      const invite = {
        id: 'invite-123',
        email: 'user@example.com',
        organization_id: 'org-123',
        role: 'Editor',
        status: 'accepted',
      };

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().is().single as any).mockResolvedValue({
        data: invite,
        error: null,
      });

      await expect(teamService.resendInvite('org-123', 'invite-123')).rejects.toThrow('pending');
    });
  });

  describe('getMemberCount', () => {
    it('should return member count', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().is as any).mockResolvedValue({
        count: 5,
        error: null,
      });

      const count = await teamService.getMemberCount('org-123');

      expect(count).toBe(5);
      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
    });

    it('should return 0 on error', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().is as any).mockResolvedValue({
        count: null,
        error: createMockSupabaseError('Error'),
      });

      const count = await teamService.getMemberCount('org-123');

      expect(count).toBe(0);
    });
  });

  describe('canInviteMembers', () => {
    it('should return true for Owner', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().eq().is().single as any).mockResolvedValue({
        data: { role: 'Owner' },
        error: null,
      });

      const canInvite = await teamService.canInviteMembers('org-123');

      expect(canInvite).toBe(true);
    });

    it('should return true for Admin', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().eq().is().single as any).mockResolvedValue({
        data: { role: 'Admin' },
        error: null,
      });

      const canInvite = await teamService.canInviteMembers('org-123');

      expect(canInvite).toBe(true);
    });

    it('should return false for Editor', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().eq().is().single as any).mockResolvedValue({
        data: { role: 'Editor' },
        error: null,
      });

      const canInvite = await teamService.canInviteMembers('org-123');

      expect(canInvite).toBe(false);
    });

    it('should return false when not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const canInvite = await teamService.canInviteMembers('org-123');

      expect(canInvite).toBe(false);
    });
  });
});
