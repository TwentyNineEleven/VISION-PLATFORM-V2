/**
 * Document Management System - Type Definitions
 * 
 * This file contains all TypeScript types for the document management system.
 * These types are AI-agnostic and work with or without AI processing.
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export const DocumentPermission = {
  VIEW: 'view',
  EDIT: 'edit',
  ADMIN: 'admin',
} as const;

export type DocumentPermissionType = typeof DocumentPermission[keyof typeof DocumentPermission];

export const DocumentActivityAction = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',
  RESTORED: 'restored',
  UPLOADED: 'uploaded',
  DOWNLOADED: 'downloaded',
  VIEWED: 'viewed',
  SHARED: 'shared',
  UNSHARED: 'unshared',
  PERMISSION_CHANGED: 'permission_changed',
  MOVED: 'moved',
  RENAMED: 'renamed',
  TAGGED: 'tagged',
  VERSION_CREATED: 'version_created',
  VERSION_RESTORED: 'version_restored',
  COMMENTED: 'commented',
  MENTIONED: 'mentioned',
  AI_PROCESSED: 'ai_processed',
  AI_FAILED: 'ai_failed',
} as const;

export type DocumentActivityActionType = typeof DocumentActivityAction[keyof typeof DocumentActivityAction];

export const AIProcessingStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  DISABLED: 'disabled',
} as const;

export type AIProcessingStatusType = typeof AIProcessingStatus[keyof typeof AIProcessingStatus];

export const AIProvider = {
  NONE: 'none',
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  LOCAL: 'local',
} as const;

export type AIProviderType = typeof AIProvider[keyof typeof AIProvider];

export const AISentiment = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
} as const;

export type AISentimentType = typeof AISentiment[keyof typeof AISentiment];

// ============================================================================
// FOLDER TYPES
// ============================================================================

export interface Folder {
  id: string;
  organizationId: string;
  parentFolderId: string | null;
  
  // Folder info
  name: string;
  description?: string;
  color?: string; // Hex color
  icon?: string; // Icon identifier
  
  // Hierarchy
  path: string; // Materialized path
  depth: number;
  
  // Metadata
  isSystem: boolean;
  metadata: Record<string, any>;
  
  // Audit
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface FolderWithChildren extends Folder {
  children: FolderWithChildren[];
  documentCount?: number;
}

export interface CreateFolderRequest {
  organizationId: string;
  parentFolderId?: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateFolderRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  parentFolderId?: string;
}

// ============================================================================
// DOCUMENT TYPES
// ============================================================================

export interface Document {
  id: string;
  organizationId: string;
  folderId?: string;
  
  // Document info
  name: string;
  description?: string;
  filePath: string;
  fileSize: number; // bytes
  mimeType: string;
  extension?: string;
  
  // Versioning
  versionNumber: number;
  currentVersionId?: string;
  
  // Organization & discovery
  tags: string[];
  metadata: Record<string, any>;
  
  // Text extraction (always available, no AI needed)
  extractedText?: string;
  extractedTextLength?: number;
  textExtractedAt?: string;
  
  // AI fields (optional, only if AI enabled)
  aiSummary?: string;
  aiKeywords?: string[];
  aiTopics?: string[];
  aiEntities?: AIEntities;
  aiSentiment?: AISentimentType;
  aiLanguage?: string; // ISO 639-1 code
  aiMetadata?: Record<string, any>;
  contentEmbeddings?: number[]; // Vector embeddings
  
  // AI processing
  aiProvider?: AIProviderType;
  aiEnabled: boolean;
  aiProcessingStatus?: AIProcessingStatusType;
  aiProcessedAt?: string;
  aiError?: string;
  
  // Access tracking
  viewCount: number;
  downloadCount: number;
  lastViewedAt?: string;
  lastDownloadedAt?: string;
  
  // Audit
  uploadedBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface AIEntities {
  people?: string[];
  organizations?: string[];
  dates?: string[];
  locations?: string[];
  [key: string]: string[] | undefined;
}

export interface DocumentWithRelations extends Document {
  folder?: Folder;
  uploader?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  versions?: DocumentVersion[];
  shares?: DocumentShare[];
  currentVersion?: DocumentVersion;
}

export interface CreateDocumentRequest {
  organizationId: string;
  folderId?: string;
  name: string;
  description?: string;
  file: File;
  tags?: string[];
  metadata?: Record<string, any>;
  aiEnabled?: boolean;
}

export interface UpdateDocumentRequest {
  name?: string;
  description?: string;
  folderId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UploadDocumentResponse {
  document: Document;
  uploadUrl?: string;
  version?: DocumentVersion;
}

// ============================================================================
// DOCUMENT VERSION TYPES
// ============================================================================

export interface DocumentVersion {
  id: string;
  documentId: string;
  
  // Version info
  versionNumber: number;
  filePath: string;
  fileSize: number;
  mimeType: string;
  
  // Change tracking
  changeNotes?: string;
  changesSummary?: Record<string, any>;
  
  // Metadata
  metadata: Record<string, any>;
  
  // Audit
  createdBy: string;
  createdAt: string;
}

export interface DocumentVersionWithRelations extends DocumentVersion {
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateVersionRequest {
  documentId: string;
  file: File;
  changeNotes?: string;
}

// ============================================================================
// DOCUMENT SHARE TYPES
// ============================================================================

export interface DocumentShare {
  id: string;
  
  // Share target
  documentId?: string;
  folderId?: string;
  
  // Share recipient
  sharedWithUserId?: string;
  sharedWithRole?: string; // 'Owner', 'Admin', 'Member', 'Viewer'
  
  // Permission
  permission: DocumentPermissionType;
  
  // Options
  expiresAt?: string;
  allowDownload: boolean;
  allowReshare: boolean;
  requirePassword: boolean;
  passwordHash?: string;
  
  // Metadata
  metadata: Record<string, any>;
  
  // Audit
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  revokedAt?: string;
  revokedBy?: string;
}

export interface DocumentShareWithRelations extends DocumentShare {
  document?: Document;
  folder?: Folder;
  sharedWithUser?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateShareRequest {
  documentId?: string;
  folderId?: string;
  sharedWithUserId?: string;
  sharedWithRole?: string;
  permission: DocumentPermissionType;
  expiresAt?: string;
  allowDownload?: boolean;
  allowReshare?: boolean;
  requirePassword?: boolean;
  password?: string;
}

export interface UpdateShareRequest {
  permission?: DocumentPermissionType;
  expiresAt?: string;
  allowDownload?: boolean;
  allowReshare?: boolean;
}

// ============================================================================
// DOCUMENT ACTIVITY TYPES
// ============================================================================

export interface DocumentActivity {
  id: string;
  organizationId: string;
  
  // Activity target
  documentId?: string;
  folderId?: string;
  versionId?: string;
  
  // Activity details
  action: DocumentActivityActionType;
  
  // Activity data
  details: Record<string, any>;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  
  // Actor
  actorId?: string;
  actorName?: string;
  actorEmail?: string;
  
  // Context
  ipAddress?: string;
  userAgent?: string;
  
  // Timestamp
  createdAt: string;
}

export interface DocumentActivityWithRelations extends DocumentActivity {
  document?: Document;
  folder?: Folder;
  version?: DocumentVersion;
  actor?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

// ============================================================================
// SEARCH & FILTER TYPES
// ============================================================================

export interface DocumentSearchParams {
  query?: string;
  folderId?: string;
  organizationId: string;
  tags?: string[];
  mimeTypes?: string[];
  uploadedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  minSize?: number;
  maxSize?: number;
  hasAI?: boolean;
  sortBy?: 'name' | 'created_at' | 'updated_at' | 'file_size' | 'view_count';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface DocumentSearchResult {
  documents: DocumentWithRelations[];
  total: number;
  hasMore: boolean;
  aggregations?: {
    byMimeType: Record<string, number>;
    byFolder: Record<string, number>;
    byTag: Record<string, number>;
    byUploader: Record<string, number>;
  };
}

export interface SemanticSearchParams {
  query: string;
  organizationId: string;
  folderId?: string;
  limit?: number;
  threshold?: number; // Similarity threshold (0-1)
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

export interface BulkOperationRequest {
  documentIds: string[];
  operation: 'move' | 'delete' | 'tag' | 'share' | 'restore';
  params?: {
    folderId?: string;
    tags?: string[];
    shareWith?: CreateShareRequest;
  };
}

export interface BulkOperationResult {
  success: boolean;
  successCount: number;
  failureCount: number;
  errors: Array<{
    documentId: string;
    error: string;
  }>;
}

// ============================================================================
// STORAGE & UPLOAD TYPES
// ============================================================================

export interface UploadProgress {
  documentId?: string;
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface StorageQuota {
  organizationId: string;
  used: number; // bytes
  limit: number; // bytes
  percentage: number; // 0-100
  documentCount: number;
}

// ============================================================================
// AI ANALYSIS TYPES (Optional, Provider-Agnostic)
// ============================================================================

export interface AIAnalysisRequest {
  documentId: string;
  forceReprocess?: boolean;
}

export interface AIAnalysisResult {
  documentId: string;
  provider: AIProviderType;
  summary?: string;
  keywords?: string[];
  topics?: string[];
  entities?: AIEntities;
  sentiment?: AISentimentType;
  language?: string;
  processingTime: number; // milliseconds
  tokensUsed?: number;
  cost?: number; // in dollars
}

export interface AISearchResult {
  document: DocumentWithRelations;
  similarity: number; // 0-1
  relevantExcerpt?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  extension: string;
  lastModified: Date;
}

export interface DocumentStatistics {
  organizationId: string;
  totalDocuments: number;
  totalSize: number; // bytes
  totalFolders: number;
  documentsByType: Record<string, number>;
  documentsThisMonth: number;
  topTags: Array<{ tag: string; count: number }>;
  recentActivity: DocumentActivity[];
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class DocumentError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'DocumentError';
  }
}

export const DocumentErrorCodes = {
  NOT_FOUND: 'DOCUMENT_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  VERSION_LIMIT_REACHED: 'VERSION_LIMIT_REACHED',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  DOWNLOAD_FAILED: 'DOWNLOAD_FAILED',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  AI_PROCESSING_FAILED: 'AI_PROCESSING_FAILED',
  INVALID_SHARE: 'INVALID_SHARE',
  SHARE_EXPIRED: 'SHARE_EXPIRED',
} as const;
