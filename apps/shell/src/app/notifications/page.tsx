'use client';

import { useMemo, useState } from 'react';
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
import { mockApps, mockNotifications, type Notification } from '@/lib/mock-data';
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
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<FilterOption>('all');

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (filter === 'unread') return !notification.read;
      if (filter === 'read') return notification.read;
      return true;
    });
  }, [notifications, filter]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
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
                  <Group spacing="md">
                    <GlowButton variant="outline" leftIcon={<CheckCheck size={16} />} onClick={markAllAsRead} disabled={unreadCount === 0}>
                      Mark all read
                    </GlowButton>
                    <GlowButton variant="ghost" leftIcon={<Trash size={16} />} onClick={clearAll} disabled={notifications.length === 0}>
                      Clear all
                    </GlowButton>
                  </Group>
                </Stack>

                <GlowCard variant="flat">
                  <GlowCardContent>
                    <Group spacing="md">
                      {(['all', 'unread', 'read'] as FilterOption[]).map((option) => (
                        <GlowButton
                          key={option}
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
                  </GlowCardContent>
                </GlowCard>

                <GlowCard variant="elevated">
                  <GlowCardContent>
                    {filteredNotifications.length > 0 ? (
                      <Stack spacing="lg">
                        {filteredNotifications.map((notification) => (
                          <GlowCard
                            key={notification.id}
                            variant="flat"
                            className={notification.read ? '' : 'bg-blue-50/50'}
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
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
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
                                        {new Date(notification.timestamp).toLocaleString()}
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
                                    >
                                      Mark read
                                    </GlowButton>
                                  )}
                                  <GlowButton
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<Trash size={16} />}
                                    onClick={() => deleteNotification(notification.id)}
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
                                    if (notification.actionUrl) {
                                      window.location.href = notification.actionUrl;
                                    }
                                  }}
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
                  </GlowCardContent>
        </GlowCard>
      </Stack>
    </Container>
  );
}
