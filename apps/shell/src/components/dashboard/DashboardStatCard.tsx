'use client';

import * as React from 'react';
import { GlowCard } from '@/components/glow-ui';
import { cn } from '@/lib/utils';
import { 
  Grid3x3, 
  Inbox, 
  Bell, 
  Gauge,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export interface DashboardStatCardProps {
  id: string;
  label: string;
  value: number | string;
  sublabel: string;
  semantic: 'info' | 'warning' | 'error' | 'success';
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
}

const semanticConfig: Record<
  DashboardStatCardProps['semantic'],
  {
    textColor: string;
    bgColor: string;
    dotColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  info: {
    textColor: 'text-vision-blue-950',     // Bold Color System
    bgColor: 'bg-vision-blue-50',         // Bold Color System
    dotColor: 'bg-vision-blue-950',       // Bold Color System
    icon: Grid3x3,
  },
  warning: {
    textColor: 'text-vision-orange-900',   // Bold Color System
    bgColor: 'bg-vision-orange-50',       // Bold Color System
    dotColor: 'bg-vision-orange-900',     // Bold Color System
    icon: Inbox,
  },
  error: {
    textColor: 'text-vision-red-900',      // Bold Color System
    bgColor: 'bg-vision-red-50',          // Bold Color System
    dotColor: 'bg-vision-red-900',        // Bold Color System
    icon: Bell,
  },
  success: {
    textColor: 'text-vision-green-900',    // Bold Color System
    bgColor: 'bg-vision-green-50',        // Bold Color System
    dotColor: 'bg-vision-green-900',      // Bold Color System
    icon: Gauge,
  },
};

export function DashboardStatCard({
  label,
  value,
  sublabel,
  semantic,
  trend,
}: DashboardStatCardProps) {
  const { textColor, bgColor, dotColor, icon: Icon } = semanticConfig[semantic];

  return (
    <GlowCard
      variant="elevated"
      padding="md"
      className="border border-border/70 hover:shadow-ambient-card-hover transition-all"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl',
                bgColor,
                textColor
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
            </div>
          </div>
          <div className={cn('h-2 w-2 rounded-full', dotColor)} />
        </div>

        <div className="flex items-baseline gap-2">
          <span className={cn('text-3xl font-bold leading-tight', textColor)}>
            {value}
          </span>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.direction === 'up' ? (
                <TrendingUp className="h-4 w-4 text-vision-green-700" />
              ) : (
                <TrendingDown className="h-4 w-4 text-vision-red-700" />
              )}
              <span className="text-xs font-medium text-muted-foreground">
                {trend.value}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {sublabel}
        </p>
      </div>
    </GlowCard>
  );
}

