'use client';

import * as React from 'react';
import { GlowCard, GlowCardContent } from '@/components/glow-ui/GlowCard';
import { MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';
import { GlowButton } from '@/components/glow-ui';
import { cn } from '@/lib/utils';

interface MetricWidgetProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function MetricWidget({
  title,
  value,
  icon,
  trend,
  className,
}: MetricWidgetProps) {
  return (
    <GlowCard variant="elevated" className={cn('h-full', className)}>
      <GlowCardContent className="flex flex-col gap-6 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg shrink-0 size-12 flex items-center justify-center">
                {icon}
              </div>
            )}
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
            </div>
          </div>
          <GlowButton
            variant="ghost"
            size="icon"
            glow="none"
            className="text-muted-foreground hover:text-foreground transition-colors -mt-1 -mr-1"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </GlowButton>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-4xl font-bold text-foreground">
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1.5">
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend.isPositive ? 'text-success' : 'text-destructive'
                  )}
                >
                  {trend.value}
                </span>
              </div>
            )}
          </div>
        </div>
      </GlowCardContent>
    </GlowCard>
  );
}
