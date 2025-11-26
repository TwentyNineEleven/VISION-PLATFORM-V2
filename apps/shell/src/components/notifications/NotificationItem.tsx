'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/lib/mock-data';
import { formatTimeAgo } from '@/lib/mock-data';
import { GlowBadge } from '@/components/glow-ui';
import { Bell, ExternalLink } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

export function NotificationItem({ notification, onMarkRead, onClick }: NotificationItemProps) {
  const Icon = notification.icon || Bell;

  const handleClick = () => {
    onMarkRead(notification.id);
    onClick?.(notification);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all',
        notification.read
          ? 'border-transparent hover:border-border hover:bg-muted/70'
          : 'border-primary/30 bg-primary/5 shadow-glow-primary-sm'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
          notification.read ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{notification.title}</p>
          {notification.priority && (
            <GlowBadge
              variant={
                notification.priority === 'high'
                  ? 'destructive'
                  : notification.priority === 'medium'
                    ? 'warning'
                    : 'info'
              }
              size="sm"
            >
              {notification.priority}
            </GlowBadge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatTimeAgo(notification.timestamp)}</span>
          {notification.actionLabel && <span className="text-primary">{notification.actionLabel}</span>}
        </div>
      </div>

      {notification.actionUrl && (
        <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      )}
    </button>
  );
}
