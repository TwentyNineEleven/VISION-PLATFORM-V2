/**
 * Files Page - Document Management
 * 
 * Main page for document library with folder navigation
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { File, Folder, Upload, Search, Grid, List, Filter } from 'lucide-react';
import { useOrganization } from '@/contexts/OrganizationContext';
import UploadModal from '@/components/documents/UploadModal';
import DocumentDetailModal from '@/components/documents/DocumentDetailModal';
import FolderTree from '@/components/documents/FolderTree';
import CreateFolderModal from '@/components/documents/CreateFolderModal';

// Types
interface Document {
  id: string;
  name: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  folderId: string | null;
}

interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  color?: string;
  icon?: string;
  children?: FolderItem[];
}

export default function FilesPage() {
  const searchParams = useSearchParams();
  const { activeOrganization } = useOrganization();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const organizationId = activeOrganization?.id;

  // Load folders on mount
  useEffect(() => {
    if (organizationId) {
      loadFolders();
    }
  }, [organizationId]);

  // Load documents when folder changes
  useEffect(() => {
    if (organizationId) {
      loadDocuments();
    }
  }, [organizationId, currentFolderId, searchQuery]);

  const loadFolders = async () => {
    if (!organizationId) return;
    
    try {
      const response = await fetch(
        `/api/v1/folders?organizationId=${organizationId}&tree=true`
      );
      const result = await response.json();
      if (result.success) {
        setFolders(result.data);
      }
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  };

  const loadDocuments = async () => {
    if (!organizationId) return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        organizationId,
        ...(currentFolderId && { folderId: currentFolderId }),
        ...(searchQuery && { query: searchQuery }),
        sortBy: 'updated_at',
        sortOrder: 'desc',
        limit: '50',
      });

      const response = await fetch(`/api/v1/documents?${params}`);
      const result = await response.json();
      if (result.success) {
        setDocuments(result.data.documents || []);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadComplete = () => {
    // Refresh documents after upload
    loadDocuments();
  };

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocumentId(doc.id);
  };

  const handleDocumentUpdate = () => {
    // Refresh documents after update
    loadDocuments();
  };

  const handleDocumentDelete = () => {
    // Refresh documents after delete
    loadDocuments();
    setSelectedDocumentId(null);
  };

  const handleFolderClick = (folderId: string | null) => {
    setCurrentFolderId(folderId);
  };

  const handleFolderCreated = () => {
    // Refresh folders after creation
    loadFolders();
  };

  const handleBulkMove = async () => {
    if (selectedDocs.size === 0) return;

    // TODO: Show folder selection modal
    const targetFolderId = prompt('Enter target folder ID (or leave empty for root):');
    
    try {
      const promises = Array.from(selectedDocs).map(docId =>
        fetch(`/api/v1/documents/${docId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folderId: targetFolderId || null }),
        })
      );

      await Promise.all(promises);
      
      // Clear selection and refresh
      setSelectedDocs(new Set());
      loadDocuments();
    } catch (error) {
      console.error('Failed to move documents:', error);
      alert('Failed to move some documents');
    }
  };

  const handleBulkTag = async () => {
    if (selectedDocs.size === 0) return;

    const tagsInput = prompt('Enter tags (comma-separated):');
    if (!tagsInput) return;

    const newTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    
    try {
      const promises = Array.from(selectedDocs).map(async docId => {
        const response = await fetch(`/api/v1/documents/${docId}`);
        const result = await response.json();
        const existingTags = result.data?.tags || [];
        const combinedTags = [...new Set([...existingTags, ...newTags])];

        return fetch(`/api/v1/documents/${docId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tags: combinedTags }),
        });
      });

      await Promise.all(promises);
      
      // Clear selection and refresh
      setSelectedDocs(new Set());
      loadDocuments();
    } catch (error) {
      console.error('Failed to tag documents:', error);
      alert('Failed to tag some documents');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDocs.size === 0) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedDocs.size} document(s)? This action can be undone.`
    );

    if (!confirmed) return;
    
    try {
      const promises = Array.from(selectedDocs).map(docId =>
        fetch(`/api/v1/documents/${docId}`, { method: 'DELETE' })
      );

      await Promise.all(promises);
      
      // Clear selection and refresh
      setSelectedDocs(new Set());
      loadDocuments();
    } catch (error) {
      console.error('Failed to delete documents:', error);
      alert('Failed to delete some documents');
    }
  };

  const toggleSelection = (docId: string) => {
    const newSelection = new Set(selectedDocs);
    if (newSelection.has(docId)) {
      newSelection.delete(docId);
    } else {
      newSelection.add(docId);
    }
    setSelectedDocs(newSelection);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  if (!organizationId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">No organization selected</p>
          <p className="text-sm text-gray-400 mt-2">
            Please select an organization to access files
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Files</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your organization's documents
            </p>
          </div>
          <button
            onClick={handleUpload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>

        {/* Search and View Controls */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Folder Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          {organizationId && (
            <FolderTree
              organizationId={organizationId}
              currentFolderId={currentFolderId}
              onFolderClick={handleFolderClick}
              onCreateFolder={() => setIsFolderModalOpen(true)}
            />
          )}
        </div>

        {/* Document List/Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <File className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No documents yet
              </h3>
              <p className="text-gray-500 mb-4">
                Upload your first document to get started
              </p>
              <button
                onClick={handleUpload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDocumentClick(doc)}
                  className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg">
                      <File className="w-6 h-6" />
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedDocs.has(doc.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelection(doc.id);
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 truncate mb-1">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatFileSize(doc.fileSize)}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {doc.tags.length > 2 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{doc.tags.length - 2}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    {formatDate(doc.updatedAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modified
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() => handleDocumentClick(doc)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedDocs.has(doc.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelection(doc.id);
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded">
                            <File className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatFileSize(doc.fileSize)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {doc.tags.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              +{doc.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(doc.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar (shown when documents are selected) */}
      {selectedDocs.size > 0 && (
        <div className="border-t border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              {selectedDocs.size} document{selectedDocs.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBulkMove}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Move
              </button>
              <button 
                onClick={handleBulkTag}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tag
              </button>
              <button 
                onClick={handleBulkDelete}
                className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {organizationId && (
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          organizationId={organizationId}
          folderId={currentFolderId}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* Document Detail Modal */}
      {selectedDocumentId && (
        <DocumentDetailModal
          isOpen={!!selectedDocumentId}
          onClose={() => setSelectedDocumentId(null)}
          documentId={selectedDocumentId}
          onUpdate={handleDocumentUpdate}
          onDelete={handleDocumentDelete}
        />
      )}

      {/* Create Folder Modal */}
      {organizationId && (
        <CreateFolderModal
          isOpen={isFolderModalOpen}
          onClose={() => setIsFolderModalOpen(false)}
          organizationId={organizationId}
          parentFolderId={currentFolderId}
          onSuccess={handleFolderCreated}
        />
      )}
    </div>
  );
}
