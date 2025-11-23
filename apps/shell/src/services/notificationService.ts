import type { Notification } from '@/types/notification';

const STORAGE_KEY = 'notifications';

export const notificationService = {
  /**
   * Get all notifications
   */
  async getNotifications(): Promise<Notification[]> {
    try {
      const notifications = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
      // Sort by createdAt descending (newest first)
      return notifications.sort(
        (a: Notification, b: Notification) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Failed to load notifications:', error);
      return [];
    }
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const updated = notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const updated = notifications.map((n) => ({ ...n, read: true }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const filtered = notifications.filter((n) => n.id !== notificationId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw new Error('Failed to delete notification');
    }
  },

  /**
   * Delete all read notifications
   */
  async deleteAllRead(): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const filtered = notifications.filter((n) => !n.read);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete read notifications:', error);
      throw new Error('Failed to delete read notifications');
    }
  },

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getNotifications();
      return notifications.filter((n) => !n.read).length;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  },

  /**
   * Create a new notification (for testing/demo purposes)
   */
  async createNotification(
    notification: Omit<Notification, 'id' | 'createdAt'>
  ): Promise<Notification> {
    try {
      const newNotification: Notification = {
        ...notification,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      const notifications = await this.getNotifications();
      notifications.unshift(newNotification);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));

      return newNotification;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw new Error('Failed to create notification');
    }
  },

  /**
   * Initialize notifications from mock data (for first-time users)
   */
  async initializeMockNotifications(mockData: Notification[]): Promise<void> {
    try {
      const existing = await this.getNotifications();
      if (existing.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  },
};
