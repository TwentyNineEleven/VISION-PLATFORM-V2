'use client';

import * as React from 'react';
import { mockNotifications, type Notification, getUnreadNotificationCount } from '@/lib/mock-data';

export type NotificationFilter = 'all' | 'unread' | 'apps';

export function useNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = React.useState<NotificationFilter>('all');
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const filteredNotifications = React.useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((n) => !n.read);
    }
    if (filter === 'apps') {
      return notifications.filter((n) => n.type === 'application');
    }
    return notifications;
  }, [notifications, filter]);

  const unreadCount = React.useMemo(
    () => getUnreadNotificationCount(notifications),
    [notifications]
  );

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const loadMore = async () => {
    setIsLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoadingMore(false);
  };

  return {
    notifications,
    filteredNotifications,
    unreadCount,
    filter,
    setFilter,
    markRead,
    markAllRead,
    clearAll,
    loadMore,
    isLoadingMore,
  };
}
