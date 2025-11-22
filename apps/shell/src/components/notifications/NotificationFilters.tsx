'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { NotificationFilter } from './useNotifications';

interface NotificationFiltersProps {
  activeFilter: NotificationFilter;
  onChange: (filter: NotificationFilter) => void;
}

const FILTERS: { value: NotificationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'apps', label: 'Apps' },
];

export function NotificationFilters({ activeFilter, onChange }: NotificationFiltersProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-muted p-1">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
          className={cn(
            'flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all',
            activeFilter === filter.value
              ? 'bg-card shadow-ambient-card text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
