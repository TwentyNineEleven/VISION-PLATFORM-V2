/**
 * Notification Service
 *
 * Handles all notification operations including:
 * - Creating notifications
 * - Fetching user notifications
 * - Marking notifications as read
 * - Managing notification preferences
 * - Real-time notification subscriptions
 * - Email notifications via Resend
 */

import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import * as Sentry from '@sentry/nextjs';

export type NotificationType =
  | 'invitation'
  | 'member_added'
  | 'member_removed'
  | 'role_changed'
  | 'organization_updated'
  | 'task_assigned'
  | 'task_completed'
  | 'file_shared'
  | 'comment_added'
  | 'mention'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id: string;
  organization_id: string | null;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  action_url: string | null;
  action_label: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
  actor_id: string | null;
  read: boolean;
  read_at: string | null;
  email_sent: boolean;
  email_sent_at: string | null;
  email_error: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  in_app_enabled: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  invitation_in_app: boolean;
  invitation_email: boolean;
  member_added_in_app: boolean;
  member_added_email: boolean;
  member_removed_in_app: boolean;
  member_removed_email: boolean;
  role_changed_in_app: boolean;
  role_changed_email: boolean;
  organization_updated_in_app: boolean;
  organization_updated_email: boolean;
  task_assigned_in_app: boolean;
  task_assigned_email: boolean;
  task_completed_in_app: boolean;
  task_completed_email: boolean;
  file_shared_in_app: boolean;
  file_shared_email: boolean;
  comment_added_in_app: boolean;
  comment_added_email: boolean;
  mention_in_app: boolean;
  mention_email: boolean;
  system_in_app: boolean;
  system_email: boolean;
  email_digest_frequency: 'realtime' | 'daily' | 'weekly' | 'never';
  quiet_hours_enabled: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  quiet_hours_timezone: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationInput {
  user_id: string;
  organization_id?: string;
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  related_entity_type?: string;
  related_entity_id?: string;
  actor_id?: string;
}

class NotificationService {
  /**
   * Get user notifications (client-side)
   */
  async getNotifications(options?: {
    limit?: number;
    unreadOnly?: boolean;
    organizationId?: string;
  }): Promise<Notification[]> {
    try {
      const supabase = createClient();

      let query = supabase
        .from('notifications')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (options?.unreadOnly) {
        query = query.eq('read', false);
      }

      if (options?.organizationId) {
        query = query.eq('organization_id', options.organizationId);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        Sentry.captureException(error, {
          tags: { service: 'notification', operation: 'getNotifications' }
        });
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const supabase = createClient();

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return 0;

      const { data, error } = await supabase.rpc('get_unread_notification_count', {
        p_user_id: userData.user.id
      });

      if (error) {
        Sentry.captureException(error, {
          tags: { service: 'notification', operation: 'getUnreadCount' }
        });
        throw error;
      }

      return data || 0;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('notifications')
        .update({
          read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) {
        Sentry.captureException(error, {
          tags: { service: 'notification', operation: 'markAsRead' }
        });
        throw error;
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<number> {
    try {
      const supabase = createClient();

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return 0;

      const { data, error } = await supabase.rpc('mark_all_notifications_read', {
        p_user_id: userData.user.id
      });

      if (error) {
        Sentry.captureException(error, {
          tags: { service: 'notification', operation: 'markAllAsRead' }
        });
        throw error;
      }

      return data || 0;
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('notifications')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) {
        Sentry.captureException(error, {
          tags: { service: 'notification', operation: 'deleteNotification' }
        });
        throw error;
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }

  /**
   * Delete all read notifications
   */
  async deleteAllRead(): Promise<void> {
    try {
      const supabase = createClient();

      const { error} = await supabase
        .from('notifications')
        .update({ deleted_at: new Date().toISOString() })
        .eq('read', true)
        .is('deleted_at', null);

      if (error) {
        Sentry.captureException(error, {
          tags: { service: 'notification', operation: 'deleteAllRead' }
        });
        throw error;
      }
    } catch (error) {
      console.error('Failed to delete read notifications:', error);
      throw error;
    }
  }

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreferences | null> {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // Not found is ok
        Sentry.captureException(error, {
          tags: { service: 'notification', operation: 'getPreferences' }
        });
        throw error;
      }

      return data as NotificationPreferences | null;
    } catch (error) {
      console.error('Failed to fetch notification preferences:', error);
      return null;
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    try {
      const supabase = createClient();

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userData.user.id,
          ...preferences
        });

      if (error) {
        Sentry.captureException(error, {
          tags: { service: 'notification', operation: 'updatePreferences' }
        });
        throw error;
      }
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time notifications
   */
  subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ): RealtimeChannel {
    const supabase = createClient();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return channel;
  }

  /**
   * Unsubscribe from notifications
   */
  unsubscribeFromNotifications(channel: RealtimeChannel): void {
    channel.unsubscribe();
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
