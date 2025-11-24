'use client';

import { Bell } from 'lucide-react';
import { GlowButton } from '@/components/glow-ui';

interface NotificationDropdownProps {
  unreadCount?: number;
}

export function NotificationDropdown({ unreadCount = 0 }: NotificationDropdownProps) {
  return (
    <GlowButton
      variant="ghost"
      size="icon"
      glow="none"
      className="relative text-gray-600 hover:text-gray-900"
      aria-label="Open notifications"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </GlowButton>
  );
}
