export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'organization' | 'application' | 'personal';
  read: boolean;
  createdAt: string;
  priority?: 'high' | 'medium' | 'low';
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationFilters {
  showRead: boolean;
  showUnread: boolean;
  type?: Notification['type'];
}
