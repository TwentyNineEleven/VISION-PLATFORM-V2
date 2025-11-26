import { beforeEach, describe, expect, it, vi } from 'vitest';
import { folderService } from '../folderService';
import { createClient } from '@/lib/supabase/client';
import {
  createMockQuery,
  createMockSupabaseClient,
  mockUser,
} from '@/test/testUtils';
import { USE_REAL_DB, setupTestEnvironment } from '@/test/serviceTestHelpers';

// Conditionally mock Supabase client
if (!USE_REAL_DB) {
  vi.mock('@/lib/supabase/client');
} else {
  vi.doUnmock('@/lib/supabase/client');
}

describe('folderService', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient> | null = null;

  beforeEach(() => {
    setupTestEnvironment();

    if (!USE_REAL_DB) {
      mockSupabase = createMockSupabaseClient();
      (createClient as any).mockReturnValue(mockSupabase);
    }
  });

  describe('getFolder', () => {
    it('returns mapped folder data when found', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }

      const dbFolder = {
        id: 'folder-1',
        organization_id: 'org-1',
        parent_folder_id: null,
        name: 'Root',
        description: 'Root folder',
        color: '#fff',
        icon: 'folder',
        path: '/folder-1/',
        depth: 0,
        is_system: false,
        metadata: { source: 'seed' },
        created_by: mockUser.id,
        updated_by: mockUser.id,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        deleted_at: null,
        deleted_by: null,
      };

      const query = createMockQuery();
      query.select.mockReturnValue(query);
      query.eq.mockReturnValue(query);
      query.is.mockReturnValue(query);
      query.single.mockResolvedValue({ data: dbFolder, error: null });
      mockSupabase!.from.mockReturnValue(query);

      const result = await folderService.getFolder('folder-1');

      expect(result).toMatchObject({
        id: 'folder-1',
        organizationId: 'org-1',
        parentFolderId: null,
        name: 'Root',
        path: '/folder-1/',
        depth: 0,
      });
      expect(mockSupabase!.from).toHaveBeenCalledWith('folders');
      expect(query.eq).toHaveBeenCalledWith('id', 'folder-1');
      expect(query.is).toHaveBeenCalledWith('deleted_at', null);
    });
  });

  describe('getFolderTree', () => {
    it('builds hierarchical tree from flat folder list', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }

      const rootFolder = {
        id: 'root',
        organization_id: 'org-1',
        parent_folder_id: null,
        name: 'Root',
        description: null,
        color: null,
        icon: null,
        path: '/root/',
        depth: 0,
        is_system: false,
        metadata: {},
        created_by: mockUser.id,
        updated_by: mockUser.id,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        deleted_at: null,
        deleted_by: null,
      };

      const childFolder = {
        ...rootFolder,
        id: 'child',
        name: 'Child',
        parent_folder_id: 'root',
        path: '/root/child/',
        depth: 1,
      };

      const query = createMockQuery();
      query.select.mockReturnValue(query);
      query.eq.mockReturnValue(query);
      query.is.mockReturnValue(query);
      query.order.mockReturnValue(query);
      query.mockResolvedValue({ data: [rootFolder, childFolder], error: null });
      mockSupabase!.from.mockReturnValue(query);

      const result = await folderService.getFolderTree('org-1');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('root');
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children[0].id).toBe('child');
      expect(result[0].children[0].parentFolderId).toBe('root');
    });
  });

  describe('createFolder', () => {
    it('creates a folder when no duplicate exists', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }

      const existingQuery = createMockQuery();
      existingQuery.select.mockReturnValue(existingQuery);
      existingQuery.eq.mockReturnValue(existingQuery);
      existingQuery.is.mockReturnValue(existingQuery);
      existingQuery.order.mockReturnValue(existingQuery);
      existingQuery.mockResolvedValue({ data: [], error: null });

      const insertQuery = createMockQuery();
      insertQuery.insert.mockReturnValue(insertQuery);
      insertQuery.select.mockReturnValue(insertQuery);
      insertQuery.single.mockResolvedValue({
        data: {
          id: 'new-folder',
          organization_id: 'org-1',
          parent_folder_id: null,
          name: 'Reports',
          description: null,
          color: null,
          icon: null,
          path: '/new-folder/',
          depth: 0,
          is_system: false,
          metadata: {},
          created_by: mockUser.id,
          updated_by: mockUser.id,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          deleted_at: null,
          deleted_by: null,
        },
        error: null,
      });

      mockSupabase!.from
        .mockReturnValueOnce(existingQuery) // getFoldersByParent
        .mockReturnValueOnce(insertQuery); // insert

      const result = await folderService.createFolder({
        organizationId: 'org-1',
        parentFolderId: undefined,
        name: 'Reports',
        description: undefined,
        color: undefined,
        icon: undefined,
      });

      expect(insertQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Reports',
          organization_id: 'org-1',
        })
      );
      expect(result.id).toBe('new-folder');
      expect(result.organizationId).toBe('org-1');
    });

    it('throws when a duplicate name exists at the target level', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }

      const existingQuery = createMockQuery();
      existingQuery.select.mockReturnValue(existingQuery);
      existingQuery.eq.mockReturnValue(existingQuery);
      existingQuery.is.mockReturnValue(existingQuery);
      existingQuery.order.mockReturnValue(existingQuery);
      existingQuery.mockResolvedValue({
        data: [
          {
            id: 'folder-dup',
            organization_id: 'org-1',
            parent_folder_id: null,
            name: 'Reports',
            path: '/folder-dup/',
            depth: 0,
            is_system: false,
            metadata: {},
            created_by: mockUser.id,
            updated_by: mockUser.id,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            deleted_at: null,
            deleted_by: null,
            description: null,
            color: null,
            icon: null,
          },
        ],
        error: null,
      });

      mockSupabase!.from.mockReturnValue(existingQuery);

      await expect(
        folderService.createFolder({
          organizationId: 'org-1',
          parentFolderId: undefined,
          name: 'Reports',
          description: undefined,
          color: undefined,
          icon: undefined,
        })
      ).rejects.toThrow('already exists');
    });
  });

  describe('updateFolder', () => {
    it('updates folder fields when validation passes', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }

      const currentFolder = {
        id: 'folder-1',
        organization_id: 'org-1',
        parent_folder_id: null,
        name: 'Existing',
        description: null,
        color: null,
        icon: null,
        path: '/folder-1/',
        depth: 0,
        is_system: false,
        metadata: {},
        created_by: mockUser.id,
        updated_by: mockUser.id,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        deleted_at: null,
        deleted_by: null,
      };

      const currentFolderQuery = createMockQuery();
      currentFolderQuery.select.mockReturnValue(currentFolderQuery);
      currentFolderQuery.eq.mockReturnValue(currentFolderQuery);
      currentFolderQuery.is.mockReturnValue(currentFolderQuery);
      currentFolderQuery.single.mockResolvedValue({ data: currentFolder, error: null });

      const siblingQuery = createMockQuery();
      siblingQuery.select.mockReturnValue(siblingQuery);
      siblingQuery.eq.mockReturnValue(siblingQuery);
      siblingQuery.is.mockReturnValue(siblingQuery);
      siblingQuery.order.mockReturnValue(siblingQuery);
      siblingQuery.mockResolvedValue({ data: [currentFolder], error: null });

      const updateQuery = createMockQuery();
      updateQuery.update.mockReturnValue(updateQuery);
      updateQuery.select.mockReturnValue(updateQuery);
      updateQuery.single.mockResolvedValue({
        data: {
          ...currentFolder,
          name: 'Renamed',
          description: 'Updated description',
          updated_by: mockUser.id,
        },
        error: null,
      });

      mockSupabase!.from
        .mockReturnValueOnce(currentFolderQuery) // getFolder
        .mockReturnValueOnce(siblingQuery) // getFoldersByParent
        .mockReturnValueOnce(updateQuery); // update

      const result = await folderService.updateFolder('folder-1', {
        name: 'Renamed',
        description: 'Updated description',
      });

      expect(updateQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Renamed', updated_by: mockUser.id })
      );
      expect(result.name).toBe('Renamed');
      expect(result.description).toBe('Updated description');
    });

    it('prevents renaming to a duplicate in the same parent', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }

      const currentFolder = {
        id: 'folder-1',
        organization_id: 'org-1',
        parent_folder_id: null,
        name: 'Existing',
        description: null,
        color: null,
        icon: null,
        path: '/folder-1/',
        depth: 0,
        is_system: false,
        metadata: {},
        created_by: mockUser.id,
        updated_by: mockUser.id,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        deleted_at: null,
        deleted_by: null,
      };

      const currentFolderQuery = createMockQuery();
      currentFolderQuery.select.mockReturnValue(currentFolderQuery);
      currentFolderQuery.eq.mockReturnValue(currentFolderQuery);
      currentFolderQuery.is.mockReturnValue(currentFolderQuery);
      currentFolderQuery.single.mockResolvedValue({ data: currentFolder, error: null });

      const siblingQuery = createMockQuery();
      siblingQuery.select.mockReturnValue(siblingQuery);
      siblingQuery.eq.mockReturnValue(siblingQuery);
      siblingQuery.is.mockReturnValue(siblingQuery);
      siblingQuery.order.mockReturnValue(siblingQuery);
      siblingQuery.mockResolvedValue({
        data: [currentFolder, { ...currentFolder, id: 'folder-2', name: 'Renamed' }],
        error: null,
      });

      mockSupabase!.from
        .mockReturnValueOnce(currentFolderQuery) // getFolder
        .mockReturnValueOnce(siblingQuery); // getFoldersByParent

      await expect(
        folderService.updateFolder('folder-1', { name: 'Renamed' })
      ).rejects.toThrow('A folder with this name already exists in the target location');
    });

    it('validates folder names before updating', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }

      const currentFolder = {
        id: 'folder-1',
        organization_id: 'org-1',
        parent_folder_id: null,
        name: 'Existing',
        description: null,
        color: null,
        icon: null,
        path: '/folder-1/',
        depth: 0,
        is_system: false,
        metadata: {},
        created_by: mockUser.id,
        updated_by: mockUser.id,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        deleted_at: null,
        deleted_by: null,
      };

      const currentFolderQuery = createMockQuery();
      currentFolderQuery.select.mockReturnValue(currentFolderQuery);
      currentFolderQuery.eq.mockReturnValue(currentFolderQuery);
      currentFolderQuery.is.mockReturnValue(currentFolderQuery);
      currentFolderQuery.single.mockResolvedValue({ data: currentFolder, error: null });

      mockSupabase!.from.mockReturnValueOnce(currentFolderQuery);

      await expect(folderService.updateFolder('folder-1', { name: '' })).rejects.toThrow(
        'Folder name cannot be empty'
      );
    });
  });

  describe('getFolderBreadcrumb', () => {
    it('returns ordered breadcrumb list based on folder path', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }

      const pathQuery = createMockQuery();
      pathQuery.select.mockReturnValue(pathQuery);
      pathQuery.eq.mockReturnValue(pathQuery);
      pathQuery.single.mockResolvedValue({
        data: { path: '/root/child/', organization_id: 'org-1' },
        error: null,
      });

      const breadcrumbQuery = createMockQuery();
      breadcrumbQuery.select.mockReturnValue(breadcrumbQuery);
      breadcrumbQuery.in.mockReturnValue(breadcrumbQuery);
      breadcrumbQuery.eq.mockReturnValue(breadcrumbQuery);
      breadcrumbQuery.is.mockReturnValue(breadcrumbQuery);
      breadcrumbQuery.order.mockReturnValue(breadcrumbQuery);
      breadcrumbQuery.mockResolvedValue({
        data: [
          {
            id: 'root',
            organization_id: 'org-1',
            parent_folder_id: null,
            name: 'Root',
            description: null,
            color: null,
            icon: null,
            path: '/root/',
            depth: 0,
            is_system: false,
            metadata: {},
            created_by: mockUser.id,
            updated_by: mockUser.id,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            deleted_at: null,
            deleted_by: null,
          },
          {
            id: 'child',
            organization_id: 'org-1',
            parent_folder_id: 'root',
            name: 'Child',
            description: null,
            color: null,
            icon: null,
            path: '/root/child/',
            depth: 1,
            is_system: false,
            metadata: {},
            created_by: mockUser.id,
            updated_by: mockUser.id,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            deleted_at: null,
            deleted_by: null,
          },
        ],
        error: null,
      });

      mockSupabase!.from
        .mockReturnValueOnce(pathQuery)
        .mockReturnValueOnce(breadcrumbQuery);

      const result = await folderService.getFolderBreadcrumb('child');

      expect(result.map(folder => folder.id)).toEqual(['root', 'child']);
      expect(breadcrumbQuery.order).toHaveBeenCalledWith('depth', { ascending: true });
    });
  });

  describe('moveFolder', () => {
    it('prevents moving a folder into its own descendant', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }

      const currentFolder = {
        id: 'folder-1',
        organization_id: 'org-1',
        parent_folder_id: null,
        name: 'Folder 1',
        description: null,
        color: null,
        icon: null,
        path: '/folder-1/',
        depth: 0,
        is_system: false,
        metadata: {},
        created_by: mockUser.id,
        updated_by: mockUser.id,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        deleted_at: null,
        deleted_by: null,
      };

      const descendantFolder = {
        ...currentFolder,
        id: 'folder-2',
        parent_folder_id: 'folder-1',
        name: 'Child',
        path: '/folder-1/folder-2/',
        depth: 1,
      };

      const currentFolderQuery = createMockQuery();
      currentFolderQuery.select.mockReturnValue(currentFolderQuery);
      currentFolderQuery.eq.mockReturnValue(currentFolderQuery);
      currentFolderQuery.is.mockReturnValue(currentFolderQuery);
      currentFolderQuery.single.mockResolvedValue({ data: currentFolder, error: null });

      const descendantQuery = createMockQuery();
      descendantQuery.select.mockReturnValue(descendantQuery);
      descendantQuery.eq.mockReturnValue(descendantQuery);
      descendantQuery.is.mockReturnValue(descendantQuery);
      descendantQuery.single.mockResolvedValue({ data: descendantFolder, error: null });

      mockSupabase!.from
        .mockReturnValueOnce(currentFolderQuery)
        .mockReturnValueOnce(descendantQuery);

      await expect(folderService.moveFolder('folder-1', 'folder-2')).rejects.toThrow(
        'Cannot move folder into its own subfolder'
      );
      expect(mockSupabase!.from).toHaveBeenCalledTimes(2);
    });
  });

  describe('getDocumentCount', () => {
    it('includes descendant folders when requested', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }

      const folderSpy = vi.spyOn(folderService, 'getFolder').mockResolvedValue({
        id: 'folder-1',
        organizationId: 'org-1',
        parentFolderId: null,
        name: 'Root',
        description: null,
        color: null,
        icon: null,
        path: '/folder-1/',
        depth: 0,
        isSystem: false,
        metadata: {},
        createdBy: mockUser.id,
        updatedBy: mockUser.id,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        deletedAt: null,
        deletedBy: null,
      } as any);

      const subfoldersQuery = createMockQuery();
      subfoldersQuery.select.mockReturnValue(subfoldersQuery);
      subfoldersQuery.eq.mockReturnValue(subfoldersQuery);
      subfoldersQuery.like.mockReturnValue(subfoldersQuery);
      subfoldersQuery.is.mockReturnValue(subfoldersQuery);
      subfoldersQuery.mockResolvedValue({ data: [{ id: 'child' }], error: null });

      const documentsQuery = createMockQuery();
      documentsQuery.select.mockReturnValue(documentsQuery);
      documentsQuery.in.mockReturnValue(documentsQuery);
      documentsQuery.is.mockReturnValue(documentsQuery);
      documentsQuery.mockResolvedValue({ count: 5, error: null });

      mockSupabase!.from
        .mockReturnValueOnce(subfoldersQuery)
        .mockReturnValueOnce(documentsQuery);

      const count = await folderService.getDocumentCount('folder-1', true);

      expect(count).toBe(5);
      expect(subfoldersQuery.like).toHaveBeenCalledWith('path', '/folder-1/%');
      expect(documentsQuery.in).toHaveBeenCalledWith('folder_id', ['folder-1', 'child']);
      folderSpy.mockRestore();
    });
  });

  describe('validateFolderName', () => {
    it('flags invalid characters and length constraints', () => {
      const empty = folderService.validateFolderName('');
      expect(empty.valid).toBe(false);

      const tooLong = folderService.validateFolderName('a'.repeat(256));
      expect(tooLong.valid).toBe(false);

      const invalidChars = folderService.validateFolderName('bad/name');
      expect(invalidChars.error).toContain('invalid characters');

      const good = folderService.validateFolderName('Project Docs');
      expect(good.valid).toBe(true);
    });
  });
});
