'use client';

import { Bell } from 'lucide-react';

interface NotificationDropdownProps {
  unreadCount?: number;
}

export function NotificationDropdown({ unreadCount = 0 }: NotificationDropdownProps) {
  return (
    <button className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
