'use client';

import * as React from 'react';
import { GlowCard, GlowBadge, GlowButton } from '@/components/glow-ui';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAppMeta, getPhaseLabel } from '@/lib/apps/appMetadata';
import { getPhaseTokenClasses } from '@/lib/phase-colors';
import { formatRelativeTime } from '@/lib/dashboard/mockDashboardData';
import type { AppActivity } from '@/lib/dashboard/mockDashboardData';

export interface MiniAppCardProps {
  activity: AppActivity;
  onLaunch?: (appId: string, href: string) => void;
  onToggleFavorite?: (appId: string) => void;
  className?: string;
}

export function MiniAppCard({
  activity,
  onLaunch,
  onToggleFavorite,
  className,
}: MiniAppCardProps) {
  const meta = getAppMeta(activity.appId);
  if (!meta) return null;

  const phaseClasses = getPhaseTokenClasses(meta.phase);
  const phaseLabel = getPhaseLabel(meta.phase);

  const handleLaunch = () => {
    onLaunch?.(activity.appId, activity.href);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(activity.appId);
  };

  return (
    <GlowCard
      variant="interactive"
      padding="md"
      className={cn('flex flex-col gap-3', className)}
    >
      {/* Top row: Module pill + favorite icon */}
      <div className="flex items-center justify-between">
        <GlowBadge
          variant="outline"
          size="sm"
          className={cn(
            'border-transparent text-[10px] font-bold uppercase tracking-wider',
            phaseClasses.badgeBackground,
            phaseClasses.badgeText
          )}
        >
          {phaseLabel}
        </GlowBadge>
        <button
          onClick={handleToggleFavorite}
          className="text-muted-foreground hover:text-vision-orange transition-colors"
          aria-label="Toggle favorite"
        >
          <Star
            className={cn(
              'h-4 w-4',
              activity.pinnedBy === 'user' && 'fill-vision-orange text-vision-orange'
            )}
          />
        </button>
      </div>

      {/* Middle: App icon + name + sublabel */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full flex-shrink-0',
            phaseClasses.iconBackground,
            phaseClasses.iconText
          )}
        >
          <span className="text-xl font-bold">
            {meta.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground truncate">
            {meta.name}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {meta.category}
          </p>
        </div>
      </div>

      {/* Bottom: Launch button */}
      <GlowButton
        variant="default"
        size="sm"
        onClick={handleLaunch}
        className={cn(
          'w-full transition-colors',
          phaseClasses.buttonBackground,
          phaseClasses.buttonHover,
          'text-vision-gray-0'
        )}
      >
        Launch
      </GlowButton>

      {/* Helper text */}
      {activity.lastUsed && (
        <p className="text-[10px] text-muted-foreground text-center">
          Last used {formatRelativeTime(activity.lastUsed)}
        </p>
      )}
    </GlowCard>
  );
}
