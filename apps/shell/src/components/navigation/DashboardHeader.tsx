'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { GlowButton, GlowInput, GlowBadge } from '../glow-ui';
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  Command,
  Plus,
  Grid3x3,
} from 'lucide-react';

/**
 * Notification Interface
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  actionUrl?: string;
}

/**
 * Dashboard Header Props
 */
export interface DashboardHeaderProps {
  onMenuToggle?: () => void;
  onSearch?: (query: string) => void;
  onThemeToggle?: () => void;
  onAppSwitcher?: () => void;
  theme?: 'light' | 'dark';
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
  showSearch?: boolean;
  showAppSwitcher?: boolean;
  showNotifications?: boolean;
  showThemeToggle?: boolean;
  quickActions?: Array<{
    id: string;
    label: string;
    icon: React.ElementType;
    onClick: () => void;
  }>;
}

/**
 * Dashboard Header Component
 * Top navigation bar with search, notifications, and quick actions
 */
export function DashboardHeader({
  onMenuToggle,
  onSearch,
  onThemeToggle,
  onAppSwitcher,
  theme = 'light',
  notifications = [],
  onNotificationClick,
  onMarkAllRead,
  showSearch = true,
  showAppSwitcher = true,
  showNotifications = true,
  showThemeToggle = true,
  quickActions = [],
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showNotificationPanel, setShowNotificationPanel] = React.useState(false);
  const notificationRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close notification panel when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotificationPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-ambient-card">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <GlowButton
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </GlowButton>

          {/* App Switcher */}
          {showAppSwitcher && (
            <GlowButton
              variant="ghost"
              size="icon"
              onClick={onAppSwitcher}
              glow="subtle"
              className="hidden lg:flex"
            >
              <Grid3x3 className="h-5 w-5" />
            </GlowButton>
          )}

          {/* Search */}
          {showSearch && (
            <div className="hidden md:block w-64 lg:w-96">
              <GlowInput
                type="text"
                placeholder="Search or press ⌘K..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                variant="glow"
                inputSize="sm"
                leftIcon={<Search className="h-4 w-4" />}
                rightIcon={
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <Command className="h-3 w-3" />K
                  </kbd>
                }
              />
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <GlowButton
                key={action.id}
                variant="ghost"
                size="icon"
                onClick={action.onClick}
                className="hidden lg:flex"
              >
                <Icon className="h-5 w-5" />
              </GlowButton>
            );
          })}

          {/* New Action Button */}
          <GlowButton
            variant="default"
            size="sm"
            glow="subtle"
            className="hidden sm:flex"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            New
          </GlowButton>

          {/* Mobile Search */}
          {showSearch && (
            <GlowButton
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Search className="h-5 w-5" />
            </GlowButton>
          )}

          {/* Notifications */}
          {showNotifications && (
            <div className="relative" ref={notificationRef}>
              <GlowButton
                variant="ghost"
                size="icon"
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow-glow-error-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </GlowButton>

              {/* Notification Panel */}
              {showNotificationPanel && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border border-border bg-card shadow-ambient-elevated animate-fade-in">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <GlowButton
                        variant="ghost"
                        size="sm"
                        onClick={onMarkAllRead}
                      >
                        Mark all read
                      </GlowButton>
                    )}
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => {
                              onNotificationClick?.(notification);
                              setShowNotificationPanel(false);
                            }}
                            className={cn(
                              'w-full p-4 text-left hover:bg-accent transition-colors',
                              !notification.read && 'bg-accent/50'
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={cn(
                                  'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                                  notification.type === 'success' &&
                                    'bg-secondary shadow-glow-success-sm',
                                  notification.type === 'warning' &&
                                    'bg-accent shadow-glow-accent-sm',
                                  notification.type === 'error' &&
                                    'bg-destructive shadow-glow-error-sm',
                                  notification.type === 'info' &&
                                    'bg-primary shadow-glow-primary-sm'
                                )}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {formatTimestamp(notification.timestamp)}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-border">
                      <GlowButton
                        variant="ghost"
                        size="sm"
                        className="w-full"
                      >
                        View all notifications
                      </GlowButton>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          {showThemeToggle && (
            <GlowButton
              variant="ghost"
              size="icon"
              onClick={onThemeToggle}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </GlowButton>
          )}
        </div>
      </div>
    </header>
  );
}

/**
 * Format timestamp to relative time
 */
function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

/**
 * Example Notifications
 */
export const exampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Application Available',
    message: 'FundingFramer is now ready to use in your organization',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    read: false,
    type: 'success',
  },
  {
    id: '2',
    title: 'Document Uploaded',
    message: 'Annual Report 2024.pdf has been successfully uploaded',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    read: false,
    type: 'info',
  },
  {
    id: '3',
    title: 'Team Member Invited',
    message: 'Sarah Johnson has joined your organization',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
    type: 'info',
  },
];
