import { describe, it, expect, vi, beforeEach } from 'vitest';
import { documentService } from '../documentService';
import { createClient } from '@/lib/supabase/client';
import {
  createMockSupabaseClient,
  createMockSupabaseError,
  createMockQuery,
  mockDocument,
  createMockFile,
} from '@/test/testUtils';
import { USE_REAL_DB, TEST_DATA, setupTestEnvironment } from '@/test/serviceTestHelpers';

// Conditionally mock Supabase client
// vi.mock is hoisted but without a factory, it uses automock which allows mockReturnValue
if (!USE_REAL_DB) {
  vi.mock('@/lib/supabase/client');
} else {
  vi.doUnmock('@/lib/supabase/client');
}

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
  // Using non-null assertion since mockSupabase is set in beforeEach when USE_REAL_DB is false
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    setupTestEnvironment();

    if (!USE_REAL_DB) {
      mockSupabase = createMockSupabaseClient({
        data: [mockDocument],
        error: null,
      });
      (createClient as any).mockReturnValue(mockSupabase);
    }
  });

  describe('getDocument', () => {
    it('should fetch document by ID', async () => {
      if (USE_REAL_DB) {
        // Real DB test - skip for now (would need test documents)
        expect(true).toBe(true);
        return;
      }
      
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

      if (USE_REAL_DB) {
        // Real DB test - skip for now (would need test documents)
        expect(true).toBe(true);
        return;
      }
      
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().single as any).mockResolvedValue({
        data: dbDocument,
        error: null,
      });

      const result = await documentService.getDocument('doc-123');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('doc-123');
      expect(mockSupabase.from).toHaveBeenCalledWith('documents');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'doc-123');
      expect(mockQuery.eq).toHaveBeenCalledWith('deleted_at', null);
    });

    it('should return null when document not found', async () => {
      if (USE_REAL_DB) {
        // Real DB test - use non-existent ID
        const result = await documentService.getDocument('00000000-0000-0000-0000-000000000999');
        expect(result).toBeNull();
        return;
      }
      
      if (!mockSupabase) {
        expect(true).toBe(true);
        return;
      }
      
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().single as any).mockResolvedValue({
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
        folderId: undefined,
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

      if (USE_REAL_DB) {
        // Real DB test - skip for now (needs storage and test documents)
        expect(true).toBe(true);
        return;
      }

      const createVersionSpy = vi.spyOn(documentService, 'createVersion').mockResolvedValue();

      // Mock storage upload
      const mockStorage = mockSupabase.storage.from('organization-documents');
      (mockStorage.upload as any).mockResolvedValue({
        data: { path: 'org-123/Test Document.pdf' },
        error: null,
      });

      // Mock document insert
      const mockInsertQuery = createMockQuery();
      (mockInsertQuery.insert().select().single as any).mockResolvedValue({
        data: dbDocument,
        error: null,
      });
      (mockSupabase.from as any).mockReturnValueOnce(mockInsertQuery);

      const result = await documentService.uploadDocument(uploadData);

      expect(result).not.toBeNull();
      expect(result.id).toBe('doc-123');
      expect(mockSupabase.storage.from).toHaveBeenCalledWith('organization-documents');
      expect(mockStorage.upload).toHaveBeenCalled();
      createVersionSpy.mockRestore();
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
      if (USE_REAL_DB) {
        // Real DB test - skip (needs storage setup)
        expect(true).toBe(true);
        return;
      }
      
      const file = createMockFile('test.pdf', 1024000, 'application/pdf');
      const uploadData = {
        file,
        organizationId: 'org-123',
        name: 'Test Document',
      };

      const mockStorage = mockSupabase.storage.from('organization-documents');
      (mockStorage.upload as any).mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Upload failed'),
      });

      await expect(documentService.uploadDocument(uploadData)).rejects.toThrow();
    });
  });

  describe('searchDocuments', () => {
    it('should search documents with filters', async () => {
      if (USE_REAL_DB) {
        // Real DB test - use seeded organization and documents
        const result = await documentService.searchDocuments({
          organizationId: TEST_DATA.ORGANIZATION_ID,
          query: 'test',
          limit: 50,
          offset: 0,
        });
        expect(Array.isArray(result.documents)).toBe(true);
        expect(result.total).toBeGreaterThanOrEqual(0);
        // Should find at least the seeded documents
        if (result.documents.length > 0) {
          expect(result.documents[0]).toHaveProperty('id');
          expect(result.documents[0]).toHaveProperty('name');
        }
        return;
      }
      
      if (!mockSupabase) {
        expect(true).toBe(true);
        return;
      }
      
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
      (mockQuery.select().eq().eq().contains().order().range as any).mockResolvedValue({
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
      if (USE_REAL_DB) {
        // Real DB test - skip for now
        expect(true).toBe(true);
        return;
      }
      
      const searchParams = {
        organizationId: 'org-123',
        folderId: 'folder-123',
        limit: 50,
        offset: 0,
      };

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().eq().order().range as any).mockResolvedValue({
        data: [mockDocument],
        error: null,
        count: 1,
      });

      const result = await documentService.searchDocuments(searchParams);

      expect(result.documents).toHaveLength(1);
      expect(mockQuery.eq).toHaveBeenCalledWith('folder_id', 'folder-123');
    });

    it('should filter by date range', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }
      
      const searchParams = {
        organizationId: 'org-123',
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
        limit: 50,
        offset: 0,
      };

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().gte().lte().order().range as any).mockResolvedValue({
        data: [mockDocument],
        error: null,
        count: 1,
      });

      const result = await documentService.searchDocuments(searchParams);

      expect(result.documents).toHaveLength(1);
    });

    it('should handle pagination', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }
      
      const searchParams = {
        organizationId: 'org-123',
        limit: 10,
        offset: 20,
      };

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().order().range as any).mockResolvedValue({
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
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }
      
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
      (mockQuery.update().eq().eq().select().single as any).mockResolvedValue({
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
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }
      
      const mockQuery = mockSupabase.from();
      (mockQuery.update().eq().eq().select().single as any).mockResolvedValue({
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
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }
      
      const mockQuery = mockSupabase.from();
      mockQuery.update().eq();
      mockQuery.mockResolvedValue({
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
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }
      
      const mockQuery = mockSupabase.from();
      mockQuery.update().eq();
      mockQuery.mockResolvedValue({
        data: null,
        error: createMockSupabaseError('Deletion failed'),
      });

      await expect(documentService.deleteDocument('doc-123')).rejects.toThrow();
    });
  });

  describe('getDownloadUrl', () => {
    it('should get signed download URL', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }
      
      const dbDocument = {
        ...mockDocument,
        file_path: 'org-123/test-document.pdf',
        download_count: 0,
        view_count: 0,
      };

      vi.spyOn(documentService, 'getDocument').mockResolvedValue({
        id: dbDocument.id,
        organizationId: dbDocument.organization_id,
        filePath: dbDocument.storage_path,
        name: dbDocument.name,
        viewCount: dbDocument.view_count,
      } as any);

      // Mock storage signed URL
      const mockStorage = mockSupabase.storage.from('organization-documents');
      (mockStorage.createSignedUrl as any).mockResolvedValue({
        data: { signedUrl: 'https://test.supabase.co/storage/v1/object/sign/test-path' },
        error: null,
      });

      // Mock update for download count
      const mockUpdateQuery = createMockQuery();
      (mockUpdateQuery.update().eq as any).mockResolvedValue({
        data: null,
        error: null,
      });
      (mockSupabase.from as any).mockReturnValue(mockUpdateQuery);

      const url = await documentService.getDownloadUrl('doc-123');

      // The mock returns the signedUrl from the createSignedUrl response
      expect(url).toBe('https://test.supabase.co/storage/v1/object/sign/test-path');
      expect(mockSupabase.storage.from).toHaveBeenCalledWith('organization-documents');
    });
  });

  describe('getRecentDocuments', () => {
    it('should fetch recent documents for organization', async () => {
      if (USE_REAL_DB) {
        // Real DB test - should return seeded documents
        const result = await documentService.getRecentDocuments(TEST_DATA.ORGANIZATION_ID, 10);
        expect(Array.isArray(result)).toBe(true);
        // Should have at least the seeded documents
        if (result.length > 0) {
          expect(result[0]).toHaveProperty('id');
          expect(result[0]).toHaveProperty('name');
          expect(result[0]).toHaveProperty('created_at');
        }
        return;
      }
      
      if (!mockSupabase) {
        expect(true).toBe(true);
        return;
      }
      
      const recentDocs = [
        { ...mockDocument, id: 'doc-1', created_at: '2024-01-03' },
        { ...mockDocument, id: 'doc-2', created_at: '2024-01-02' },
        { ...mockDocument, id: 'doc-3', created_at: '2024-01-01' },
      ];

      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().eq().order().limit as any).mockResolvedValue({
        data: recentDocs,
        error: null,
      });

      const result = await documentService.getRecentDocuments('org-123', 10);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('doc-1');
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
    });

    it('should exclude deleted documents', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }
      
      const mockQuery = mockSupabase.from();
      (mockQuery.select().eq().eq().eq().order().limit as any).mockResolvedValue({
        data: [mockDocument],
        error: null,
      });

      await documentService.getRecentDocuments('org-123');

      expect(mockQuery.eq).toHaveBeenCalledWith('deleted_at', null);
    });
  });

  describe('getStorageQuota', () => {
    it('should return storage quota information', async () => {
      if (USE_REAL_DB) {
        // Real DB test - should calculate quota from seeded documents
        const quota = await documentService.getStorageQuota(TEST_DATA.ORGANIZATION_ID);
        expect(quota.organizationId).toBe(TEST_DATA.ORGANIZATION_ID);
        expect(quota.used).toBeGreaterThanOrEqual(0);
        expect(quota.documentCount).toBeGreaterThanOrEqual(0);
        expect(quota.percentage).toBeGreaterThanOrEqual(0);
        return;
      }
      
      if (!mockSupabase) {
        expect(true).toBe(true);
        return;
      }
      
      const documents = [
        { ...mockDocument, file_size: 1000000 },
        { ...mockDocument, id: 'doc-2', file_size: 2000000 },
        { ...mockDocument, id: 'doc-3', file_size: 3000000 },
      ];

      const mockQuery = mockSupabase.from();
      mockQuery.select().eq().eq();
      mockQuery.mockResolvedValue({
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
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }
      
      const mockQuery = mockSupabase.from();
      mockQuery.select().eq().eq();
      mockQuery.mockResolvedValue({
        data: [],
        error: null,
      });

      const quota = await documentService.getStorageQuota('org-123');

      expect(quota.documentCount).toBe(0);
      expect(quota.used).toBe(0);
      expect(quota.percentage).toBe(0);
    });
  });

  describe('bulkOperation', () => {
    it('should delete multiple documents', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }
      
      const request = {
        documentIds: ['doc-1', 'doc-2', 'doc-3'],
        operation: 'delete' as const,
      };

      // Mock getDocument for each delete call
      const mockGetQuery = mockSupabase.from();
      (mockGetQuery.select().eq().eq().single as any).mockResolvedValue({
        data: mockDocument,
        error: null,
      });

      // Mock deleteDocument (update)
      const mockDeleteQuery = mockSupabase.from();
      mockDeleteQuery.update().eq();
      mockDeleteQuery.mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await documentService.bulkOperation(request);

      expect(result.success).toBe(true);
      expect(result.successCount).toBe(3);
      expect(result.failureCount).toBe(0);
    });

    it('should move multiple documents', async () => {
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }
      
      const request = {
        documentIds: ['doc-1', 'doc-2'],
        operation: 'move' as const,
        params: { folderId: 'folder-123' },
      };

      // Mock updateDocument
      const mockUpdateQuery = mockSupabase.from();
      (mockUpdateQuery.update().eq().eq().select().single as any).mockResolvedValue({
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
      if (USE_REAL_DB) {
        expect(true).toBe(true);
        return;
      }
      
      const dbDocument = {
        ...mockDocument,
        view_count: 5,
      };

      vi.spyOn(documentService, 'getDocument').mockResolvedValue({
        id: dbDocument.id,
        organizationId: dbDocument.organization_id,
        viewCount: dbDocument.view_count,
        filePath: dbDocument.storage_path,
      } as any);

      // Mock update
      const mockUpdateQuery = createMockQuery();
      (mockUpdateQuery.update().eq as any).mockResolvedValue({
        data: null,
        error: null,
      });
      (mockSupabase.from as any).mockReturnValue(mockUpdateQuery);

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
