import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { documentService } from '@/services/documentService';
import { mockUser, mockDocument, createMockFile } from '@/test/testUtils';

// Mock dependencies
vi.mock('@/lib/supabase/server');
vi.mock('@/services/documentService');
vi.mock('@/lib/api-error-handler');
vi.mock('@/lib/logger');

describe('Documents API Routes', () => {
  let mockSupabaseClient: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSupabaseClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    };

    (createServerSupabaseClient as any).mockResolvedValue(mockSupabaseClient);
  });

  describe('GET /api/v1/documents', () => {
    it('should return documents list with authentication', async () => {
      const searchResults = {
        documents: [mockDocument],
        total: 1,
      };

      (documentService.searchDocuments as any).mockResolvedValue(searchResults);

      const url = new URL('http://localhost:3000/api/v1/documents');
      url.searchParams.set('organizationId', 'org-123');

      const request = new NextRequest(url);
      const response = await GET(request);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.documents).toHaveLength(1);
      expect(data.data.total).toBe(1);
    });

    it('should return 401 when not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Unauthorized' },
      });

      const url = new URL('http://localhost:3000/api/v1/documents');
      url.searchParams.set('organizationId', 'org-123');

      const request = new NextRequest(url);
      const response = await GET(request);

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 when organizationId is missing', async () => {
      const url = new URL('http://localhost:3000/api/v1/documents');
      const request = new NextRequest(url);
      const response = await GET(request);

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('organizationId is required');
    });

    it('should handle search parameters', async () => {
      const searchResults = {
        documents: [mockDocument],
        total: 1,
      };

      (documentService.searchDocuments as any).mockResolvedValue(searchResults);

      const url = new URL('http://localhost:3000/api/v1/documents');
      url.searchParams.set('organizationId', 'org-123');
      url.searchParams.set('query', 'test');
      url.searchParams.set('tags', 'important,urgent');
      url.searchParams.set('limit', '20');
      url.searchParams.set('offset', '10');

      const request = new NextRequest(url);
      await GET(request);

      expect(documentService.searchDocuments).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: 'org-123',
          query: 'test',
          tags: ['important', 'urgent'],
          limit: 20,
          offset: 10,
        })
      );
    });

    it('should filter by folder', async () => {
      const searchResults = {
        documents: [mockDocument],
        total: 1,
      };

      (documentService.searchDocuments as any).mockResolvedValue(searchResults);

      const url = new URL('http://localhost:3000/api/v1/documents');
      url.searchParams.set('organizationId', 'org-123');
      url.searchParams.set('folderId', 'folder-123');

      const request = new NextRequest(url);
      await GET(request);

      expect(documentService.searchDocuments).toHaveBeenCalledWith(
        expect.objectContaining({
          folderId: 'folder-123',
        })
      );
    });

    it('should handle date range filters', async () => {
      const searchResults = {
        documents: [mockDocument],
        total: 1,
      };

      (documentService.searchDocuments as any).mockResolvedValue(searchResults);

      const url = new URL('http://localhost:3000/api/v1/documents');
      url.searchParams.set('organizationId', 'org-123');
      url.searchParams.set('dateFrom', '2024-01-01');
      url.searchParams.set('dateTo', '2024-12-31');

      const request = new NextRequest(url);
      await GET(request);

      expect(documentService.searchDocuments).toHaveBeenCalledWith(
        expect.objectContaining({
          dateFrom: '2024-01-01',
          dateTo: '2024-12-31',
        })
      );
    });

    it('should handle sorting parameters', async () => {
      const searchResults = {
        documents: [mockDocument],
        total: 1,
      };

      (documentService.searchDocuments as any).mockResolvedValue(searchResults);

      const url = new URL('http://localhost:3000/api/v1/documents');
      url.searchParams.set('organizationId', 'org-123');
      url.searchParams.set('sortBy', 'name');
      url.searchParams.set('sortOrder', 'asc');

      const request = new NextRequest(url);
      await GET(request);

      expect(documentService.searchDocuments).toHaveBeenCalledWith(
        expect.objectContaining({
          sortBy: 'name',
          sortOrder: 'asc',
        })
      );
    });
  });

  describe('POST /api/v1/documents', () => {
    it('should upload document successfully', async () => {
      (documentService.uploadDocument as any).mockResolvedValue(mockDocument);

      const file = createMockFile('test.pdf', 1024000, 'application/pdf');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('organizationId', 'org-123');
      formData.append('name', 'Test Document');

      const request = new NextRequest('http://localhost:3000/api/v1/documents', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

<<<<<<< HEAD
      expect(response.status).toBe(200); // API returns 200 for successful upload
=======
      expect(response.status).toBe(201); // 201 Created is correct for POST
>>>>>>> 05f07ec71c0c13bbe1c7d94ae8f18e2a05d381c4

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockDocument);
    });

    it('should return 401 when not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Unauthorized' },
      });

      const file = createMockFile('test.pdf', 1024000, 'application/pdf');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('organizationId', 'org-123');

      const request = new NextRequest('http://localhost:3000/api/v1/documents', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('should return 400 when file is missing', async () => {
      const formData = new FormData();
      formData.append('organizationId', 'org-123');

      const request = new NextRequest('http://localhost:3000/api/v1/documents', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('file is required');
    });

    it('should return 400 when organizationId is missing', async () => {
      const file = createMockFile('test.pdf', 1024000, 'application/pdf');
      const formData = new FormData();
      formData.append('file', file);

      const request = new NextRequest('http://localhost:3000/api/v1/documents', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('organizationId is required');
    });

    it('should handle optional fields (folderId, description, tags)', async () => {
      (documentService.uploadDocument as any).mockResolvedValue(mockDocument);

      const file = createMockFile('test.pdf', 1024000, 'application/pdf');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('organizationId', 'org-123');
      formData.append('name', 'Test Document');
      formData.append('folderId', 'folder-123');
      formData.append('description', 'Test description');
      formData.append('tags', JSON.stringify(['tag1', 'tag2']));

      const request = new NextRequest('http://localhost:3000/api/v1/documents', {
        method: 'POST',
        body: formData,
      });

      await POST(request);

      expect(documentService.uploadDocument).toHaveBeenCalledWith(
        expect.objectContaining({
          folderId: 'folder-123',
          description: 'Test description',
          tags: ['tag1', 'tag2'],
        })
      );
    });

    it('should handle AI processing flag', async () => {
      (documentService.uploadDocument as any).mockResolvedValue(mockDocument);

      const file = createMockFile('test.pdf', 1024000, 'application/pdf');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('organizationId', 'org-123');
      formData.append('aiEnabled', 'true');

      const request = new NextRequest('http://localhost:3000/api/v1/documents', {
        method: 'POST',
        body: formData,
      });

      await POST(request);

      expect(documentService.uploadDocument).toHaveBeenCalledWith(
        expect.objectContaining({
          aiEnabled: true,
        })
      );
    });

    it('should handle upload errors', async () => {
      (documentService.uploadDocument as any).mockRejectedValue(
        new Error('Upload failed')
      );

      const file = createMockFile('test.pdf', 1024000, 'application/pdf');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('organizationId', 'org-123');

      const request = new NextRequest('http://localhost:3000/api/v1/documents', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
    });

    it('should parse tags from comma-separated string', async () => {
      (documentService.uploadDocument as any).mockResolvedValue(mockDocument);

      const file = createMockFile('test.pdf', 1024000, 'application/pdf');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('organizationId', 'org-123');
      formData.append('tags', 'tag1, tag2, tag3');

      const request = new NextRequest('http://localhost:3000/api/v1/documents', {
        method: 'POST',
        body: formData,
      });

      await POST(request);

      expect(documentService.uploadDocument).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: expect.arrayContaining(['tag1', 'tag2', 'tag3']),
        })
      );
    });
  });
});
