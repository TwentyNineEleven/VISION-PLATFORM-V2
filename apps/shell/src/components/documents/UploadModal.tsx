/**
 * UploadModal Component
 * 
 * Modal for uploading documents with drag-and-drop support
 */

'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { X, Upload, File, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  folderId?: string | null;
  onUploadComplete?: () => void;
}

interface FileUpload {
  file: File;
  name: string;
  tags: string[];
  description: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export default function UploadModal({
  isOpen,
  onClose,
  organizationId,
  folderId,
  onUploadComplete,
}: UploadModalProps) {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const fileUploads: FileUpload[] = newFiles.map((file) => ({
      file,
      name: file.name,
      tags: [],
      description: '',
      status: 'pending',
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...fileUploads]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFileName = (index: number, name: string) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, name } : f))
    );
  };

  const updateFileDescription = (index: number, description: string) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, description } : f))
    );
  };

  const addTag = (index: number, tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;

    setFiles((prev) =>
      prev.map((f, i) =>
        i === index && !f.tags.includes(trimmedTag)
          ? { ...f, tags: [...f.tags, trimmedTag] }
          : f
      )
    );
  };

  const removeTag = (index: number, tagToRemove: string) => {
    setFiles((prev) =>
      prev.map((f, i) =>
        i === index
          ? { ...f, tags: f.tags.filter((t) => t !== tagToRemove) }
          : f
      )
    );
  };

  const uploadFile = async (fileUpload: FileUpload, index: number) => {
    try {
      // Update status to uploading
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: 'uploading' as const, progress: 0 } : f
        )
      );

      // Create form data
      const formData = new FormData();
      formData.append('file', fileUpload.file);
      formData.append('organizationId', organizationId);
      if (folderId) {
        formData.append('folderId', folderId);
      }
      formData.append('name', fileUpload.name);
      if (fileUpload.description) {
        formData.append('description', fileUpload.description);
      }
      if (fileUpload.tags.length > 0) {
        formData.append('tags', JSON.stringify(fileUpload.tags));
      }

      // Upload file
      const response = await fetch('/api/v1/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      // Update status to success
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: 'success' as const, progress: 100 }
            : f
        )
      );
    } catch (error) {
      // Update status to error
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: 'error' as const,
                error: error instanceof Error ? error.message : 'Upload failed',
              }
            : f
        )
      );
    }
  };

  const handleUploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    
    // Upload all files sequentially
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending') {
        await uploadFile(files[i], i);
      }
    }

    // Check if all uploads succeeded
    const allSuccess = files.every((f) => f.status === 'success');
    if (allSuccess && onUploadComplete) {
      onUploadComplete();
      // Close modal after brief delay
      setTimeout(() => {
        onClose();
        setFiles([]);
      }, 1000);
    }
  };

  const canUpload = files.length > 0 && files.some((f) => f.status === 'pending');
  const isUploading = files.some((f) => f.status === 'uploading');
  const allComplete = files.length > 0 && files.every((f) => f.status !== 'pending');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload Documents</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {files.length === 0 ? (
            /* Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Upload documents up to 15MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            /* File List */
            <div className="space-y-4">
              {files.map((fileUpload, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded">
                        <File className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        {fileUpload.status === 'pending' ? (
                          <input
                            type="text"
                            value={fileUpload.name}
                            onChange={(e) => updateFileName(index, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Document name"
                          />
                        ) : (
                          <p className="font-medium text-gray-900">
                            {fileUpload.name}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    {/* Status Icon */}
                    <div className="flex items-center gap-2">
                      {fileUpload.status === 'uploading' && (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      )}
                      {fileUpload.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {fileUpload.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      {fileUpload.status === 'pending' && (
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {fileUpload.status === 'pending' && (
                    <>
                      {/* Description */}
                      <textarea
                        value={fileUpload.description}
                        onChange={(e) =>
                          updateFileDescription(index, e.target.value)
                        }
                        placeholder="Description (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                      />

                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags (optional)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {fileUpload.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                            >
                              {tag}
                              <button
                                onClick={() => removeTag(index, tag)}
                                className="hover:text-blue-900"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag(index, currentTag);
                                setCurrentTag('');
                              }
                            }}
                            placeholder="Add tag and press Enter"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Error Message */}
                  {fileUpload.status === 'error' && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                      {fileUpload.error}
                    </div>
                  )}

                  {/* Success Message */}
                  {fileUpload.status === 'success' && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-600">
                      Upload successful!
                    </div>
                  )}

                  {/* Progress Bar */}
                  {fileUpload.status === 'uploading' && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${fileUpload.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add More Files Button */}
              {!isUploading && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                >
                  + Add more files
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            {files.length} {files.length === 1 ? 'file' : 'files'} selected
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              {allComplete ? 'Close' : 'Cancel'}
            </button>
            <button
              onClick={handleUploadAll}
              disabled={!canUpload || isUploading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload {files.length > 0 && `(${files.length})`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
