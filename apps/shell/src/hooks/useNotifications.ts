/**
 * useNotifications Hook
 *
 * Provides real-time notification functionality including:
 * - Fetching notifications with auto-refresh
 * - Real-time subscription for new notifications
 * - Unread count management
 * - Toast notifications for new items
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { notificationService, type Notification } from '@/services/notificationService';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseNotificationsOptions {
  limit?: number;
  unreadOnly?: boolean;
  organizationId?: string;
  showToastOnNew?: boolean;
  autoRefreshInterval?: number; // ms, 0 to disable
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const {
    limit = 50,
    unreadOnly = false,
    organizationId,
    showToastOnNew = true,
    autoRefreshInterval = 0
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const userIdRef = useRef<string | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getNotifications({
        limit,
        unreadOnly,
        organizationId
      });
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
    }
  }, [limit, unreadOnly, organizationId]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, []);

  // Refresh all notification data
  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
    setLoading(false);
  }, [fetchNotifications, fetchUnreadCount]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
      throw err;
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      throw err;
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      const notification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
      throw err;
    }
  }, [notifications]);

  // Handle new notification from real-time subscription
  const handleNewNotification = useCallback((notification: Notification) => {
    // Add to list
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast
    if (showToastOnNew) {
      toast(notification.title, {
        description: notification.message,
        action: notification.action_url ? {
          label: notification.action_label || 'View',
          onClick: () => window.location.href = notification.action_url!
        } : undefined
      });
    }
  }, [showToastOnNew]);

  // Initialize and subscribe to real-time updates
  useEffect(() => {
    const supabase = createClient();

    const initialize = async () => {
      setLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      userIdRef.current = user.id;

      // Fetch initial data
      await Promise.all([fetchNotifications(), fetchUnreadCount()]);
      setLoading(false);

      // Subscribe to real-time notifications
      channelRef.current = notificationService.subscribeToNotifications(
        user.id,
        handleNewNotification
      );
    };

    initialize();

    // Cleanup subscription
    return () => {
      if (channelRef.current) {
        notificationService.unsubscribeFromNotifications(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchNotifications, fetchUnreadCount, handleNewNotification]);

  // Auto-refresh interval
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;

    const interval = setInterval(refreshNotifications, autoRefreshInterval);
    return () => clearInterval(interval);
  }, [autoRefreshInterval, refreshNotifications]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        refreshNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleFocus);
    return () => document.removeEventListener('visibilitychange', handleFocus);
  }, [refreshNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications
  };
}

export default useNotifications;
