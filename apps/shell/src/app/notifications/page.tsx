'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  GlowCard,
  GlowCardContent,
  GlowButton,
  GlowBadge,
} from '@/components/glow-ui';
import { mockNotifications } from '@/lib/mock-data';
import type { Notification } from '@/types/notification';
import { notificationService } from '@/services/notificationService';
import {
  Bell,
  Check,
  CheckCheck,
  Trash,
  ArrowRight,
  AlertCircle,
  Info,
  Users,
  Settings,
} from 'lucide-react';

type FilterOption = 'all' | 'unread' | 'read';

const filterLabels: Record<FilterOption, string> = {
  all: 'All',
  unread: 'Unread',
  read: 'Read',
};

const notificationIcon = (type: Notification['type'], priority?: string) => {
  const iconClass = priority === 'high' ? 'text-destructive' : 'text-primary';
  const iconProps = { size: 18, className: iconClass };
  switch (type) {
    case 'system':
      return <Settings {...iconProps} />;
    case 'organization':
      return <Users {...iconProps} />;
    case 'application':
      return <Bell {...iconProps} />;
    case 'personal':
      return <Info {...iconProps} />;
    default:
      return <Bell {...iconProps} />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    try {
      // Initialize with mock data if no notifications exist
      const convertedMockNotifications = mockNotifications.map((n) => ({
        ...n,
        createdAt: n.timestamp.toISOString(),
        timestamp: undefined,
        icon: undefined,
      })) as unknown as Notification[];

      await notificationService.initializeMockNotifications(convertedMockNotifications);

      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (filter === 'unread') return !notification.read;
      if (filter === 'read') return notification.read;
      return true;
    });
  }, [notifications, filter]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const readCount = useMemo(
    () => notifications.filter((notification) => notification.read).length,
    [notifications]
  );

  const markAsRead = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await notificationService.markAsRead(id);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      setError('Failed to mark as read');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await notificationService.markAllAsRead();
      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      setError('Failed to mark all as read');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (!notification) return;

    // Confirm before deleting
    if (
      !confirm(
        `Delete notification "${notification.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await notificationService.deleteNotification(id);
      // Update local state
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError('Failed to delete notification');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllRead = async () => {
    if (readCount === 0) {
      return;
    }

    if (
      !confirm(
        `Delete ${readCount} read notification(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await notificationService.deleteAllRead();
      // Update local state
      setNotifications((prev) => prev.filter((n) => !n.read));
    } catch (err) {
      setError('Failed to delete read notifications');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
              <Stack spacing="xl">
                <Stack spacing="md">
                  <Stack spacing="xs">
                    <Title level={1}>Notifications</Title>
                    <Text color="secondary">
                      {unreadCount > 0
                        ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`
                        : 'You are all caught up!'}
                    </Text>
                  </Stack>
                  {error && (
                    <div className="bg-vision-red-50 border border-vision-red-600 text-vision-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}
                  <Group spacing="md">
                    <GlowButton
                      variant="outline"
                      leftIcon={<CheckCheck size={16} />}
                      onClick={markAllAsRead}
                      disabled={isLoading || unreadCount === 0}
                      aria-label="Mark all notifications as read"
                    >
                      Mark all read
                    </GlowButton>
                    <GlowButton
                      variant="ghost"
                      leftIcon={<Trash size={16} />}
                      onClick={deleteAllRead}
                      disabled={isLoading || readCount === 0}
                      aria-label="Delete all read notifications"
                    >
                      Delete Read
                    </GlowButton>
                  </Group>
                </Stack>

                <GlowCard variant="flat">
                  <GlowCardContent>
                    <div role="tablist" aria-label="Notification filters">
                      <Group spacing="md">
                        {(['all', 'unread', 'read'] as FilterOption[]).map((option) => (
                          <GlowButton
                            key={option}
                            role="tab"
                            aria-selected={filter === option}
                            aria-controls="notifications-list"
                            variant={filter === option ? 'default' : 'ghost'}
                            size="sm"
                            className="border border-border"
                            onClick={() => setFilter(option)}
                          >
                            {filterLabels[option]}{' '}
                            <span className="ml-1 text-xs text-muted-foreground">
                              {option === 'all' && notifications.length}
                              {option === 'unread' && unreadCount}
                              {option === 'read' && notifications.length - unreadCount}
                            </span>
                          </GlowButton>
                        ))}
                      </Group>
                    </div>
                  </GlowCardContent>
                </GlowCard>

                <div aria-live="polite" aria-atomic="true" className="sr-only">
                  {error}
                  {isLoading && 'Processing...'}
                </div>

                <GlowCard variant="elevated">
                  <GlowCardContent>
                    <div id="notifications-list" role="tabpanel">
                      {filteredNotifications.length > 0 ? (
                        <Stack spacing="lg">
                        {filteredNotifications.map((notification) => (
                          <GlowCard
                            key={notification.id}
                            variant="flat"
                            className={notification.read ? '' : 'bg-vision-blue-50'}
                          >
                            <Stack spacing="md">
                              <Group justify="between" align="start">
                                <Group spacing="md" align="center">
                                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                                    {notificationIcon(notification.type, notification.priority)}
                                  </div>
                                  <Stack spacing="sm">
                                    <Group spacing="xs" align="center">
                                      <Title level={5}>{notification.title}</Title>
                                      {!notification.read && (
                                        <span className="inline-flex items-center">
                                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                          <span className="sr-only">unread notification</span>
                                        </span>
                                      )}
                                      {notification.priority === 'high' && (
                                        <GlowBadge variant="destructive" size="sm">
                                          Urgent
                                        </GlowBadge>
                                      )}
                                    </Group>
                                    <Text size="sm" color="secondary">
                                      {notification.message}
                                    </Text>
                                    <Group spacing="xs" align="center">
                                      <GlowBadge variant="secondary" size="sm">
                                        {notification.type}
                                      </GlowBadge>
                                      <Text size="xs" color="tertiary">
                                        {new Date(notification.createdAt).toLocaleString()}
                                      </Text>
                                    </Group>
                                  </Stack>
                                </Group>
                                <Group spacing="sm">
                                  {!notification.read && (
                                    <GlowButton
                                      variant="ghost"
                                      size="sm"
                                      leftIcon={<Check size={16} />}
                                      onClick={() => markAsRead(notification.id)}
                                      disabled={isLoading}
                                      aria-label={`Mark "${notification.title}" as read`}
                                    >
                                      Mark read
                                    </GlowButton>
                                  )}
                                  <GlowButton
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<Trash size={16} />}
                                    onClick={() => deleteNotification(notification.id)}
                                    disabled={isLoading}
                                    aria-label={`Delete "${notification.title}" notification`}
                                  >
                                    Delete
                                  </GlowButton>
                                </Group>
                              </Group>
                              {notification.actionUrl && notification.actionLabel && (
                                <GlowButton
                                  variant="outline"
                                  size="sm"
                                  rightIcon={<ArrowRight size={16} />}
                                  onClick={() => {
                                    window.location.href = notification.actionUrl!;
                                  }}
                                  aria-label={`${notification.actionLabel} for ${notification.title}`}
                                >
                                  {notification.actionLabel}
                                </GlowButton>
                              )}
                            </Stack>
                          </GlowCard>
                        ))}
                        </Stack>
                      ) : (
                        <Stack spacing="md" align="center" className="py-12">
                          <AlertCircle size={64} className="text-muted-foreground" />
                          <Text size="sm" color="secondary">
                            {filter === 'unread'
                              ? 'No unread notifications'
                              : filter === 'read'
                                ? 'No read notifications'
                                : 'No notifications yet'}
                          </Text>
                          <Text size="xs" color="tertiary">
                            You&apos;ll see notifications here when something important happens.
                          </Text>
                        </Stack>
                      )}
                    </div>
                  </GlowCardContent>
                </GlowCard>
      </Stack>
    </Container>
  );
}
