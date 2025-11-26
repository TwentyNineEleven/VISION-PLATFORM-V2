'use client';

import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from '@/components/glow-ui/GlowCard';
import { GlowBadge, GlowButton } from '@/components/glow-ui';
import { NotificationFilters } from '@/components/notifications/NotificationFilters';
import { NotificationList } from '@/components/notifications/NotificationList';
import { useNotifications } from '@/components/notifications/useNotifications';
import { Bell, Sparkles, Inbox, ShieldCheck } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = useNotifications();

  const stats = [
    {
      icon: <Bell className="h-4 w-4 text-primary" />,
      label: 'All notifications',
      value: notifications.notifications.length,
    },
    {
      icon: <Inbox className="h-4 w-4 text-secondary" />,
      label: 'Unread',
      value: notifications.unreadCount,
    },
    {
      icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
      label: 'Security alerts',
      value: notifications.notifications.filter((n) => n.priority === 'high').length,
    },
  ];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">Notifications</h1>
            {notifications.unreadCount > 0 && (
              <GlowBadge variant="info" size="sm">
                {notifications.unreadCount} unread
              </GlowBadge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Stay current across applications, workflows, and security updates.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <GlowButton variant="ghost" size="sm" onClick={notifications.clearAll}>
            Clear all
          </GlowButton>
          <GlowButton
            variant="outline"
            size="sm"
            onClick={notifications.markAllRead}
            disabled={notifications.unreadCount === 0}
          >
            Mark all read
          </GlowButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <GlowCard key={stat.label} variant="flat" padding="md">
            <GlowCardContent className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {stat.icon}
                <span>{stat.label}</span>
              </div>
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            </GlowCardContent>
          </GlowCard>
        ))}
      </div>

      <GlowCard variant="elevated">
        <GlowCardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <GlowCardTitle>Inbox</GlowCardTitle>
            <p className="text-sm text-muted-foreground">
              Filter by unread or app-related alerts and mark as read inline.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs text-primary">
            <Sparkles className="h-4 w-4" />
            Live updates enabled
          </div>
        </GlowCardHeader>
        <GlowCardContent className="space-y-4">
          <NotificationFilters activeFilter={notifications.filter} onChange={notifications.setFilter} />

          <NotificationList
            notifications={notifications.filteredNotifications}
            onMarkRead={notifications.markRead}
            onItemClick={(item) => item.actionUrl && (window.location.href = item.actionUrl)}
            onLoadMore={notifications.loadMore}
            isLoadingMore={notifications.isLoadingMore}
          />
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
