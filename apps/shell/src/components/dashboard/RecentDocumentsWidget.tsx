/**
 * Recent Documents Widget
 * 
 * Displays user's most recently accessed/modified documents on the dashboard
 */

'use client';

import { useState, useEffect } from 'react';
import { File, FileText, Image, FileSpreadsheet, FileVideo, Archive, MoreVertical } from 'lucide-react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { GlowButton } from '@/components/glow-ui';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  name: string;
  mimeType: string;
  fileSize: number;
  updatedAt: string;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.includes('pdf')) return FileText;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return FileSpreadsheet;
  if (mimeType.startsWith('video/')) return FileVideo;
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return Archive;
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + sizes[i];
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

export function RecentDocumentsWidget() {
  const { activeOrganization } = useOrganization();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!activeOrganization?.id) {
      setIsLoading(false);
      return;
    }

    const loadRecentDocuments = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          organizationId: activeOrganization.id,
          sortBy: 'updated_at',
          sortOrder: 'desc',
          limit: '5',
        });

        const response = await fetch(`/api/v1/documents?${params}`);
        const result = await response.json();
        
        if (result.success) {
          setDocuments(result.data.documents || []);
        }
      } catch (error) {
        console.error('Failed to load recent documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentDocuments();
  }, [activeOrganization?.id]);

  const handleViewAll = () => {
    router.push('/files');
  };

  const handleDocumentClick = (docId: string) => {
    router.push(`/files?doc=${docId}`);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-vision-gray-100 border border-border rounded-md flex items-center justify-center shrink-0 text-vision-gray-700">
            <File className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-vision-gray-700 truncate">
            Recent Documents
          </p>
        </div>
        <GlowButton
          variant="ghost"
          size="icon"
          glow="none"
          className="text-muted-foreground hover:text-vision-gray-700"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </GlowButton>
      </div>

      {/* Document List */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <File className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 mb-1">No documents yet</p>
            <button
              onClick={handleViewAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Upload your first document
            </button>
          </div>
        ) : (
          <>
            {documents.map((doc) => {
              const IconComponent = getFileIcon(doc.mimeType);
              return (
                <button
                  key={doc.id}
                  onClick={() => handleDocumentClick(doc.id)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg transition-colors',
                    'hover:bg-vision-gray-50 border border-transparent hover:border-border',
                    'text-left w-full'
                  )}
                >
                  {/* File Icon */}
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center shrink-0">
                    <IconComponent className="w-4 h-4 text-blue-600" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(doc.fileSize)} • {formatTimeAgo(doc.updatedAt)}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* View All Button */}
            <button
              onClick={handleViewAll}
              className={cn(
                'mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors',
                'text-center py-2'
              )}
            >
              View all documents →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
