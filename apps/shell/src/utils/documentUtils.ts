/**
 * Document Utility Functions
 * 
 * Helper functions for file manipulation, formatting, and document operations.
 */

import type { FileMetadata } from '@/types/document';

// ============================================================================
// FILE SIZE FORMATTING
// ============================================================================

/**
 * Format file size from bytes to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Convert file size string back to bytes
 */
export function parseSizeToBytes(sizeStr: string): number {
  const match = sizeStr.match(/^([\d.]+)\s*(Bytes|KB|MB|GB|TB)$/i);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  const multipliers: Record<string, number> = {
    BYTES: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };

  return value * (multipliers[unit] || 1);
}

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Format date to relative time string
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}

/**
 * Format date to standard format
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options || {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ============================================================================
// FILE TYPE & ICON DETECTION
// ============================================================================

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Get file icon emoji based on MIME type or extension
 */
export function getFileIcon(mimeType: string, extension?: string): string {
  // Check MIME type first
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  
  // Check specific MIME types
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📈';
  if (mimeType.includes('zip') || mimeType.includes('archive') || mimeType.includes('compressed')) return '📦';
  if (mimeType.includes('text')) return '📃';
  
  // Check extension as fallback
  if (extension) {
    const ext = extension.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) return '🖼️';
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) return '🎥';
    if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(ext)) return '🎵';
    if (ext === 'pdf') return '📄';
    if (['doc', 'docx', 'odt'].includes(ext)) return '📝';
    if (['xls', 'xlsx', 'ods', 'csv'].includes(ext)) return '📊';
    if (['ppt', 'pptx', 'odp'].includes(ext)) return '📈';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return '📦';
    if (['txt', 'md', 'log'].includes(ext)) return '📃';
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'css', 'html'].includes(ext)) return '💻';
  }
  
  return '📄'; // Default file icon
}

/**
 * Get file type description for screen readers
 */
export function getFileTypeDescription(mimeType: string, extension?: string): string {
  if (mimeType.startsWith('image/')) return 'Image file';
  if (mimeType.startsWith('video/')) return 'Video file';
  if (mimeType.startsWith('audio/')) return 'Audio file';
  if (mimeType.includes('pdf')) return 'PDF document';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'Word document';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'Spreadsheet';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentation';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'Archive file';
  if (mimeType.includes('text')) return 'Text file';
  
  if (extension) {
    const ext = extension.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return `${ext.toUpperCase()} image`;
    if (['mp4', 'avi', 'mov'].includes(ext)) return `${ext.toUpperCase()} video`;
    if (['mp3', 'wav'].includes(ext)) return `${ext.toUpperCase()} audio`;
  }
  
  return 'File';
}

/**
 * Get file category from MIME type
 */
export function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'Images';
  if (mimeType.startsWith('video/')) return 'Videos';
  if (mimeType.startsWith('audio/')) return 'Audio';
  if (mimeType.includes('pdf')) return 'PDFs';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'Documents';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'Spreadsheets';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentations';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'Archives';
  if (mimeType.includes('text')) return 'Text Files';
  return 'Other';
}

// ============================================================================
// FILE VALIDATION
// ============================================================================

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

/**
 * Validate file size
 */
export function validateFileSize(fileSize: number, maxSize: number = MAX_FILE_SIZE): {
  valid: boolean;
  error?: string;
} {
  if (fileSize > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${formatFileSize(maxSize)}. Current size: ${formatFileSize(fileSize)}`,
    };
  }
  return { valid: true };
}

/**
 * Validate file name
 */
export function validateFileName(fileName: string): {
  valid: boolean;
  error?: string;
} {
  if (!fileName || fileName.trim().length === 0) {
    return { valid: false, error: 'File name cannot be empty' };
  }
  
  if (fileName.length > 255) {
    return { valid: false, error: 'File name is too long (max 255 characters)' };
  }
  
  // Check for invalid characters
  const invalidChars = /[<>:"|?*\x00-\x1F]/g;
  if (invalidChars.test(fileName)) {
    return { valid: false, error: 'File name contains invalid characters' };
  }
  
  return { valid: true };
}

/**
 * Extract file metadata from File object
 */
export function extractFileMetadata(file: File): FileMetadata {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    extension: getFileExtension(file.name),
    lastModified: new Date(file.lastModified),
  };
}

// ============================================================================
// FILE PATH & STORAGE
// ============================================================================

/**
 * Generate storage path for document
 * Format: {organizationId}/{folderId}/{timestamp}_{random}.{extension}
 */
export function generateStoragePath(
  organizationId: string,
  fileName: string,
  folderId?: string
): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = getFileExtension(fileName);
  
  const folderPath = folderId ? `${folderId}` : 'root';
  return `${organizationId}/${folderPath}/${timestamp}_${randomString}.${extension}`;
}

/**
 * Generate version storage path
 * Format: {organizationId}/{folderId}/{docId}/versions/v{version}.{extension}
 */
export function generateVersionPath(
  organizationId: string,
  documentId: string,
  versionNumber: number,
  fileName: string,
  folderId?: string
): string {
  const extension = getFileExtension(fileName);
  const folderPath = folderId ? `${folderId}` : 'root';
  return `${organizationId}/${folderPath}/${documentId}/versions/v${versionNumber}.${extension}`;
}

/**
 * Sanitize file name for storage
 */
export function sanitizeFileName(fileName: string): string {
  // Replace invalid characters with underscores
  let sanitized = fileName.replace(/[<>:"|?*\x00-\x1F]/g, '_');
  
  // Remove multiple consecutive underscores
  sanitized = sanitized.replace(/_+/g, '_');
  
  // Trim underscores from start and end
  sanitized = sanitized.replace(/^_+|_+$/g, '');
  
  // Ensure it's not empty
  if (sanitized.length === 0) {
    sanitized = 'unnamed_file';
  }
  
  return sanitized;
}

// ============================================================================
// MIME TYPE UTILITIES
// ============================================================================

/**
 * Get MIME type from file extension
 */
export function getMimeTypeFromExtension(extension: string): string {
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    ico: 'image/x-icon',
    
    // Videos
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    wmv: 'video/x-ms-wmv',
    flv: 'video/x-flv',
    webm: 'video/webm',
    
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    flac: 'audio/flac',
    aac: 'audio/aac',
    
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    odt: 'application/vnd.oasis.opendocument.text',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    odp: 'application/vnd.oasis.opendocument.presentation',
    
    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    
    // Text
    txt: 'text/plain',
    md: 'text/markdown',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    xml: 'application/xml',
    csv: 'text/csv',
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}

/**
 * Check if file type can be previewed in browser
 */
export function canPreviewInBrowser(mimeType: string): boolean {
  const previewable = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'text/plain',
    'text/html',
    'text/css',
    'text/javascript',
    'application/json',
    'text/markdown',
    'video/mp4',
    'video/webm',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
  ];
  
  return previewable.includes(mimeType) || mimeType.startsWith('text/');
}

/**
 * Check if file is an image
 */
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Check if file is a video
 */
export function isVideo(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

/**
 * Check if file is audio
 */
export function isAudio(mimeType: string): boolean {
  return mimeType.startsWith('audio/');
}

/**
 * Check if file is a document
 */
export function isDocument(mimeType: string): boolean {
  return mimeType.includes('document') || 
         mimeType.includes('word') || 
         mimeType.includes('pdf') ||
         mimeType.includes('spreadsheet') ||
         mimeType.includes('presentation');
}

// ============================================================================
// SEARCH & FILTER UTILITIES
// ============================================================================

/**
 * Highlight search term in text
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Extract excerpt around search term
 */
export function extractExcerpt(text: string, searchTerm: string, maxLength: number = 200): string {
  if (!searchTerm || !text) return text.slice(0, maxLength) + '...';
  
  const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
  if (index === -1) return text.slice(0, maxLength) + '...';
  
  const start = Math.max(0, index - Math.floor(maxLength / 2));
  const end = Math.min(text.length, start + maxLength);
  
  let excerpt = text.slice(start, end);
  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';
  
  return excerpt;
}

// ============================================================================
// TAG UTILITIES
// ============================================================================

/**
 * Normalize tag (lowercase, trim, replace spaces with hyphens)
 */
export function normalizeTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Parse tag string into array
 */
export function parseTags(tagString: string): string[] {
  return tagString
    .split(/[,;]/)
    .map(tag => normalizeTag(tag))
    .filter(tag => tag.length > 0);
}

/**
 * Format tags for display
 */
export function formatTags(tags: string[]): string {
  return tags.join(', ');
}

// ============================================================================
// PERMISSION UTILITIES
// ============================================================================

/**
 * Check if permission level is sufficient
 */
export function hasPermission(
  userPermission: 'view' | 'edit' | 'admin',
  requiredPermission: 'view' | 'edit' | 'admin'
): boolean {
  const levels = { view: 1, edit: 2, admin: 3 };
  return levels[userPermission] >= levels[requiredPermission];
}

/**
 * Get permission label
 */
export function getPermissionLabel(permission: 'view' | 'edit' | 'admin'): string {
  const labels = {
    view: 'Can view',
    edit: 'Can edit',
    admin: 'Full access',
  };
  return labels[permission];
}
