import type { FileItem, FileUploadRequest, FileUploadResult } from '@/types/file';

/**
 * File Service
 * Handles file upload, download, delete operations with localStorage persistence
 *
 * NOTE: localStorage has a ~5-10MB limit per domain, so this implementation
 * is intended for demo purposes only. In production, use a proper file storage service.
 */

export const fileService = {
  /**
   * Get all files
   */
  async getFiles(folder?: string): Promise<FileItem[]> {
    const files = JSON.parse(localStorage.getItem('files') || '[]');

    // Filter by folder if specified
    if (folder) {
      return files.filter((f: FileItem) => f.folder === folder);
    }

    // Sort by uploadedAt descending (newest first)
    return files.sort(
      (a: FileItem, b: FileItem) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  },

  /**
   * Upload a file
   * Converts file to base64 and stores in localStorage
   * NOTE: localStorage has ~5-10MB limit, so this is for demo purposes only
   */
  async uploadFile(request: FileUploadRequest): Promise<FileUploadResult> {
    const { file, folder, tags } = request;

    // Validate file size (limit to 5MB for localStorage)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit. Please upload a smaller file.');
    }

    // Convert file to base64
    const content = await this.fileToBase64(file);

    const fileItem: FileItem = {
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      modifiedAt: new Date(file.lastModified).toISOString(),
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'current-user', // TODO: Get from auth context
      content,
      folder: folder || 'root',
      tags: tags || [],
    };

    // Save to localStorage
    const files = await this.getFiles();
    files.unshift(fileItem);
    localStorage.setItem('files', JSON.stringify(files));

    return {
      fileItem,
      success: true,
      message: `${file.name} uploaded successfully`,
    };
  },

  /**
   * Download a file
   * Converts base64 back to blob and triggers download
   */
  async downloadFile(fileId: string): Promise<void> {
    const files = await this.getFiles();
    const file = files.find((f) => f.id === fileId);

    if (!file) {
      throw new Error('File not found');
    }

    if (!file.content) {
      throw new Error('File content not available');
    }

    // Convert base64 to blob
    const blob = this.base64ToBlob(file.content, file.type);

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<void> {
    const files = await this.getFiles();
    const filtered = files.filter((f) => f.id !== fileId);
    localStorage.setItem('files', JSON.stringify(filtered));
  },

  /**
   * Delete multiple files
   */
  async deleteFiles(fileIds: string[]): Promise<void> {
    const files = await this.getFiles();
    const filtered = files.filter((f) => !fileIds.includes(f.id));
    localStorage.setItem('files', JSON.stringify(filtered));
  },

  /**
   * Get file by ID
   */
  async getFileById(fileId: string): Promise<FileItem | null> {
    const files = await this.getFiles();
    return files.find((f) => f.id === fileId) || null;
  },

  /**
   * Get total storage used (in bytes)
   */
  async getStorageUsed(): Promise<number> {
    const files = await this.getFiles();
    return files.reduce((total, file) => total + file.size, 0);
  },

  /**
   * Helper: Convert File to base64
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  },

  /**
   * Helper: Convert base64 to Blob
   */
  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  },
};
