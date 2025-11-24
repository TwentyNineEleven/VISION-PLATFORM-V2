/**
 * File upload utilities for Supabase Storage
 */

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Generate unique filename
 */
export function generateUniqueFileName(file: File, prefix?: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop();
  const baseName = prefix ? `${prefix}_` : '';
  return `${baseName}${timestamp}_${randomString}.${extension}`;
}

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Compress image file
 */
export function compressImage(
  file: File,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * Upload file to server
 */
export async function uploadFile(
  file: File,
  endpoint: string,
  options?: {
    onProgress?: (progress: number) => void;
    compress?: boolean;
    maxWidth?: number;
    maxHeight?: number;
  }
): Promise<{ url: string; path: string }> {
  let fileToUpload: File | Blob = file;

  // Compress image if requested
  if (options?.compress && file.type.startsWith('image/')) {
    const compressed = await compressImage(
      file,
      options.maxWidth,
      options.maxHeight
    );
    fileToUpload = new File([compressed], file.name, { type: file.type });
  }

  const formData = new FormData();
  formData.append('file', fileToUpload);

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Upload organization logo
 */
export async function uploadOrganizationLogo(
  file: File,
  organizationId: string,
  options?: {
    onProgress?: (progress: number) => void;
  }
): Promise<{ url: string; path: string }> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!validateFileType(file, allowedTypes)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, WebP, or SVG image.');
  }

  // Validate file size (5MB max)
  if (!validateFileSize(file, 5)) {
    throw new Error('File size must be less than 5MB.');
  }

  return uploadFile(
    file,
    `/api/v1/organizations/${organizationId}/upload-logo`,
    {
      ...options,
      compress: true,
      maxWidth: 512,
      maxHeight: 512,
    }
  );
}

/**
 * Delete file from storage
 */
export async function deleteFile(path: string, organizationId: string): Promise<void> {
  const response = await fetch(`/api/v1/organizations/${organizationId}/delete-file`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Delete failed');
  }
}
