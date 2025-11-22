'use client';

import * as React from 'react';
import type { Notification } from '@/lib/mock-data';
import { NotificationItem } from './NotificationItem';
import { BellOff } from 'lucide-react';
import { GlowButton } from '@/components/glow-ui';

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onItemClick?: (notification: Notification) => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function NotificationList({
  notifications,
  onMarkRead,
  onItemClick,
  onLoadMore,
  isLoadingMore,
}: NotificationListProps) {
  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        <BellOff className="h-5 w-5" />
        <div className="space-y-1 text-center">
          <p className="font-semibold text-foreground">No notifications</p>
          <p className="text-sm text-muted-foreground">You are all caught up!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkRead={onMarkRead}
          onClick={onItemClick}
        />
      ))}

      {onLoadMore && (
        <div className="pt-2">
          <GlowButton
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onLoadMore}
            loading={isLoadingMore}
          >
            Load more
          </GlowButton>
        </div>
      )}
    </div>
  );
}
