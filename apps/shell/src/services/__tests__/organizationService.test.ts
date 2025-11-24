import { describe, it, expect, vi, beforeEach } from 'vitest';
import { organizationService } from '../organizationService';
import { createClient } from '@/lib/supabase/client';
import {
  createMockSupabaseClient,
  createMockSupabaseError,
  mockOrganization,
  mockUser,
} from '@/test/testUtils';

// Mock the Supabase client
vi.mock('@/lib/supabase/client');

describe('organizationService', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = createMockSupabaseClient({
      data: [mockOrganization],
      error: null,
    });
    (createClient as any).mockReturnValue(mockSupabase);
  });

  describe('createOrganization', () => {
    it('should create an organization successfully', async () => {
      const newOrg = {
        name: 'New Organization',
        type: 'nonprofit' as const,
        ein: '12-3456789',
        website: 'https://neworg.org',
      };

      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: { ...mockOrganization, ...newOrg },
        error: null,
      });

      const result = await organizationService.createOrganization(newOrg);

      expect(result).toMatchObject(newOrg);
      expect(mockSupabase.from).toHaveBeenCalledWith('organizations');
    });

    it('should throw error when creation fails', async () => {
      const newOrg = {
        name: 'New Organization',
        type: 'nonprofit' as const,
        ein: '12-3456789',
      };

      const mockError = createMockSupabaseError('Failed to create organization');
      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(organizationService.createOrganization(newOrg)).rejects.toThrow(
        'Failed to create organization'
      );
    });

    it('should validate required fields', async () => {
      const invalidOrg = {
        name: '',
        type: 'nonprofit' as const,
      };

      await expect(
        organizationService.createOrganization(invalidOrg as any)
      ).rejects.toThrow();
    });
  });

  describe('getOrganizationById', () => {
    it('should fetch organization by ID', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockOrganization,
        error: null,
      });

      const result = await organizationService.getOrganizationById('org-123');

      expect(result).toEqual(mockOrganization);
      expect(mockSupabase.from).toHaveBeenCalledWith('organizations');
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'org-123');
    });

    it('should return null when organization not found', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Not found', 'PGRST116'),
      });

      const result = await organizationService.getOrganizationById('non-existent');

      expect(result).toBeNull();
    });

    it('should throw error for other failures', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Database error'),
      });

      await expect(organizationService.getOrganizationById('org-123')).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getUserOrganizations', () => {
    it('should fetch all organizations for a user', async () => {
      const organizations = [mockOrganization, { ...mockOrganization, id: 'org-456' }];

      mockSupabase.from().select().eq.mockResolvedValue({
        data: organizations.map((org) => ({
          organization: org,
          role: 'admin',
        })),
        error: null,
      });

      const result = await organizationService.getUserOrganizations('user-123');

      expect(result).toHaveLength(2);
      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'user-123');
    });

    it('should return empty array when user has no organizations', async () => {
      mockSupabase.from().select().eq.mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await organizationService.getUserOrganizations('user-123');

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockSupabase.from().select().eq.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Connection error'),
      });

      await expect(organizationService.getUserOrganizations('user-123')).rejects.toThrow(
        'Connection error'
      );
    });
  });

  describe('updateOrganization', () => {
    it('should update organization successfully', async () => {
      const updates = {
        name: 'Updated Name',
        website: 'https://updated.org',
      };

      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: { ...mockOrganization, ...updates },
        error: null,
      });

      const result = await organizationService.updateOrganization('org-123', updates);

      expect(result.name).toBe('Updated Name');
      expect(result.website).toBe('https://updated.org');
      expect(mockSupabase.from).toHaveBeenCalledWith('organizations');
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'org-123');
    });

    it('should throw error when update fails', async () => {
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Update failed'),
      });

      await expect(
        organizationService.updateOrganization('org-123', { name: 'New Name' })
      ).rejects.toThrow('Update failed');
    });
  });

  describe('deleteOrganization', () => {
    it('should soft delete organization', async () => {
      mockSupabase.from().update().eq().mockResolvedValue({
        data: null,
        error: null,
      });

      await organizationService.deleteOrganization('org-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('organizations');
      expect(mockSupabase.from().update).toHaveBeenCalledWith({
        deleted_at: expect.any(String),
      });
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'org-123');
    });

    it('should throw error when deletion fails', async () => {
      mockSupabase.from().update().eq().mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Deletion failed'),
      });

      await expect(organizationService.deleteOrganization('org-123')).rejects.toThrow(
        'Deletion failed'
      );
    });
  });

  describe('addMember', () => {
    it('should add member with specified role', async () => {
      mockSupabase.from().insert().mockResolvedValue({
        data: null,
        error: null,
      });

      await organizationService.addMember('org-123', 'user-456', 'editor');

      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
      expect(mockSupabase.from().insert).toHaveBeenCalledWith({
        organization_id: 'org-123',
        user_id: 'user-456',
        role: 'editor',
      });
    });

    it('should default to viewer role', async () => {
      mockSupabase.from().insert().mockResolvedValue({
        data: null,
        error: null,
      });

      await organizationService.addMember('org-123', 'user-456');

      expect(mockSupabase.from().insert).toHaveBeenCalledWith({
        organization_id: 'org-123',
        user_id: 'user-456',
        role: 'viewer',
      });
    });

    it('should throw error when member already exists', async () => {
      mockSupabase.from().insert().mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Duplicate key violation', '23505'),
      });

      await expect(
        organizationService.addMember('org-123', 'user-456', 'viewer')
      ).rejects.toThrow();
    });
  });

  describe('removeMember', () => {
    it('should remove member from organization', async () => {
      mockSupabase.from().delete().eq().eq.mockResolvedValue({
        data: null,
        error: null,
      });

      await organizationService.removeMember('org-123', 'user-456');

      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
      expect(mockSupabase.from().delete().eq).toHaveBeenCalledWith('organization_id', 'org-123');
    });

    it('should throw error when removal fails', async () => {
      mockSupabase.from().delete().eq().eq.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Cannot remove last owner'),
      });

      await expect(
        organizationService.removeMember('org-123', 'user-123')
      ).rejects.toThrow();
    });
  });

  describe('updateMemberRole', () => {
    it('should update member role', async () => {
      mockSupabase.from().update().eq().eq.mockResolvedValue({
        data: null,
        error: null,
      });

      await organizationService.updateMemberRole('org-123', 'user-456', 'admin');

      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
      expect(mockSupabase.from().update).toHaveBeenCalledWith({ role: 'admin' });
    });

    it('should validate role value', async () => {
      await expect(
        organizationService.updateMemberRole('org-123', 'user-456', 'invalid-role' as any)
      ).rejects.toThrow();
    });
  });

  describe('getUserRole', () => {
    it('should return user role in organization', async () => {
      mockSupabase.from().select().eq().eq().single.mockResolvedValue({
        data: { role: 'admin' },
        error: null,
      });

      const role = await organizationService.getUserRole('org-123', 'user-123');

      expect(role).toBe('admin');
      expect(mockSupabase.from).toHaveBeenCalledWith('organization_members');
    });

    it('should return null when user not in organization', async () => {
      mockSupabase.from().select().eq().eq().single.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Not found', 'PGRST116'),
      });

      const role = await organizationService.getUserRole('org-123', 'user-999');

      expect(role).toBeNull();
    });
  });

  describe('isOwner', () => {
    it('should return true for owner', async () => {
      mockSupabase.from().select().eq().eq().eq().single.mockResolvedValue({
        data: { role: 'owner' },
        error: null,
      });

      const result = await organizationService.isOwner('org-123', 'user-123');

      expect(result).toBe(true);
    });

    it('should return false for non-owner', async () => {
      mockSupabase.from().select().eq().eq().eq().single.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Not found', 'PGRST116'),
      });

      const result = await organizationService.isOwner('org-123', 'user-456');

      expect(result).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin or owner', async () => {
      mockSupabase.from().select().eq().eq().in().single.mockResolvedValue({
        data: { role: 'admin' },
        error: null,
      });

      const result = await organizationService.isAdmin('org-123', 'user-123');

      expect(result).toBe(true);
    });

    it('should return false for non-admin', async () => {
      mockSupabase.from().select().eq().eq().in().single.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Not found', 'PGRST116'),
      });

      const result = await organizationService.isAdmin('org-123', 'user-456');

      expect(result).toBe(false);
    });
  });
});
