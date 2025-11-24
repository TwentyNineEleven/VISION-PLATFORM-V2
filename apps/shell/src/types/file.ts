/**
 * File Management Types
 * Type definitions for file upload, download, and management
 */

export interface FileItem {
  id: string;
  name: string;
  size: number; // in bytes
  type: string; // MIME type
  modifiedAt: string; // ISO timestamp
  uploadedAt: string; // ISO timestamp
  uploadedBy: string; // User ID
  content?: string; // Base64 encoded content for localStorage
  url?: string; // Public URL (if hosted externally)
  tags?: string[];
  folder?: string;
}

export interface FileUploadRequest {
  file: File;
  folder?: string;
  tags?: string[];
}

export interface FileUploadResult {
  fileItem: FileItem;
  success: boolean;
  message?: string;
}
