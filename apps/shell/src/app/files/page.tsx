'use client';

import { useState, useEffect, useRef } from 'react';
import {
  GlowButton,
} from '@/components/glow-ui';
import { fileService } from '@/services/fileService';
import {
  formatBytes,
  formatRelativeTime,
  getFileIcon,
  getFileTypeDescription
} from '@/lib/utils';
import type { FileItem } from '@/types/file';
import {
  Upload,
  Download,
  Trash2,
} from 'lucide-react';

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [statusMessage, setStatusMessage] = useState<string>('');
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
    setStatusMessage('Uploading file...');

    try {
      const result = await fileService.uploadFile({ file: selectedFile });

      if (result.success) {
        // Add to local state
        setFiles((prev) => [result.fileItem, ...prev]);
        setStatusMessage(`${selectedFile.name} uploaded successfully`);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      setStatusMessage(errorMessage);
    } finally {
      setIsLoading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setStatusMessage(`Downloading ${file.name}...`);

    try {
      await fileService.downloadFile(fileId);
      setStatusMessage(`${file.name} downloaded successfully`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download file';
      setError(errorMessage);
      setStatusMessage(errorMessage);
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
    setStatusMessage(`Deleting ${file.name}...`);

    try {
      await fileService.deleteFile(fileId);
      // Update local state
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setStatusMessage(`${file.name} deleted successfully`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      setError(errorMessage);
      setStatusMessage(errorMessage);
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
    setStatusMessage(`Deleting ${selectedFiles.size} files...`);

    try {
      await fileService.deleteFiles(Array.from(selectedFiles));
      // Update local state
      setFiles((prev) => prev.filter((f) => !selectedFiles.has(f.id)));
      setSelectedFiles(new Set());
      setStatusMessage(`${selectedFiles.size} files deleted successfully`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete files';
      setError(errorMessage);
      setStatusMessage(errorMessage);
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
    if (selectedFiles.size === files.length && files.length > 0) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map((f) => f.id)));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-vision-gray-950 text-3xl font-bold">Files</h1>
          <p className="text-vision-gray-700 mt-1">
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
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedFiles.size})
            </GlowButton>
          )}

          <GlowButton
            onClick={handleUploadClick}
            disabled={isLoading}
            aria-label="Upload file"
          >
            <Upload className="w-4 h-4 mr-2" />
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

      {/* Status and Error Messages */}
      <div aria-live="polite" aria-atomic="true" className="mb-4">
        {error && (
          <div className="bg-vision-red-50 border border-vision-red-600 text-vision-red-900 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {statusMessage && !error && (
          <div className="sr-only">
            {statusMessage}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-vision-gray-300 overflow-hidden shadow-sm">
        <table className="min-w-full">
          <caption className="sr-only">
            List of uploaded files with name, size, modified date, and available actions
          </caption>
          <thead className="bg-vision-gray-50 border-b border-vision-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={files.length > 0 && selectedFiles.size === files.length}
                  onChange={toggleSelectAll}
                  aria-label="Select all files"
                  className="rounded border-vision-gray-300 text-vision-blue-700 focus:ring-vision-blue-700"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-vision-gray-700">
                File Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-vision-gray-700">
                Size
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-vision-gray-700">
                Modified
              </th>
              <th scope="col" className="px-6 py-3 text-right text-sm font-medium text-vision-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-vision-gray-300">
            {files.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div role="status" aria-live="polite">
                    <p className="text-vision-gray-700">
                      No files uploaded yet. Click &quot;Upload File&quot; to get started.
                    </p>
                  </div>
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
                      className="rounded border-vision-gray-300 text-vision-blue-700 focus:ring-vision-blue-700"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">
                        {getFileIcon(file.type)}
                      </span>
                      <span className="sr-only">{getFileTypeDescription(file.type)}</span>
                      <span className="text-sm font-medium text-vision-gray-950">
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-vision-gray-700">
                    {formatBytes(file.size)}
                  </td>
                  <td className="px-6 py-4 text-sm text-vision-gray-700">
                    {formatRelativeTime(file.modifiedAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <GlowButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file.id)}
                        disabled={isLoading}
                        aria-label={`Download ${file.name}`}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </GlowButton>

                      <GlowButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        disabled={isLoading}
                        aria-label={`Delete ${file.name}`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </GlowButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Loading state announcement for screen readers */}
      {isLoading && (
        <div className="sr-only" aria-live="assertive" aria-atomic="true">
          Processing file operation...
        </div>
      )}
    </div>
  );
}
