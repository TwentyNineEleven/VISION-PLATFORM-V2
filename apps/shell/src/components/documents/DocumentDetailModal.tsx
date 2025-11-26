/**
 * DocumentDetailModal Component
 * 
 * Modal for viewing and managing document details
 */

'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Download,
  Edit2,
  Trash2,
  Save,
  Tag,
  Calendar,
  User,
  FileText,
  AlertCircle,
  Loader2,
  History,
} from 'lucide-react';

interface DocumentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  onUpdate?: () => void;
  onDelete?: () => void;
}

interface DocumentDetail {
  id: string;
  name: string;
  description: string | null;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  tags: string[];
  metadata: Record<string, any>;
  folderId: string | null;
  version: number;
  extractedText: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  folder?: {
    id: string;
    name: string;
  };
}

export default function DocumentDetailModal({
  isOpen,
  onClose,
  documentId,
  onUpdate,
  onDelete,
}: DocumentDetailModalProps) {
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit state
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (isOpen && documentId) {
      loadDocument();
    }
  }, [isOpen, documentId]);

  const loadDocument = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/documents/${documentId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to load document');
      }

      const doc = result.data;
      setDocument(doc);
      setEditName(doc.name);
      setEditDescription(doc.description || '');
      setEditTags(doc.tags || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!document) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/v1/documents/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          description: editDescription || null,
          tags: editTags,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update document');
      }

      setDocument(result.data);
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update document');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!document) return;

    setIsDownloading(true);
    try {
      const response = await fetch(`/api/v1/documents/${documentId}/download`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to get download URL');
      }

      // Open download URL in new tab
      window.open(result.data.downloadUrl, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download document');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!document) return;
    if (!confirm('Are you sure you want to delete this document?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/v1/documents/${documentId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete document');
      }

      if (onDelete) onDelete();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    } finally {
      setIsDeleting(false);
    }
  };

  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !editTags.includes(trimmedTag)) {
      setEditTags([...editTags, trimmedTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Document Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
              <p className="text-red-600 text-center">{error}</p>
              <button
                onClick={loadDocument}
                className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : document ? (
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-900">{document.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Add a description..."
                  />
                ) : (
                  <p className="text-gray-700">
                    {document.description || (
                      <span className="text-gray-400 italic">No description</span>
                    )}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(isEditing ? editTags : document.tags).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      {isEditing && (
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {!isEditing && document.tags.length === 0 && (
                    <span className="text-gray-400 italic text-sm">No tags</span>
                  )}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add tag and press Enter"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <FileText className="w-4 h-4" />
                    File Type
                  </div>
                  <p className="text-gray-900">{document.mimeType}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <FileText className="w-4 h-4" />
                    File Size
                  </div>
                  <p className="text-gray-900">{formatFileSize(document.fileSize)}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <History className="w-4 h-4" />
                    Version
                  </div>
                  <p className="text-gray-900">v{document.version}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <User className="w-4 h-4" />
                    Created By
                  </div>
                  <p className="text-gray-900">{document.createdBy}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    Created
                  </div>
                  <p className="text-gray-900">{formatDate(document.createdAt)}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    Modified
                  </div>
                  <p className="text-gray-900">{formatDate(document.updatedAt)}</p>
                </div>
              </div>

              {/* Folder */}
              {document.folder && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Folder</div>
                  <p className="text-gray-900">{document.folder.name}</p>
                </div>
              )}

              {/* Extracted Text Preview */}
              {document.extractedText && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extracted Text Preview
                  </label>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {document.extractedText.substring(0, 500)}
                      {document.extractedText.length > 500 && '...'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {document && !isLoading && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download
                  </>
                )}
              </button>

              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(document.name);
                      setEditDescription(document.description || '');
                      setEditTags(document.tags || []);
                    }}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
