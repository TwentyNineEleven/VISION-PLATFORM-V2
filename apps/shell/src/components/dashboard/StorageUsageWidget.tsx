/**
 * Storage Usage Widget
 * 
 * Displays organization's storage usage with visual progress bar
 */

'use client';

import { useState, useEffect } from 'react';
import { HardDrive, MoreVertical } from 'lucide-react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { GlowButton } from '@/components/glow-ui';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface StorageStats {
  used: number;
  total: number;
  percentage: number;
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

function getStorageColor(percentage: number): string {
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 75) return 'bg-yellow-500';
  return 'bg-blue-500';
}

function getStorageTextColor(percentage: number): string {
  if (percentage >= 90) return 'text-red-700';
  if (percentage >= 75) return 'text-yellow-700';
  return 'text-blue-700';
}

export function StorageUsageWidget() {
  const { activeOrganization } = useOrganization();
  const router = useRouter();
  const [storage, setStorage] = useState<StorageStats>({
    used: 0,
    total: 10737418240, // 10 GB default
    percentage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!activeOrganization?.id) {
      setIsLoading(false);
      return;
    }

    const loadStorageStats = async () => {
      setIsLoading(true);
      try {
        // Fetch documents to calculate storage
        const params = new URLSearchParams({
          organizationId: activeOrganization.id,
          limit: '1000', // Get all to calculate total
        });

        const response = await fetch(`/api/v1/documents?${params}`);
        const result = await response.json();
        
        if (result.success) {
          const documents = result.data.documents || [];
          const totalUsed = documents.reduce((sum: number, doc: any) => sum + (doc.file_size || 0), 0);
          const totalAllowed = 10737418240; // 10 GB - could be fetched from org settings
          const percentage = (totalUsed / totalAllowed) * 100;

          setStorage({
            used: totalUsed,
            total: totalAllowed,
            percentage: Math.min(percentage, 100),
          });
        }
      } catch (error) {
        console.error('Failed to load storage stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageStats();
  }, [activeOrganization?.id]);

  const handleViewFiles = () => {
    router.push('/files');
  };

  const progressColor = getStorageColor(storage.percentage);
  const textColor = getStorageTextColor(storage.percentage);

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-vision-gray-100 border border-border rounded-md flex items-center justify-center shrink-0 text-vision-gray-700">
            <HardDrive className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-vision-gray-700 truncate">
            Storage Usage
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

      {/* Storage Stats */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        ) : (
          <>
            {/* Storage Numbers */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-normal text-foreground">
                    {formatBytes(storage.used)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    of {formatBytes(storage.total)}
                  </span>
                </div>
                <div className={cn('text-sm font-medium mt-1', textColor)}>
                  {storage.percentage.toFixed(1)}% used
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-vision-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  progressColor
                )}
                style={{ width: `${Math.min(storage.percentage, 100)}%` }}
              />
            </div>

            {/* Warning Messages */}
            {storage.percentage >= 90 && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">
                    Storage Almost Full
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Consider deleting unused files or upgrading your plan.
                  </p>
                </div>
              </div>
            )}

            {storage.percentage >= 75 && storage.percentage < 90 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900">
                    Storage Running Low
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    You're using {storage.percentage.toFixed(0)}% of your storage.
                  </p>
                </div>
              </div>
            )}

            {/* View Files Link */}
            <button
              onClick={handleViewFiles}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors text-center"
            >
              Manage files →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
