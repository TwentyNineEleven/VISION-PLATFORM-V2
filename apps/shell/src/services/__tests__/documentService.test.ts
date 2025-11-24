import { describe, it, expect, vi, beforeEach } from 'vitest';
import { documentService } from '../documentService';
import { createClient } from '@/lib/supabase/client';
import {
  createMockSupabaseClient,
  createMockSupabaseError,
  mockDocument,
  createMockFile,
} from '@/test/testUtils';

// Mock the Supabase client
vi.mock('@/lib/supabase/client');

// Mock documentParserService
vi.mock('../documentParserService', () => ({
  documentParserService: {
    parseFile: vi.fn().mockResolvedValue({
      success: true,
      text: 'Extracted text content',
      textLength: 20,
    }),
  },
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

  describe('getDocument', () => {
    it('should fetch document by ID', async () => {
      const dbDocument = {
        id: 'doc-123',
        organization_id: 'org-123',
        name: 'test-document.pdf',
        file_path: 'org-123/test-document.pdf',
        file_size: 1024000,
        mime_type: 'application/pdf',
        extension: 'pdf',
        version_number: 1,
        current_version_id: 'version-1',
        tags: [],
        metadata: {},
        extracted_text: 'Test content',
        extracted_text_length: 12,
        text_extracted_at: new Date().toISOString(),
        ai_summary: null,
        ai_keywords: null,
        ai_topics: null,
        ai_entities: null,
        ai_sentiment: null,
        ai_language: null,
        ai_metadata: {},
        content_embeddings: null,
        ai_provider: null,
        ai_enabled: false,
        ai_processing_status: 'disabled',
        ai_processed_at: null,
        ai_error: null,
        view_count: 0,
        download_count: 0,
        last_viewed_at: null,
        last_downloaded_at: null,
        uploaded_by: 'user-123',
        updated_by: 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        deleted_by: null,
        folder_id: null,
        description: null,
      };

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().is().single as any).mockResolvedValue({
        data: dbDocument,
        error: null,
      });

      const result = await documentService.getDocument('doc-123');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('doc-123');
      expect(mockSupabase.from).toHaveBeenCalledWith('documents');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'doc-123');
      expect(mockQuery.is).toHaveBeenCalledWith('deleted_at', null);
    });

    it('should return null when document not found', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().is().single as any).mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Not found', 'PGRST116'),
      });

      const result = await documentService.getDocument('non-existent');

      expect(result).toBeNull();
    });
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

      const dbDocument = {
        id: 'doc-123',
        organization_id: 'org-123',
        name: 'Test Document',
        file_path: 'org-123/Test Document.pdf',
        file_size: 1024000,
        mime_type: 'application/pdf',
        extension: 'pdf',
        version_number: 1,
        current_version_id: null,
        tags: ['important'],
        metadata: {},
        extracted_text: 'Extracted text content',
        extracted_text_length: 20,
        text_extracted_at: new Date().toISOString(),
        ai_enabled: false,
        ai_processing_status: 'disabled',
        uploaded_by: 'user-123',
        updated_by: 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        deleted_by: null,
        folder_id: null,
        description: null,
      };

      // Mock storage upload
      const mockStorage = mockSupabase.storage.from();
      (mockStorage.upload as any).mockResolvedValue({
        data: { path: 'org-123/Test Document.pdf' },
        error: null,
      });

      // Mock document insert
      const mockInsertQuery = mockSupabase.from();
      (mockInsertQuery.insert().select().single as any).mockResolvedValue({
        data: dbDocument,
        error: null,
      });

      // Mock version creation (called internally)
      const mockVersionQuery = mockSupabase.from();
      (mockVersionQuery.insert().select().single as any).mockResolvedValue({
        data: { id: 'version-1' },
        error: null,
      });

      // Mock update for current_version_id
      const mockUpdateQuery = mockSupabase.from();
      (mockUpdateQuery.update().eq as any).mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await documentService.uploadDocument(uploadData);

      expect(result).not.toBeNull();
      expect(result.id).toBe('doc-123');
      expect(mockSupabase.storage.from).toHaveBeenCalledWith('organization-documents');
      expect(mockStorage.upload).toHaveBeenCalled();
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

      const mockStorage = mockSupabase.storage.from();
      (mockStorage.upload as any).mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Upload failed'),
      });

      await expect(documentService.uploadDocument(uploadData)).rejects.toThrow();
    });
  });

  describe('searchDocuments', () => {
    it('should search documents with filters', async () => {
      const dbDocuments = [
        {
          ...mockDocument,
          id: 'doc-1',
          name: 'Test Document 1',
        },
        {
          ...mockDocument,
          id: 'doc-2',
          name: 'Test Document 2',
        },
      ];

      const searchParams = {
        organizationId: 'org-123',
        query: 'test',
        tags: ['important'],
        sortBy: 'created_at' as const,
        sortOrder: 'desc' as const,
        limit: 50,
        offset: 0,
      };

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().is().contains().order().range as any).mockResolvedValue({
        data: dbDocuments,
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

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().is().eq().order().range as any).mockResolvedValue({
        data: [mockDocument],
        error: null,
        count: 1,
      });

      const result = await documentService.searchDocuments(searchParams);

      expect(result.documents).toHaveLength(1);
      expect(mockQuery.eq).toHaveBeenCalledWith('folder_id', 'folder-123');
    });

    it('should filter by date range', async () => {
      const searchParams = {
        organizationId: 'org-123',
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
        limit: 50,
        offset: 0,
      };

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().is().gte().lte().order().range as any).mockResolvedValue({
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

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().is().order().range as any).mockResolvedValue({
        data: [mockDocument],
        error: null,
        count: 50,
      });

      const result = await documentService.searchDocuments(searchParams);

      expect(result.total).toBe(50);
      expect(result.hasMore).toBe(true);
      expect(mockQuery.range).toHaveBeenCalledWith(20, 29);
    });
  });

  describe('updateDocument', () => {
    it('should update document metadata', async () => {
      const updates = {
        name: 'Updated Name',
        description: 'Updated description',
        tags: ['updated'],
      };

      const updatedDoc = {
        ...mockDocument,
        ...updates,
      };

      const mockQuery = mockSupabase.from();
      (mockQuery.update().eq().is().select().single as any).mockResolvedValue({
        data: updatedDoc,
        error: null,
      });

      const result = await documentService.updateDocument('doc-123', updates);

      expect(result.name).toBe('Updated Name');
      expect(result.description).toBe('Updated description');
      expect(mockSupabase.from).toHaveBeenCalledWith('documents');
      expect(mockQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Name',
          description: 'Updated description',
          tags: ['updated'],
        })
      );
    });

    it('should throw error when update fails', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.update().eq().is().select().single as any).mockResolvedValue({
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
      const mockQuery = mockSupabase.from();
      (mockQuery.update().eq as any).mockResolvedValue({
        data: null,
        error: null,
      });

      await documentService.deleteDocument('doc-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('documents');
      expect(mockQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          deleted_at: expect.any(String),
          deleted_by: expect.any(String),
        })
      );
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'doc-123');
    });

    it('should handle deletion errors', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.update().eq as any).mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Deletion failed'),
      });

      await expect(documentService.deleteDocument('doc-123')).rejects.toThrow();
    });
  });

  describe('getDownloadUrl', () => {
    it('should get signed download URL', async () => {
      const dbDocument = {
        ...mockDocument,
        file_path: 'org-123/test-document.pdf',
        download_count: 0,
      };

      // Mock getDocument
      const mockGetQuery = mockSupabase.from();
      (mockGetQuery.select().eq().is().single as any).mockResolvedValue({
        data: dbDocument,
        error: null,
      });

      // Mock storage signed URL
      const mockStorage = mockSupabase.storage.from();
      (mockStorage.createSignedUrl as any).mockResolvedValue({
        data: { signedUrl: 'https://test.supabase.co/storage/v1/object/sign/test-path' },
        error: null,
      });

      // Mock update for download count
      const mockUpdateQuery = mockSupabase.from();
      (mockUpdateQuery.update().eq as any).mockResolvedValue({
        data: null,
        error: null,
      });

      const url = await documentService.getDownloadUrl('doc-123');

      expect(url).toBe('https://test.supabase.co/storage/v1/object/sign/test-path');
      expect(mockSupabase.storage.from).toHaveBeenCalledWith('organization-documents');
    });
  });

  describe('getRecentDocuments', () => {
    it('should fetch recent documents for organization', async () => {
      const recentDocs = [
        { ...mockDocument, id: 'doc-1', created_at: '2024-01-03' },
        { ...mockDocument, id: 'doc-2', created_at: '2024-01-02' },
        { ...mockDocument, id: 'doc-3', created_at: '2024-01-01' },
      ];

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().is().order().limit as any).mockResolvedValue({
        data: recentDocs,
        error: null,
      });

      const result = await documentService.getRecentDocuments('org-123', 10);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('doc-1');
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
    });

    it('should exclude deleted documents', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().is().order().limit as any).mockResolvedValue({
        data: [mockDocument],
        error: null,
      });

      await documentService.getRecentDocuments('org-123');

      expect(mockQuery.is).toHaveBeenCalledWith('deleted_at', null);
    });
  });

  describe('getStorageQuota', () => {
    it('should return storage quota information', async () => {
      const documents = [
        { ...mockDocument, file_size: 1000000 },
        { ...mockDocument, id: 'doc-2', file_size: 2000000 },
        { ...mockDocument, id: 'doc-3', file_size: 3000000 },
      ];

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().is as any).mockResolvedValue({
        data: documents,
        error: null,
      });

      const quota = await documentService.getStorageQuota('org-123');

      expect(quota.organizationId).toBe('org-123');
      expect(quota.used).toBe(6000000);
      expect(quota.documentCount).toBe(3);
      expect(quota.percentage).toBeGreaterThan(0);
    });

    it('should handle organization with no documents', async () => {
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().is as any).mockResolvedValue({
        data: [],
        error: null,
      });

      const quota = await documentService.getStorageQuota('org-123');

      expect(quota.totalDocuments).toBe(0);
      expect(quota.used).toBe(0);
      expect(quota.percentage).toBe(0);
    });
  });

  describe('bulkOperation', () => {
    it('should delete multiple documents', async () => {
      const request = {
        documentIds: ['doc-1', 'doc-2', 'doc-3'],
        operation: 'delete' as const,
      };

      // Mock getDocument for each delete call
      const mockGetQuery = mockSupabase.from();
      (mockGetQuery.select().eq().is().single as any).mockResolvedValue({
        data: mockDocument,
        error: null,
      });

      // Mock deleteDocument (update)
      const mockDeleteQuery = mockSupabase.from();
      (mockDeleteQuery.update().eq as any).mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await documentService.bulkOperation(request);

      expect(result.success).toBe(true);
      expect(result.successCount).toBe(3);
      expect(result.failureCount).toBe(0);
    });

    it('should move multiple documents', async () => {
      const request = {
        documentIds: ['doc-1', 'doc-2'],
        operation: 'move' as const,
        params: { folderId: 'folder-123' },
      };

      // Mock updateDocument
      const mockUpdateQuery = mockSupabase.from();
      (mockUpdateQuery.update().eq().is().select().single as any).mockResolvedValue({
        data: { ...mockDocument, folder_id: 'folder-123' },
        error: null,
      });

      const result = await documentService.bulkOperation(request);

      expect(result.success).toBe(true);
      expect(result.successCount).toBe(2);
    });
  });

  describe('recordView', () => {
    it('should increment view count', async () => {
      const dbDocument = {
        ...mockDocument,
        view_count: 5,
      };

      // Mock getDocument
      const mockGetQuery = mockSupabase.from();
      (mockGetQuery.select().eq().is().single as any).mockResolvedValue({
        data: dbDocument,
        error: null,
      });

      // Mock update
      const mockUpdateQuery = mockSupabase.from();
      (mockUpdateQuery.update().eq as any).mockResolvedValue({
        data: null,
        error: null,
      });

      await documentService.recordView('doc-123');

      expect(mockUpdateQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          view_count: 6,
          last_viewed_at: expect.any(String),
        })
      );
    });
  });
});
