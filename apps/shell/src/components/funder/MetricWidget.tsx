'use client';

import * as React from 'react';
import { GlowCard, GlowCardContent } from '@/components/glow-ui/GlowCard';
import { MoreVertical, TrendingUp } from 'lucide-react';
import { GlowButton } from '@/components/glow-ui';
import { SimpleBarChart } from './SimpleBarChart';
import { cn } from '@/lib/utils';

interface MetricWidgetProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  chart?: React.ReactNode;
  className?: string;
}

export function MetricWidget({
  title,
  value,
  icon,
  trend,
  chart,
  className,
}: MetricWidgetProps) {
  return (
    <GlowCard variant="default" padding="md" className={cn('h-full', className)}>
      <GlowCardContent className="flex flex-col gap-0 p-0">
        <div className="flex items-start justify-between pb-0 pt-0">
          <div className="flex flex-1 gap-0 items-center min-h-[32px]">
            <div className="flex flex-1 flex-col gap-4 items-start">
              {icon && (
                <div className="bg-muted border border-border rounded-md shrink-0 size-10 flex items-center justify-center">
                  {icon}
                </div>
              )}
              <div className="flex flex-col gap-0.5 items-start justify-center w-full">
                <p className="text-sm font-medium text-muted-foreground overflow-ellipsis overflow-hidden whitespace-nowrap w-full">
                  {title}
                </p>
              </div>
            </div>
          </div>
          <GlowButton
            variant="ghost"
            size="icon"
            glow="none"
            className="text-foreground hover:text-foreground transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </GlowButton>
        </div>
        <div className="flex gap-0.5 items-end overflow-hidden w-full">
          <div className="flex flex-1 gap-0.5 items-end min-w-0">
            <p className="text-[40px] font-normal leading-[50px] text-foreground overflow-ellipsis overflow-hidden">
              {value}
            </p>
            {trend && (
              <div className="flex flex-col gap-2.5 items-start p-2.5">
                <div
                  className={cn(
                    'flex gap-1 items-center justify-center px-1.5 py-0.5 rounded-full border w-full',
                    trend.isPositive
                      ? 'border-success/20 bg-success/5'
                      : 'border-destructive/20 bg-destructive/5'
                  )}
                >
                  <TrendingUp
                    className={cn(
                      'w-3.5 h-3.5',
                      trend.isPositive ? 'text-success' : 'text-destructive rotate-180'
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs font-medium',
                      trend.isPositive ? 'text-success' : 'text-destructive'
                    )}
                  >
                    {trend.value}
                  </span>
                </div>
              </div>
            )}
          </div>
          {chart ? (
            <div className="flex flex-col gap-2.5 h-full items-end justify-center w-20">
              {chart}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 h-full items-end justify-center w-20">
              <SimpleBarChart />
            </div>
          )}
        </div>
      </GlowCardContent>
    </GlowCard>
  );
}
