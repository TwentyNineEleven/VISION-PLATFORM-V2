'use client';

import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { GlowButton } from '@/components/glow-ui';
import { NotificationFilters } from './NotificationFilters';
import { NotificationList } from './NotificationList';
import { useNotifications } from './useNotifications';

export function NotificationDropdown() {
  const {
    filteredNotifications,
    unreadCount,
    filter,
    setFilter,
    markRead,
    markAllRead,
    clearAll,
    loadMore,
    isLoadingMore,
  } = useNotifications();

  const handleItemClick = (notification: (typeof filteredNotifications)[number]) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-primary hover:shadow-glow-primary-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-semibold text-destructive-foreground shadow-glow-error-sm">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={12}
          align="end"
          className="z-50 w-[420px] rounded-lg border border-border bg-card p-4 shadow-ambient-elevated"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground">Stay up to date across apps</p>
            </div>
            <div className="flex items-center gap-2">
              <GlowButton variant="ghost" size="sm" leftIcon={<CheckCheck className="h-4 w-4" />} onClick={markAllRead}>
                Mark all
              </GlowButton>
              <GlowButton
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 className="h-4 w-4" />}
                onClick={clearAll}
              >
                Clear
              </GlowButton>
            </div>
          </div>

          <NotificationFilters activeFilter={filter} onChange={setFilter} />

          <div className="mt-3 max-h-[360px] overflow-y-auto pr-1">
            <NotificationList
              notifications={filteredNotifications}
              onMarkRead={markRead}
              onItemClick={handleItemClick}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
            />
          </div>

          <DropdownMenu.Arrow className="fill-card" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
