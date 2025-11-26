# AGENT START PROMPT: PAGE 8 - FILES (`/files`)

## EXECUTIVE SUMMARY

You are tasked with remediating **Page 8: Files** (`/files`) as part of the VISION Platform V2 remediation project.

**Key Details:**
- **File:** `apps/shell/src/app/files/page.tsx`
- **Priority:** P0 - Critical
- **Total Effort:** 8 hours
- **Execution Timeline:** Week 2-5

**Issues to Fix:**
- 6 Tailwind gray colors → Bold Color System tokens
- Missing table caption and file status labels (accessibility)
- Non-functional upload/download/delete CTAs

**Agents Involved:**
1. **Agent 001** (Color Compliance) - Week 2 Tuesday - 3 hours
2. **Agent 004** (CTA Functionality) - Week 4 - 3 hours
3. **Agent 003** (Accessibility) - Week 5 - 2 hours

**Success Criteria:**
- ✅ All 6 Tailwind gray colors replaced with Bold Color System tokens
- ✅ Table has proper caption for accessibility
- ✅ File status labels accessible
- ✅ Upload functionality working
- ✅ Download functionality working
- ✅ Delete functionality working
- ✅ Files persist in localStorage
- ✅ Type-check passes
- ✅ Tests pass with ≥85% coverage
- ✅ Build succeeds

---

## PRE-WORK: REQUIRED READING

Before starting, review these documents in order:

### 1. Master Plan
**File:** `documentation/platform/COMPLETE_PLATFORM_SHELL_MASTER_PLAN.md`
- Read the full Page 8 section
- Understand all issues and priorities
- Note the agent assignments and timeline

### 2. Your Agent-Specific Prompt
**Determine which agent you are:**
- **Agent 001 (Colors)?** Read `AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md`
- **Agent 003 (Accessibility)?** Read `AGENT_PROMPT_ACCESSIBILITY_ENHANCEMENT_SPECIALIST.md`
- **Agent 004 (CTAs)?** Read `AGENT_PROMPT_CTA_FUNCTIONALITY_SPECIALIST.md`

### 3. Execution Guide
**File:** `documentation/platform/AGENT_EXECUTION_GUIDE.md`
- Review conflict prevention matrix
- Understand handoff procedures
- Check scheduling requirements

### 4. Remediation Plan
**File:** `documentation/platform/VISION_PLATFORM_REMEDIATION_EXECUTION_PLAN.md`
- Review the 7-week roadmap
- Understand the 18-step workflow
- Review pre-merge quality gate (8 checks)

---

## DETAILED ISSUE BREAKDOWN

### ISSUE 1: COLOR VIOLATIONS - TAILWIND GRAYS (Week 2 Tuesday - 3 hours)

**Agent:** 001 (Color Compliance Specialist)

**Assignment:** Replace 6 Tailwind gray-* colors with Bold Color System tokens

**Current Violations:**
```typescript
// ❌ BEFORE - Tailwind gray colors
<table className="min-w-full">
  <thead className="bg-gray-50 border-gray-200">
    <tr>
      <th className="text-gray-900">File Name</th>
      <th className="text-gray-700">Size</th>
      <th className="text-gray-700">Modified</th>
      <th className="text-gray-700">Actions</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    <tr className="hover:bg-gray-50">
      <td className="text-gray-900">document.pdf</td>
      <td className="text-gray-600">2.4 MB</td>
      <td className="text-gray-600">2 hours ago</td>
      <td>
        <button className="text-blue-600 hover:text-blue-700">
          Download
        </button>
      </td>
    </tr>
  </tbody>
</table>
```

**Expected Fix:**
```typescript
// ✅ AFTER - Bold Color System tokens
<table className="min-w-full">
  <thead className="bg-vision-surface-secondary border-vision-border-default">
    <tr>
      <th className="text-vision-text-primary">File Name</th>
      <th className="text-vision-text-secondary">Size</th>
      <th className="text-vision-text-secondary">Modified</th>
      <th className="text-vision-text-secondary">Actions</th>
    </tr>
  </thead>
  <tbody className="bg-vision-surface-primary divide-y divide-vision-border-subtle">
    <tr className="hover:bg-vision-blue-50">
      <td className="text-vision-text-primary">document.pdf</td>
      <td className="text-vision-text-secondary">2.4 MB</td>
      <td className="text-vision-text-secondary">2 hours ago</td>
      <td>
        <button className="text-vision-blue-600 hover:text-vision-blue-700">
          Download
        </button>
      </td>
    </tr>
  </tbody>
</table>
```

**Bold Color System v3.0 Tokens to Use:**

**Backgrounds:**
- `bg-vision-surface-primary` - Main content background (replaces `bg-white`)
- `bg-vision-surface-secondary` - Table header background (replaces `bg-gray-50`)
- `bg-vision-blue-50` - Hover state for rows (replaces `hover:bg-gray-50`)

**Text:**
- `text-vision-text-primary` - Primary text, file names (replaces `text-gray-900`)
- `text-vision-text-secondary` - Secondary text, metadata (replaces `text-gray-600`, `text-gray-700`)
- `text-vision-blue-600` - Interactive text, links
- `hover:text-vision-blue-700` - Hover state for links

**Borders:**
- `border-vision-border-default` - Table borders (replaces `border-gray-200`)
- `divide-vision-border-subtle` - Row dividers (replaces `divide-gray-200`)

**Interactive States:**
- `hover:bg-vision-blue-50` - Row hover
- `focus-visible:ring-vision-blue-500` - Focus rings

**Validation Commands:**
```bash
# Run color validation
pnpm validate:colors

# Expected output: 0 violations in apps/shell/src/app/files/page.tsx

# Run type-check
pnpm type-check

# Run tests
pnpm test apps/shell/src/app/files/page.test.tsx
```

**Success Criteria:**
- ✅ All 6 Tailwind gray colors replaced
- ✅ No gray-* classes remain
- ✅ Only Bold Color System tokens used
- ✅ Color validation script passes
- ✅ Visual consistency maintained

---

### ISSUE 2: FILE OPERATIONS - UPLOAD/DOWNLOAD/DELETE (Week 4 - 3 hours)

**Agent:** 004 (CTA Functionality Specialist)

**Assignment:** Implement upload, download, and delete functionality with localStorage persistence

#### Step 1: Create Types
**File:** `apps/shell/src/types/file.ts`

```typescript
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
```

#### Step 2: Create File Service
**File:** `apps/shell/src/services/fileService.ts`

```typescript
import type { FileItem, FileUploadRequest, FileUploadResult } from '@/types/file';

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
  private fileToBase64(file: File): Promise<string> {
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
  private base64ToBlob(base64: string, contentType: string): Blob {
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
```

#### Step 3: Create Helper Functions
**File:** `apps/shell/src/utils/fileUtils.ts`

```typescript
/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format date to relative time
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}

/**
 * Get file icon based on MIME type
 */
export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📈';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦';
  return '📄';
}
```

#### Step 4: Update Component
**File:** `apps/shell/src/app/files/page.tsx`

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { GlowButton } from '@vision/design-system';
import { fileService } from '@/services/fileService';
import { formatFileSize, formatRelativeTime, getFileIcon } from '@/utils/fileUtils';
import type { FileItem } from '@/types/file';
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await fileService.getFiles();
      setFiles(data);
    } catch (err) {
      setError('Failed to load files');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fileService.uploadFile({ file: selectedFile });

      if (result.success) {
        // Add to local state
        setFiles((prev) => [result.fileItem, ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsLoading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = async (fileId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await fileService.downloadFile(fileId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    if (!confirm(`Delete "${file.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await fileService.deleteFile(fileId);
      // Update local state
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;

    if (
      !confirm(
        `Delete ${selectedFiles.size} selected file(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await fileService.deleteFiles(Array.from(selectedFiles));
      // Update local state
      setFiles((prev) => prev.filter((f) => !selectedFiles.has(f.id)));
      setSelectedFiles(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete files');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map((f) => f.id)));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-vision-text-primary text-3xl font-bold">Files</h1>
          <p className="text-vision-text-secondary mt-1">
            {files.length} file{files.length !== 1 ? 's' : ''} total
          </p>
        </div>

        <div className="flex gap-2">
          {selectedFiles.size > 0 && (
            <GlowButton
              variant="ghost"
              onClick={handleDeleteSelected}
              disabled={isLoading}
              aria-label={`Delete ${selectedFiles.size} selected files`}
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete Selected ({selectedFiles.size})
            </GlowButton>
          )}

          <GlowButton
            onClick={handleUploadClick}
            disabled={isLoading}
            aria-label="Upload file"
          >
            <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
            Upload File
          </GlowButton>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            aria-label="File input"
          />
        </div>
      </div>

      {error && (
        <div className="bg-vision-error-50 border border-vision-error-200 text-vision-error-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-vision-surface-primary rounded-lg border border-vision-border-default overflow-hidden">
        <table className="min-w-full">
          <caption className="sr-only">
            List of uploaded files with name, size, modified date, and available actions
          </caption>
          <thead className="bg-vision-surface-secondary border-b border-vision-border-default">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={files.length > 0 && selectedFiles.size === files.length}
                  onChange={toggleSelectAll}
                  aria-label="Select all files"
                  className="rounded border-vision-border-default"
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-vision-text-secondary">
                File Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-vision-text-secondary">
                Size
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-vision-text-secondary">
                Modified
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-vision-text-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-vision-surface-primary divide-y divide-vision-border-subtle">
            {files.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-vision-text-secondary">
                    No files uploaded yet. Click "Upload File" to get started.
                  </p>
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-vision-blue-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                      aria-label={`Select ${file.name}`}
                      className="rounded border-vision-border-default"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl" aria-hidden="true">
                        {getFileIcon(file.type)}
                      </span>
                      <span className="text-sm font-medium text-vision-text-primary">
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-vision-text-secondary">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="px-6 py-4 text-sm text-vision-text-secondary">
                    {formatRelativeTime(file.modifiedAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <GlowButton
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(file.id)}
                        disabled={isLoading}
                        aria-label={`Download ${file.name}`}
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </GlowButton>

                      <GlowButton
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(file.id)}
                        disabled={isLoading}
                        aria-label={`Delete ${file.name}`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </GlowButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**Validation Commands:**
```bash
# Type-check
pnpm type-check

# Run tests
pnpm test apps/shell/src/app/files/page.test.tsx

# Test in browser
pnpm dev
# Navigate to /files and test all actions
```

**Success Criteria:**
- ✅ Upload functionality works
- ✅ Download functionality works
- ✅ Delete functionality works (individual and bulk)
- ✅ Files persist in localStorage
- ✅ File selection works
- ✅ Select all works
- ✅ Error handling works
- ✅ Loading states work
- ✅ Proper user feedback (confirmation dialogs)

---

### ISSUE 3: ACCESSIBILITY - TABLE CAPTION & STATUS LABELS (Week 5 - 2 hours)

**Agent:** 003 (Accessibility Enhancement Specialist)

**Assignment:** Add table caption and ensure file status labels are accessible

**Current Problem:**
```typescript
// ❌ BEFORE - No table caption
<table className="min-w-full">
  <thead>
    <tr>
      <th>File Name</th>
      <th>Size</th>
      <th>Modified</th>
      <th>Actions</th>
    </tr>
  </thead>
</table>
```

**Expected Fix:**
```typescript
// ✅ AFTER - Table caption for screen readers
<table className="min-w-full">
  <caption className="sr-only">
    List of uploaded files with name, size, modified date, and available actions
  </caption>
  <thead>
    <tr>
      <th scope="col">File Name</th>
      <th scope="col">Size</th>
      <th scope="col">Modified</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
</table>
```

**Accessibility Checklist:**

1. **Table Structure:**
   - ✅ Table has `<caption>` (can be sr-only)
   - ✅ All `<th>` elements have `scope="col"` or `scope="row"`
   - ✅ Table headers properly associated with data cells

2. **Icon Buttons:**
   - ✅ All icon buttons have descriptive aria-label
   - ✅ Labels include file name for context
   - ✅ Icons have aria-hidden="true"

3. **File Status:**
   - ✅ File icons have sr-only description
   - ✅ Empty state message is accessible
   - ✅ Loading states announced to screen readers

4. **Checkboxes:**
   - ✅ All checkboxes have aria-label
   - ✅ "Select all" checkbox has clear label
   - ✅ Individual checkboxes include file name in label

5. **Keyboard Navigation:**
   - ✅ All interactive elements accessible via Tab
   - ✅ Enter/Space trigger actions
   - ✅ Focus visible on all elements
   - ✅ Logical tab order maintained

**Additional Enhancements:**

```typescript
// Add sr-only file type descriptions
<div className="flex items-center gap-2">
  <span className="text-2xl" aria-hidden="true">
    {getFileIcon(file.type)}
  </span>
  <span className="sr-only">{getFileTypeDescription(file.type)}</span>
  <span className="text-sm font-medium text-vision-text-primary">
    {file.name}
  </span>
</div>

// Helper function
function getFileTypeDescription(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'Image file';
  if (mimeType.startsWith('video/')) return 'Video file';
  if (mimeType.startsWith('audio/')) return 'Audio file';
  if (mimeType.includes('pdf')) return 'PDF document';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'Word document';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'Spreadsheet';
  if (mimeType.includes('presentation')) return 'Presentation';
  return 'File';
}

// Add live region for status updates
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {isLoading && 'Processing file operation...'}
  {error && error}
</div>

// Improve empty state accessibility
{files.length === 0 && (
  <tr>
    <td colSpan={5} className="px-6 py-12 text-center" role="cell">
      <div role="status" aria-live="polite">
        <p className="text-vision-text-secondary">
          No files uploaded yet. Click "Upload File" to get started.
        </p>
      </div>
    </td>
  </tr>
)}
```

**Validation Commands:**
```bash
# Run accessibility tests
pnpm test apps/shell/src/app/files/page.test.tsx

# Manual testing:
# 1. Tab through all interactive elements
# 2. Verify focus indicators visible
# 3. Test with screen reader (VoiceOver/NVDA)
# 4. Verify table structure with screen reader
# 5. Test keyboard-only file operations
```

**Success Criteria:**
- ✅ Table has caption
- ✅ All th elements have scope attribute
- ✅ All icon buttons have aria-label
- ✅ All checkboxes have aria-label
- ✅ File type icons have sr-only descriptions
- ✅ Keyboard navigation works
- ✅ Screen reader support complete
- ✅ WCAG 2.1 AA compliant
- ✅ No axe violations

---

## EXECUTION WORKFLOW

Follow these steps in order:

### Step 1: Setup
```bash
# Ensure you're on the correct branch
git checkout main
git pull origin main

# Create feature branch based on your agent
# Agent 001 (Colors):
git checkout -b fix/colors-page-8-files

# Agent 003 (Accessibility):
git checkout -b fix/a11y-page-8-files

# Agent 004 (CTAs):
git checkout -b fix/ctas-page-8-files

# Install dependencies
pnpm install
```

### Step 2: Identify Your Role
Determine which agent you are and what work you need to do:
- **Agent 001?** Fix 6 Tailwind gray colors (Week 2 Tuesday - 3 hours)
- **Agent 004?** Implement file operations (Week 4 - 3 hours)
- **Agent 003?** Fix accessibility (Week 5 - 2 hours)

### Step 3: Read Your Specific Agent Prompt
Go to your agent-specific documentation:
- Agent 001: `AGENT_PROMPT_COLOR_COMPLIANCE_SPECIALIST.md`
- Agent 003: `AGENT_PROMPT_ACCESSIBILITY_ENHANCEMENT_SPECIALIST.md`
- Agent 004: `AGENT_PROMPT_CTA_FUNCTIONALITY_SPECIALIST.md`

Follow the exact workflow described in your agent prompt.

### Step 4: Make Changes
- Edit the files as specified in your section above
- Follow the code examples provided
- Ensure you're using Bold Color System tokens (Agent 001)
- Ensure proper service layer pattern (Agent 004)
- Ensure WCAG 2.1 AA compliance (Agent 003)

### Step 5: Run Validation
```bash
# Type-check
pnpm type-check

# Linting
pnpm lint

# Color validation (if Agent 001)
pnpm validate:colors

# Component validation
pnpm validate:components

# Run tests
pnpm test apps/shell/src/app/files/page.test.tsx

# Build
pnpm build
```

### Step 6: Manual Testing
```bash
# Start dev server
pnpm dev

# Test in browser:
# 1. Navigate to /files
# 2. Verify colors (Agent 001)
# 3. Test upload/download/delete (Agent 004)
# 4. Test keyboard navigation (Agent 003)
# 5. Test with screen reader if applicable
```

### Step 7: Create PR
```bash
# Stage changes
git add apps/shell/src/app/files/page.tsx
git add apps/shell/src/services/fileService.ts  # If Agent 004
git add apps/shell/src/types/file.ts  # If Agent 004
git add apps/shell/src/utils/fileUtils.ts  # If Agent 004

# Commit with descriptive message
git commit -m "fix(page-8): [Your agent's work]

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Addresses Page 8 (Files) remediation
Agent: [Your agent number]
Effort: [X] hours

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push branch
git push origin [your-branch-name]

# Create PR
gh pr create --title "fix(page-8): [Your agent's work]" --body "## Summary
[Describe changes]

## Testing
- [x] Type-check passes
- [x] Tests pass (≥85% coverage)
- [x] Build succeeds
- [x] Manual testing complete

## Agent
Agent [Your number]: [Your specialization]

Fixes Page 8 (Files) issues"
```

---

## SUCCESS CRITERIA

Before marking Page 8 complete, verify:

### Agent 001 (Colors):
- ✅ All 6 Tailwind gray colors replaced
- ✅ Only Bold Color System tokens used
- ✅ `pnpm validate:colors` passes

### Agent 004 (CTAs):
- ✅ File service created
- ✅ Upload works
- ✅ Download works
- ✅ Delete works (individual and bulk)
- ✅ Files persist in localStorage
- ✅ File selection works
- ✅ Helper utilities created

### Agent 003 (Accessibility):
- ✅ Table has caption
- ✅ All th elements have scope
- ✅ All icon buttons have aria-label
- ✅ All checkboxes have aria-label
- ✅ File icons have sr-only descriptions
- ✅ Keyboard navigation works
- ✅ WCAG 2.1 AA compliant

### All Agents:
- ✅ `pnpm type-check` passes
- ✅ `pnpm lint` passes
- ✅ `pnpm test` passes (≥85% coverage)
- ✅ `pnpm build` succeeds
- ✅ PR created with proper documentation
- ✅ Manual testing complete

---

## QUICK REFERENCE

### Files to Work On
- `apps/shell/src/app/files/page.tsx` - Main page component
- `apps/shell/src/services/fileService.ts` - Service layer (Agent 004)
- `apps/shell/src/types/file.ts` - Type definitions (Agent 004)
- `apps/shell/src/utils/fileUtils.ts` - Helper utilities (Agent 004)
- `apps/shell/src/app/files/page.test.tsx` - Tests (Agent 006)

### Key Commands
```bash
pnpm type-check              # TypeScript validation
pnpm lint                    # ESLint
pnpm validate:colors         # Color compliance
pnpm validate:components     # Component compliance
pnpm test [file]             # Run tests
pnpm build                   # Production build
pnpm dev                     # Development server
```

### Design System References
- Bold Color System: `packages/design-system/src/tokens/colors.ts`
- Glow UI Components: `packages/design-system/src/components/`

---

## GETTING STARTED

1. Read the Pre-Work section (all 4 documents)
2. Create your feature branch
3. Identify your agent role
4. Read your agent-specific prompt
5. Make changes following the code examples above
6. Run all validation commands
7. Manual test in browser
8. Create PR with proper documentation

**Ready to start? Run:**
```bash
git checkout main && git pull origin main
git checkout -b fix/[your-agent]-page-8-files
pnpm install
```

Then proceed to your section above based on your agent role.
