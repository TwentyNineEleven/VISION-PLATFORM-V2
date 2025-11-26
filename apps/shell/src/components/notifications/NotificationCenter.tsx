/**
 * NotificationCenter Component
 *
 * Dropdown notification panel for the header.
 * Shows recent notifications with real-time updates.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  Users,
  UserPlus,
  UserMinus,
  Shield,
  Building2,
  ClipboardCheck,
  FileText,
  MessageSquare,
  AtSign,
  Info,
  Loader2
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import type { NotificationType } from '@/services/notificationService';

const notificationIcons: Record<NotificationType, React.ElementType> = {
  invitation: UserPlus,
  member_added: Users,
  member_removed: UserMinus,
  role_changed: Shield,
  organization_updated: Building2,
  task_assigned: ClipboardCheck,
  task_completed: Check,
  file_shared: FileText,
  comment_added: MessageSquare,
  mention: AtSign,
  system: Info
};

const priorityColors = {
  low: 'bg-vision-gray-100',
  medium: 'bg-vision-blue-100',
  high: 'bg-vision-orange-100',
  urgent: 'bg-vision-red-100'
};

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications({
    limit: 10,
    showToastOnNew: true
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleNotificationClick = async (notification: typeof notifications[0]) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
    setIsOpen(false);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-vision-smoke transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-vision-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-medium text-white bg-vision-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[70vh] bg-white rounded-xl shadow-lg border border-vision-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-vision-gray-200">
            <h3 className="font-semibold text-vision-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-vision-blue-600 hover:bg-vision-blue-50 rounded-md transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-vision-gray-100 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-vision-gray-500" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-vision-blue-600 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-vision-gray-500">
                <Bell className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-vision-gray-100">
                {notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type] || Info;
                  const priorityBg = priorityColors[notification.priority] || priorityColors.medium;

                  return (
                    <li
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`
                        px-4 py-3 hover:bg-vision-gray-50 cursor-pointer transition-colors
                        ${!notification.read ? 'bg-vision-blue-50/50' : ''}
                      `}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`
                          flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
                          ${priorityBg}
                        `}>
                          <Icon className="w-4 h-4 text-vision-gray-700" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm ${!notification.read ? 'font-medium text-vision-gray-900' : 'text-vision-gray-700'}`}>
                              {notification.title}
                            </p>
                            <button
                              onClick={(e) => handleDelete(e, notification.id)}
                              className="p-1 hover:bg-vision-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-vision-gray-400" />
                            </button>
                          </div>
                          <p className="text-xs text-vision-gray-500 line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-vision-gray-400">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </span>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-vision-blue-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-vision-gray-200 bg-vision-gray-50">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm text-vision-blue-600 hover:text-vision-blue-700 font-medium"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
