import { describe, it, expect, vi, beforeEach } from 'vitest';
import { documentService } from '../documentService';
import { createClient } from '@/lib/supabase/client';
import {
  createMockSupabaseClient,
  createMockSupabaseError,
  mockDocument,
  mockOrganization,
  createMockFile,
} from '@/test/testUtils';

// Mock the Supabase client
vi.mock('@/lib/supabase/client');

// Mock upload utility
vi.mock('@/lib/upload', () => ({
  uploadFile: vi.fn().mockResolvedValue({
    path: 'test-path.pdf',
    url: 'https://test.supabase.co/storage/v1/object/public/test-path.pdf',
  }),
}));

describe('documentService', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = createMockSupabaseClient({
      data: [mockDocument],
      error: null,
    });
    (createClient as any).mockReturnValue(mockSupabase);
  });

  describe('uploadDocument', () => {
    it('should upload document successfully', async () => {
      const file = createMockFile('test.pdf', 1024000, 'application/pdf');
      const uploadData = {
        file,
        organizationId: 'org-123',
        name: 'Test Document',
        folderId: null,
        tags: ['important'],
      };

      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: mockDocument,
        error: null,
      });

      const result = await documentService.uploadDocument(uploadData);

      expect(result).toMatchObject({
        id: expect.any(String),
        organization_id: 'org-123',
        name: 'Test Document',
      });
      expect(mockSupabase.from).toHaveBeenCalledWith('documents');
    });

    it('should validate file size limit (15MB)', async () => {
      const largeFile = createMockFile('large.pdf', 16 * 1024 * 1024, 'application/pdf');
      const uploadData = {
        file: largeFile,
        organizationId: 'org-123',
        name: 'Large Document',
      };

      await expect(documentService.uploadDocument(uploadData)).rejects.toThrow();
    });

    it('should handle upload errors', async () => {
      const file = createMockFile('test.pdf', 1024000, 'application/pdf');
      const uploadData = {
        file,
        organizationId: 'org-123',
        name: 'Test Document',
      };

      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Upload failed'),
      });

      await expect(documentService.uploadDocument(uploadData)).rejects.toThrow();
    });
  });

  describe('getDocumentById', () => {
    it('should fetch document by ID', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockDocument,
        error: null,
      });

      const result = await documentService.getDocumentById('doc-123');

      expect(result).toEqual(mockDocument);
      expect(mockSupabase.from).toHaveBeenCalledWith('documents');
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'doc-123');
    });

    it('should return null when document not found', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Not found', 'PGRST116'),
      });

      const result = await documentService.getDocumentById('non-existent');

      expect(result).toBeNull();
    });

    it('should throw error for other failures', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Database error'),
      });

      await expect(documentService.getDocumentById('doc-123')).rejects.toThrow();
    });
  });

  describe('searchDocuments', () => {
    it('should search documents with filters', async () => {
      const documents = [mockDocument, { ...mockDocument, id: 'doc-456' }];
      const searchParams = {
        organizationId: 'org-123',
        query: 'test',
        tags: ['important'],
        sortBy: 'created_at' as const,
        sortOrder: 'desc' as const,
        limit: 50,
        offset: 0,
      };

      mockSupabase.from().select.mockResolvedValue({
        data: documents,
        error: null,
        count: 2,
      });

      const result = await documentService.searchDocuments(searchParams);

      expect(result.documents).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(mockSupabase.from).toHaveBeenCalledWith('documents');
    });

    it('should filter by folder', async () => {
      const searchParams = {
        organizationId: 'org-123',
        folderId: 'folder-123',
        limit: 50,
        offset: 0,
      };

      mockSupabase.from().select.mockResolvedValue({
        data: [mockDocument],
        error: null,
        count: 1,
      });

      const result = await documentService.searchDocuments(searchParams);

      expect(result.documents).toHaveLength(1);
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('folder_id', 'folder-123');
    });

    it('should filter by date range', async () => {
      const searchParams = {
        organizationId: 'org-123',
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
        limit: 50,
        offset: 0,
      };

      mockSupabase.from().select.mockResolvedValue({
        data: [mockDocument],
        error: null,
        count: 1,
      });

      const result = await documentService.searchDocuments(searchParams);

      expect(result.documents).toHaveLength(1);
    });

    it('should handle pagination', async () => {
      const searchParams = {
        organizationId: 'org-123',
        limit: 10,
        offset: 20,
      };

      mockSupabase.from().select.mockResolvedValue({
        data: [mockDocument],
        error: null,
        count: 50,
      });

      const result = await documentService.searchDocuments(searchParams);

      expect(result.total).toBe(50);
      expect(mockSupabase.from().range).toHaveBeenCalledWith(20, 29);
    });
  });

  describe('updateDocument', () => {
    it('should update document metadata', async () => {
      const updates = {
        name: 'Updated Name',
        description: 'Updated description',
        tags: ['updated'],
      };

      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: { ...mockDocument, ...updates },
        error: null,
      });

      const result = await documentService.updateDocument('doc-123', updates);

      expect(result.name).toBe('Updated Name');
      expect(result.description).toBe('Updated description');
      expect(mockSupabase.from).toHaveBeenCalledWith('documents');
    });

    it('should throw error when update fails', async () => {
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Update failed'),
      });

      await expect(
        documentService.updateDocument('doc-123', { name: 'New Name' })
      ).rejects.toThrow();
    });
  });

  describe('deleteDocument', () => {
    it('should soft delete document', async () => {
      mockSupabase.from().update().eq().mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock storage deletion
      mockSupabase.storage.from().remove.mockResolvedValue({
        error: null,
      });

      await documentService.deleteDocument('doc-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('documents');
      expect(mockSupabase.from().update).toHaveBeenCalledWith({
        deleted_at: expect.any(String),
      });
    });

    it('should handle deletion errors', async () => {
      mockSupabase.from().update().eq().mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Deletion failed'),
      });

      await expect(documentService.deleteDocument('doc-123')).rejects.toThrow();
    });
  });

  describe('moveDocument', () => {
    it('should move document to folder', async () => {
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: { ...mockDocument, folder_id: 'folder-456' },
        error: null,
      });

      const result = await documentService.moveDocument('doc-123', 'folder-456');

      expect(result.folder_id).toBe('folder-456');
      expect(mockSupabase.from().update).toHaveBeenCalledWith({
        folder_id: 'folder-456',
        updated_at: expect.any(String),
      });
    });

    it('should move document to root (null folder)', async () => {
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: { ...mockDocument, folder_id: null },
        error: null,
      });

      const result = await documentService.moveDocument('doc-123', null);

      expect(result.folder_id).toBeNull();
    });
  });

  describe('getDocumentVersions', () => {
    it('should fetch document version history', async () => {
      const versions = [
        { ...mockDocument, version: 2 },
        { ...mockDocument, version: 1 },
      ];

      mockSupabase.from().select().eq().order.mockResolvedValue({
        data: versions,
        error: null,
      });

      const result = await documentService.getDocumentVersions('doc-123');

      expect(result).toHaveLength(2);
      expect(result[0].version).toBe(2);
      expect(mockSupabase.from).toHaveBeenCalledWith('document_versions');
    });

    it('should return empty array when no versions', async () => {
      mockSupabase.from().select().eq().order.mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await documentService.getDocumentVersions('doc-123');

      expect(result).toEqual([]);
    });
  });

  describe('addDocumentTag', () => {
    it('should add tag to document', async () => {
      const currentDoc = { ...mockDocument, tags: ['existing'] };
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: currentDoc,
        error: null,
      });

      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: { ...currentDoc, tags: ['existing', 'new-tag'] },
        error: null,
      });

      const result = await documentService.addDocumentTag('doc-123', 'new-tag');

      expect(result.tags).toContain('new-tag');
      expect(result.tags).toContain('existing');
    });

    it('should not duplicate tags', async () => {
      const currentDoc = { ...mockDocument, tags: ['existing'] };
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: currentDoc,
        error: null,
      });

      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: currentDoc,
        error: null,
      });

      const result = await documentService.addDocumentTag('doc-123', 'existing');

      expect(result.tags).toEqual(['existing']);
    });
  });

  describe('removeDocumentTag', () => {
    it('should remove tag from document', async () => {
      const currentDoc = { ...mockDocument, tags: ['tag1', 'tag2', 'tag3'] };
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: currentDoc,
        error: null,
      });

      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: { ...currentDoc, tags: ['tag1', 'tag3'] },
        error: null,
      });

      const result = await documentService.removeDocumentTag('doc-123', 'tag2');

      expect(result.tags).not.toContain('tag2');
      expect(result.tags).toHaveLength(2);
    });

    it('should handle removing non-existent tag', async () => {
      const currentDoc = { ...mockDocument, tags: ['tag1'] };
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: currentDoc,
        error: null,
      });

      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: currentDoc,
        error: null,
      });

      const result = await documentService.removeDocumentTag('doc-123', 'non-existent');

      expect(result.tags).toEqual(['tag1']);
    });
  });

  describe('getRecentDocuments', () => {
    it('should fetch recent documents for organization', async () => {
      const recentDocs = [
        { ...mockDocument, id: 'doc-1', created_at: '2024-01-03' },
        { ...mockDocument, id: 'doc-2', created_at: '2024-01-02' },
        { ...mockDocument, id: 'doc-3', created_at: '2024-01-01' },
      ];

      mockSupabase.from().select().eq().is().order().limit.mockResolvedValue({
        data: recentDocs,
        error: null,
      });

      const result = await documentService.getRecentDocuments('org-123', 10);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('doc-1');
      expect(mockSupabase.from().limit).toHaveBeenCalledWith(10);
    });

    it('should exclude deleted documents', async () => {
      mockSupabase.from().select().eq().is().order().limit.mockResolvedValue({
        data: [mockDocument],
        error: null,
      });

      await documentService.getRecentDocuments('org-123');

      expect(mockSupabase.from().is).toHaveBeenCalledWith('deleted_at', null);
    });
  });

  describe('getDocumentStats', () => {
    it('should return document statistics', async () => {
      const documents = [
        { ...mockDocument, file_size: 1000000 },
        { ...mockDocument, id: 'doc-2', file_size: 2000000 },
        { ...mockDocument, id: 'doc-3', file_size: 3000000 },
      ];

      mockSupabase.from().select().eq().is.mockResolvedValue({
        data: documents,
        error: null,
      });

      const stats = await documentService.getDocumentStats('org-123');

      expect(stats.totalDocuments).toBe(3);
      expect(stats.totalSize).toBe(6000000);
      expect(stats.averageSize).toBe(2000000);
    });

    it('should handle organization with no documents', async () => {
      mockSupabase.from().select().eq().is.mockResolvedValue({
        data: [],
        error: null,
      });

      const stats = await documentService.getDocumentStats('org-123');

      expect(stats.totalDocuments).toBe(0);
      expect(stats.totalSize).toBe(0);
      expect(stats.averageSize).toBe(0);
    });
  });

  describe('bulkDeleteDocuments', () => {
    it('should delete multiple documents', async () => {
      const documentIds = ['doc-1', 'doc-2', 'doc-3'];

      mockSupabase.from().update().in().mockResolvedValue({
        data: null,
        error: null,
      });

      await documentService.bulkDeleteDocuments(documentIds);

      expect(mockSupabase.from).toHaveBeenCalledWith('documents');
      expect(mockSupabase.from().update).toHaveBeenCalledWith({
        deleted_at: expect.any(String),
      });
      expect(mockSupabase.from().in).toHaveBeenCalledWith('id', documentIds);
    });

    it('should handle empty array', async () => {
      await expect(documentService.bulkDeleteDocuments([])).rejects.toThrow();
    });
  });

  describe('bulkMoveDocuments', () => {
    it('should move multiple documents to folder', async () => {
      const documentIds = ['doc-1', 'doc-2', 'doc-3'];

      mockSupabase.from().update().in().mockResolvedValue({
        data: null,
        error: null,
      });

      await documentService.bulkMoveDocuments(documentIds, 'folder-123');

      expect(mockSupabase.from().update).toHaveBeenCalledWith({
        folder_id: 'folder-123',
        updated_at: expect.any(String),
      });
      expect(mockSupabase.from().in).toHaveBeenCalledWith('id', documentIds);
    });

    it('should move documents to root', async () => {
      const documentIds = ['doc-1', 'doc-2'];

      mockSupabase.from().update().in().mockResolvedValue({
        data: null,
        error: null,
      });

      await documentService.bulkMoveDocuments(documentIds, null);

      expect(mockSupabase.from().update).toHaveBeenCalledWith({
        folder_id: null,
        updated_at: expect.any(String),
      });
    });
  });
});
