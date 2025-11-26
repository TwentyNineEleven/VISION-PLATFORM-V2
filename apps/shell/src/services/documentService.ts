/**
 * Document Service
 * 
 * Core document management service handling:
 * - Document upload/download with Supabase Storage
 * - CRUD operations with text extraction
 * - Search functionality (full-text + future semantic)
 * - Version management
 * - Bulk operations
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import { documentParserService } from './documentParserService';
import {
  generateStoragePath,
  generateVersionPath,
  validateFileSize,
  validateFileName,
  getFileExtension,
} from '@/utils/documentUtils';
import type {
  Document,
  DocumentWithRelations,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  DocumentSearchParams,
  DocumentSearchResult,
  DocumentVersion,
  BulkOperationRequest,
  BulkOperationResult,
  StorageQuota,
} from '@/types/document';

// Maximum file size: 15MB
const MAX_FILE_SIZE = 15 * 1024 * 1024;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert database row to Document type
 */
function dbToDocument(dbDoc: any): Document {
  return {
    id: dbDoc.id,
    organizationId: dbDoc.organization_id,
    folderId: dbDoc.folder_id,
    name: dbDoc.name,
    description: dbDoc.description,
    filePath: dbDoc.file_path,
    fileSize: dbDoc.file_size,
    mimeType: dbDoc.mime_type,
    extension: dbDoc.extension,
    versionNumber: dbDoc.version_number,
    currentVersionId: dbDoc.current_version_id,
    tags: dbDoc.tags || [],
    metadata: dbDoc.metadata || {},
    extractedText: dbDoc.extracted_text,
    extractedTextLength: dbDoc.extracted_text_length,
    textExtractedAt: dbDoc.text_extracted_at,
    aiSummary: dbDoc.ai_summary,
    aiKeywords: dbDoc.ai_keywords,
    aiTopics: dbDoc.ai_topics,
    aiEntities: dbDoc.ai_entities,
    aiSentiment: dbDoc.ai_sentiment,
    aiLanguage: dbDoc.ai_language,
    aiMetadata: dbDoc.ai_metadata || {},
    contentEmbeddings: dbDoc.content_embeddings,
    aiProvider: dbDoc.ai_provider,
    aiEnabled: dbDoc.ai_enabled || false,
    aiProcessingStatus: dbDoc.ai_processing_status,
    aiProcessedAt: dbDoc.ai_processed_at,
    aiError: dbDoc.ai_error,
    viewCount: dbDoc.view_count || 0,
    downloadCount: dbDoc.download_count || 0,
    lastViewedAt: dbDoc.last_viewed_at,
    lastDownloadedAt: dbDoc.last_downloaded_at,
    uploadedBy: dbDoc.uploaded_by,
    updatedBy: dbDoc.updated_by,
    createdAt: dbDoc.created_at,
    updatedAt: dbDoc.updated_at,
    deletedAt: dbDoc.deleted_at,
    deletedBy: dbDoc.deleted_by,
  };
}

// ============================================================================
// DOCUMENT SERVICE
// ============================================================================

export const documentService = {
  /**
   * Get document by ID
   */
  async getDocument(documentId: string): Promise<Document | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('documents' as any)
      .select('*')
      .eq('id', documentId)
      .eq('deleted_at', null)
      .single();

    if (error || !data) {
      console.error('Error fetching document:', error);
      return null;
    }

    return dbToDocument(data);
  },

  /**
   * Get documents for organization or folder
   */
  async getDocuments(
    organizationId: string,
    folderId?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Document[]> {
    const supabase = createClient();

    let query = supabase
      .from('documents' as any)
      .select('*')
      .eq('organization_id', organizationId)
      .eq('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (folderId) {
      query = query.eq('folder_id', folderId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching documents:', error);
      return [];
    }

    return data.map(dbToDocument);
  },

  /**
   * Upload a new document
   */
  async uploadDocument(request: CreateDocumentRequest): Promise<Document> {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Validate file
    const { file, name, organizationId, folderId, description, tags, metadata, aiEnabled } = request;

    // Validate file size
    const sizeValidation = validateFileSize(file.size, MAX_FILE_SIZE);
    if (!sizeValidation.valid) {
      throw new Error(sizeValidation.error);
    }

    // Validate file name
    const fileName = name || file.name;
    const nameValidation = validateFileName(fileName);
    if (!nameValidation.valid) {
      throw new Error(nameValidation.error);
    }

    // Generate storage path
    const storagePath = generateStoragePath(organizationId, fileName, folderId);
    const extension = getFileExtension(fileName);

    // Extract text from file (NO AI required)
    const parseResult = await documentParserService.parseFile(file);
    const extractedText = parseResult.success ? parseResult.text : undefined;
    const extractedTextLength = extractedText?.length || 0;

    // Upload file to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('organization-documents')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // Create document record
    const documentData = {
      organization_id: organizationId,
      folder_id: folderId || null,
      name: fileName,
      description: description || null,
      file_path: storagePath,
      file_size: file.size,
      mime_type: file.type,
      extension,
      version_number: 1,
      tags: tags || [],
      metadata: metadata || {},
      extracted_text: extractedText,
      extracted_text_length: extractedTextLength,
      text_extracted_at: new Date().toISOString(),
      ai_enabled: aiEnabled || false,
      ai_processing_status: aiEnabled ? 'pending' : 'disabled',
      uploaded_by: user.id,
      updated_by: user.id,
    };

    const { data: document, error: dbError } = await supabase
      .from('documents' as any)
      .insert(documentData)
      .select()
      .single();

    if (dbError || !document) {
      // Clean up uploaded file on error
      await supabase.storage
        .from('organization-documents')
        .remove([storagePath]);

      throw new Error(`Failed to create document record: ${dbError?.message || 'Unknown error'}`);
    }

    // Create initial version
    await this.createVersion((document as any).id, storagePath, file.size, file.type, user.id);

    return dbToDocument(document);
  },

  /**
   * Create a new version of a document
   */
  async createVersion(
    documentId: string,
    filePath: string,
    fileSize: number,
    mimeType: string,
    createdBy: string,
    changeNotes?: string
  ): Promise<void> {
    const supabase = createClient();

    const document = await this.getDocument(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    const versionData = {
      document_id: documentId,
      version_number: document.versionNumber,
      file_path: filePath,
      file_size: fileSize,
      mime_type: mimeType,
      change_notes: changeNotes || null,
      created_by: createdBy,
    };

    const { data: version, error } = await supabase
      .from('document_versions' as any)
      .insert(versionData)
      .select()
      .single();

    if (error) {
      console.error('Error creating version:', error);
      // Don't throw - version creation is not critical
    }

    // Update document's current_version_id (if version was created successfully)
    if (version) {
      await supabase
        .from('documents' as any)
        .update({ current_version_id: (version as any).id })
        .eq('id', documentId);
    }
  },

  /**
   * Update document metadata
   */
  async updateDocument(documentId: string, request: UpdateDocumentRequest): Promise<Document> {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const updateData: any = {
      updated_by: user.id,
    };

    if (request.name !== undefined) updateData.name = request.name;
    if (request.description !== undefined) updateData.description = request.description;
    if (request.folderId !== undefined) updateData.folder_id = request.folderId;
    if (request.tags !== undefined) updateData.tags = request.tags;
    if (request.metadata !== undefined) {
      updateData.metadata = { ...request.metadata };
    }

    const { data, error } = await supabase
      .from('documents' as any)
      .update(updateData)
      .eq('id', documentId)
      .eq('deleted_at', null)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update document: ${error?.message || 'Unknown error'}`);
    }

    return dbToDocument(data);
  },

  /**
   * Delete document (soft delete)
   */
  async deleteDocument(documentId: string): Promise<void> {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('documents' as any)
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
      })
      .eq('id', documentId);

    if (error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }

    // Note: We don't delete the file from storage immediately
    // This allows for potential restore functionality
    // A cleanup job can remove files for documents deleted > 30 days ago
  },

  /**
   * Download document (get signed URL)
   */
  async getDownloadUrl(documentId: string, expiresIn: number = 3600): Promise<string> {
    const supabase = createClient();

    // Get document
    const document = await this.getDocument(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    // Get signed URL for download
    const { data, error } = await supabase.storage
      .from('organization-documents')
      .createSignedUrl(document.filePath, expiresIn);

    if (error || !data) {
      throw new Error(`Failed to generate download URL: ${error?.message || 'Unknown error'}`);
    }

    // Increment download count
    await supabase
      .from('documents' as any)
      .update({
        download_count: document.downloadCount + 1,
        last_downloaded_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    return data.signedUrl;
  },

  /**
   * Search documents with filters
   */
  async searchDocuments(params: DocumentSearchParams): Promise<DocumentSearchResult> {
    const supabase = createClient();

    const {
      query,
      organizationId,
      folderId,
      tags,
      mimeTypes,
      uploadedBy,
      dateFrom,
      dateTo,
      minSize,
      maxSize,
      hasAI,
      sortBy = 'created_at',
      sortOrder = 'desc',
      limit = 50,
      offset = 0,
    } = params;

    // Build query
    let dbQuery = supabase
      .from('documents' as any)
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .eq('deleted_at', null);

    // Apply filters
    if (folderId) {
      dbQuery = dbQuery.eq('folder_id', folderId);
    }

    if (query) {
      // Full-text search on name, description, and extracted text
      dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,extracted_text.ilike.%${query}%`);
    }

    if (tags && tags.length > 0) {
      dbQuery = dbQuery.contains('tags', tags);
    }

    if (mimeTypes && mimeTypes.length > 0) {
      dbQuery = dbQuery.in('mime_type', mimeTypes);
    }

    if (uploadedBy) {
      dbQuery = dbQuery.eq('uploaded_by', uploadedBy);
    }

    if (dateFrom) {
      dbQuery = dbQuery.gte('created_at', dateFrom);
    }

    if (dateTo) {
      dbQuery = dbQuery.lte('created_at', dateTo);
    }

    if (minSize !== undefined) {
      dbQuery = dbQuery.gte('file_size', minSize);
    }

    if (maxSize !== undefined) {
      dbQuery = dbQuery.lte('file_size', maxSize);
    }

    if (hasAI !== undefined) {
      dbQuery = dbQuery.eq('ai_enabled', hasAI);
    }

    // Apply sorting
    dbQuery = dbQuery.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    dbQuery = dbQuery.range(offset, offset + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error) {
      console.error('Error searching documents:', error);
      return {
        documents: [],
        total: 0,
        hasMore: false,
      };
    }

    return {
      documents: data.map(dbToDocument),
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    };
  },

  /**
   * Get recent documents
   */
  async getRecentDocuments(organizationId: string, limit: number = 10): Promise<Document[]> {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('documents' as any)
      .select('*')
      .eq('organization_id', organizationId)
      .eq('uploaded_by', user.id)
      .eq('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent documents:', error);
      return [];
    }

    return data.map(dbToDocument);
  },

  /**
   * Get storage quota information
   */
  async getStorageQuota(organizationId: string): Promise<StorageQuota> {
    const supabase = createClient();

    // Get total size and count of documents
    const { data, error } = await supabase
      .from('documents' as any)
      .select('file_size')
      .eq('organization_id', organizationId)
      .eq('deleted_at', null);

    if (error) {
      console.error('Error fetching storage quota:', error);
      return {
        organizationId,
        used: 0,
        limit: 1024 * 1024 * 1024, // 1GB default
        percentage: 0,
        documentCount: 0,
      };
    }

    const used = data.reduce((sum, doc: any) => sum + (doc.file_size || 0), 0);
    const limit = 1024 * 1024 * 1024; // 1GB default (could come from org settings)
    const percentage = Math.min(100, (used / limit) * 100);

    return {
      organizationId,
      used,
      limit,
      percentage,
      documentCount: data.length,
    };
  },

  /**
   * Bulk operations on documents
   */
  async bulkOperation(request: BulkOperationRequest): Promise<BulkOperationResult> {
    const { documentIds, operation, params } = request;
    
    const result: BulkOperationResult = {
      success: true,
      successCount: 0,
      failureCount: 0,
      errors: [],
    };

    for (const documentId of documentIds) {
      try {
        switch (operation) {
          case 'move':
            if (params?.folderId !== undefined) {
              await this.updateDocument(documentId, { folderId: params.folderId });
            }
            break;

          case 'delete':
            await this.deleteDocument(documentId);
            break;

          case 'tag':
            if (params?.tags) {
              const doc = await this.getDocument(documentId);
              if (doc) {
                const newTags = [...new Set([...doc.tags, ...params.tags])];
                await this.updateDocument(documentId, { tags: newTags });
              }
            }
            break;

          case 'restore':
            // Restore from soft delete
            const supabase = createClient();
            await supabase
              .from('documents' as any)
              .update({ deleted_at: null, deleted_by: null })
              .eq('id', documentId);
            break;

          default:
            throw new Error(`Unknown operation: ${operation}`);
        }

        result.successCount++;
      } catch (error) {
        result.failureCount++;
        result.errors.push({
          documentId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    result.success = result.failureCount === 0;
    return result;
  },

  /**
   * Increment view count
   */
  async recordView(documentId: string): Promise<void> {
    const supabase = createClient();
    
    const document = await this.getDocument(documentId);
    if (!document) return;

    await supabase
      .from('documents' as any)
      .update({
        view_count: document.viewCount + 1,
        last_viewed_at: new Date().toISOString(),
      })
      .eq('id', documentId);
  },
};

// ============================================================================
// EXPORT
// ============================================================================

export default documentService;
