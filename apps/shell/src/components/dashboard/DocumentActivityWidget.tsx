/**
 * Document Activity Widget
 * 
 * Displays recent document activities (upload, edit, delete) on the dashboard
 */

'use client';

import { useState, useEffect } from 'react';
import { FileUp, FilePenLine, FileX, File, MoreVertical } from 'lucide-react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { GlowButton } from '@/components/glow-ui';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  action: 'uploaded' | 'updated' | 'deleted';
  document_name: string;
  document_id: string;
  actor_name?: string;
  created_at: string;
}

function getActivityIcon(action: string) {
  switch (action) {
    case 'uploaded':
      return FileUp;
    case 'updated':
      return FilePenLine;
    case 'deleted':
      return FileX;
    default:
      return File;
  }
}

function getActivityColor(action: string) {
  switch (action) {
    case 'uploaded':
      return 'bg-green-100 text-green-700';
    case 'updated':
      return 'bg-blue-100 text-blue-700';
    case 'deleted':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getActivityText(action: string, documentName: string, actorName?: string) {
  const actor = actorName || 'Someone';
  
  switch (action) {
    case 'uploaded':
      return `${actor} uploaded "${documentName}"`;
    case 'updated':
      return `${actor} updated "${documentName}"`;
    case 'deleted':
      return `${actor} deleted "${documentName}"`;
    default:
      return `Activity on "${documentName}"`;
  }
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

export function DocumentActivityWidget() {
  const { activeOrganization } = useOrganization();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!activeOrganization?.id) {
      setIsLoading(false);
      return;
    }

    const loadActivities = async () => {
      setIsLoading(true);
      try {
        // Fetch recent documents as a proxy for activities
        // In a real implementation, you'd fetch from document_activities table
        const params = new URLSearchParams({
          organizationId: activeOrganization.id,
          sortBy: 'created_at',
          sortOrder: 'desc',
          limit: '5',
        });

        const response = await fetch(`/api/v1/documents?${params}`);
        const result = await response.json();
        
        if (result.success) {
          const documents = result.data.documents || [];
          
          // Transform documents into activities
          const recentActivities = documents.map((doc: any) => ({
            id: doc.id,
            action: 'uploaded' as const,
            document_name: doc.name,
            document_id: doc.id,
            actor_name: doc.uploaded_by || 'You',
            created_at: doc.created_at,
          }));

          setActivities(recentActivities);
        }
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, [activeOrganization?.id]);

  const handleViewAll = () => {
    router.push('/files');
  };

  const handleActivityClick = (activity: Activity) => {
    if (activity.action !== 'deleted') {
      router.push(`/files?doc=${activity.document_id}`);
    }
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
            Recent Activity
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

      {/* Activity List */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <File className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 mb-1">No recent activity</p>
            <button
              onClick={handleViewAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Get started with files
            </button>
          </div>
        ) : (
          <>
            {activities.map((activity) => {
              const IconComponent = getActivityIcon(activity.action);
              const colorClass = getActivityColor(activity.action);
              const activityText = getActivityText(
                activity.action,
                activity.document_name,
                activity.actor_name
              );

              return (
                <button
                  key={activity.id}
                  onClick={() => handleActivityClick(activity)}
                  disabled={activity.action === 'deleted'}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg transition-colors text-left',
                    activity.action !== 'deleted' && 'hover:bg-vision-gray-50 border border-transparent hover:border-border',
                    activity.action === 'deleted' && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  {/* Activity Icon */}
                  <div className={cn('w-8 h-8 rounded-md flex items-center justify-center shrink-0', colorClass)}>
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Activity Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {activityText}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimeAgo(activity.created_at)}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* View All Link */}
            <button
              onClick={handleViewAll}
              className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors text-center py-2"
            >
              View all activity →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
