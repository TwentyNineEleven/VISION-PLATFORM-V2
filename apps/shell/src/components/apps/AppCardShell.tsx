'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { GlowButton, GlowCard } from '@/components/glow-ui';
import type { AppMetadata, AppStatus } from '@/lib/app-catalog-types';
import {
  getPhaseColor,
  getPhaseLabel,
  getPhaseSoftColor,
} from '@/lib/apps/appMetadata';
import { getPhaseHoverColor } from '@/lib/phase-colors';
import { cn } from '@/lib/utils';
import { AppIcon } from './AppIcon';

const BUTTON_LABELS: Record<AppStatus, string> = {
  available: 'Launch',
  preview: 'Preview',
  beta: 'Beta',
  'coming-soon': 'Coming soon',
  'funder-only': 'Request access',
};

// Status chip styles - use domain colors when applicable
const getStatusChipStyle = (
  status: AppStatus,
  domainColor?: string
): { label: string; textColor: string; borderColor: string; bgColor: string } | null => {
  // Helper to convert hex to rgba with opacity
  const hexToRgba = (hex: string, opacity: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Use Tailwind color tokens from design system
  const COLORS = {
    blue: { text: 'hsl(221 83% 53%)', bg: 'hsl(214 100% 97%)' }, // Electric Blue / Ice Blue
    orange: { text: 'hsl(21 90% 41%)', bg: 'hsl(24 100% 97%)' }, // Vivid Tangerine / Peach Light
    gray: { text: 'hsl(215 16% 47%)', border: 'hsl(214 32% 91%)', bg: 'hsl(210 40% 96.1%)' }, // Steel Gray / Silver / Smoke
    purple: { text: 'hsl(266 68% 51%)', bg: 'hsl(270 100% 98%)' }, // Rich Purple / Lavender Light
  };

  switch (status) {
    case 'preview':
      // Use domain color if available, otherwise use blue
      return {
        label: 'Preview',
        textColor: domainColor || COLORS.blue.text,
        borderColor: domainColor || COLORS.blue.text,
        bgColor: domainColor ? hexToRgba(domainColor, 0.1) : COLORS.blue.bg,
      };
    case 'beta':
      // Use domain color if available, otherwise use orange
      return {
        label: 'Beta',
        textColor: domainColor || COLORS.orange.text,
        borderColor: domainColor || COLORS.orange.text,
        bgColor: domainColor ? hexToRgba(domainColor, 0.1) : COLORS.orange.bg,
      };
    case 'coming-soon':
      return {
        label: 'Coming soon',
        textColor: COLORS.gray.text,
        borderColor: COLORS.gray.border,
        bgColor: COLORS.gray.bg,
      };
    case 'funder-only':
      return {
        label: 'Funder-only',
        textColor: COLORS.purple.text,
        borderColor: COLORS.purple.text,
        bgColor: COLORS.purple.bg,
      };
    default:
      return null;
  }
};

export interface AppCardShellProps {
  app: AppMetadata;
  onLaunch?: (app: AppMetadata) => void;
  onToggleFavorite?: (appId: string) => void;
  onViewDetails?: (app: AppMetadata) => void;
  className?: string;
  showDescription?: boolean;
  showStatusChip?: boolean;
  iconSize?: 'sm' | 'md' | 'lg';
  buttonLabel?: string;
  buttonSize?: 'sm' | 'md';
}

export function AppCardShell({
  app,
  onLaunch,
  onToggleFavorite,
  onViewDetails,
  className,
  showDescription = false,
  showStatusChip = false,
  iconSize = 'md',
  buttonLabel,
  buttonSize = 'md',
}: AppCardShellProps) {
  const router = useRouter();
  const domainColor = getPhaseColor(app.phase);
  const domainSoftColor = getPhaseSoftColor(app.phase);
  const domainLabel = getPhaseLabel(app.phase).toUpperCase();
  const domainHoverColor = getPhaseHoverColor(app.phase);
  const isDisabled = app.status === 'coming-soon' || app.status === 'funder-only';
  const favoriteColor = domainColor;
  const isFavorite = app.isFavorited ?? app.isFavorite ?? false;
  const statusChip = getStatusChipStyle(app.status, domainColor);
  const finalButtonLabel = buttonLabel || BUTTON_LABELS[app.status] || 'Launch';

  const handleLaunch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isDisabled) return;
    if (onLaunch) {
      onLaunch(app);
      return;
    }
    if (app.route) {
      router.push(app.route as any);
    }
  };

  const handleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!onToggleFavorite) return;
    onToggleFavorite(app.id);
  };

  return (
    <GlowCard
      variant="default"
      padding="none"
      className={cn(
        'flex h-full w-full flex-col border border-border bg-card text-left shadow-ambient-card transition-all hover:shadow-ambient-card-hover',
        'rounded-2xl overflow-hidden',
        className
      )}
    >
      {/* Fixed padding container with tight constraints */}
      <div className="flex h-full w-full flex-col p-5">
        {/* Header: Phase badge + Favorite star - Fixed height: 32px */}
        <div className="flex h-8 items-start justify-between">
          <span
            className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{
              backgroundColor: domainSoftColor,
              color: domainColor,
            }}
          >
            {domainLabel}
          </span>
          <button
            type="button"
            onClick={handleFavorite}
            disabled={!onToggleFavorite}
            aria-label={
              isFavorite
                ? `Unfavorite ${app.name}`
                : `Favorite ${app.name}`
            }
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
              'hover:bg-muted',
              isFavorite ? 'text-white' : 'text-muted-foreground'
            )}
            style={
              isFavorite
                ? { backgroundColor: domainColor, color: 'white' }
                : {}
            }
          >
            <Star
              size={16}
              fill={isFavorite ? favoriteColor : 'none'}
              stroke={isFavorite ? 'white' : 'currentColor'}
              className={isFavorite ? '' : 'text-muted-foreground'}
            />
          </button>
        </div>

        {/* Icon - Fixed spacing: 20px top margin, 16px bottom */}
        <div className="mb-4 mt-5 flex justify-center">
          <AppIcon app={app} size={iconSize} />
        </div>

        {/* Title + Category - Fixed height: 44px */}
        <div className="mb-3 h-11 space-y-0.5 text-center">
          <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
            {app.name}
          </h3>
          <p className="line-clamp-1 text-xs text-muted-foreground">{app.category}</p>
        </div>

        {/* Description - Fixed height: 60px (3 lines max @ 20px line-height) */}
        {showDescription ? (
          <div className="mb-3 h-[60px]">
            <p className="line-clamp-3 text-center text-sm leading-[20px] text-muted-foreground">
              {app.description}
            </p>
          </div>
        ) : null}

        {/* Status Chip - Fixed height: 28px (or 0 if not shown) */}
        {showStatusChip && statusChip ? (
          <div className="mb-3 flex h-7 items-center justify-center">
            <span
              className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide"
              style={{
                border: `1px solid ${statusChip.borderColor}`,
                backgroundColor: statusChip.bgColor,
                color: statusChip.textColor,
              }}
            >
              {statusChip.label}
            </span>
          </div>
        ) : showStatusChip ? (
          <div className="mb-3 h-7" />
        ) : null}

        {/* Spacer to push button to bottom */}
        <div className="flex-1" />

        {/* Launch Button - Fixed height: 40px */}
        <div className="mb-3">
          <GlowButton
            size={buttonSize === 'sm' ? 'sm' : 'default'}
            variant="default"
            glow="none"
            className="h-10 w-full rounded-lg text-sm font-semibold text-white"
            style={
              isDisabled
                ? { backgroundColor: 'hsl(var(--muted-foreground))' }
                : {
                    backgroundColor: domainColor,
                    color: 'white',
                  }
            }
            disabled={isDisabled}
            onClick={handleLaunch}
            onMouseEnter={(event) => {
              if (!isDisabled) {
                (event.currentTarget as HTMLButtonElement).style.backgroundColor =
                  domainHoverColor;
              }
            }}
            onMouseLeave={(event) => {
              if (!isDisabled) {
                (event.currentTarget as HTMLButtonElement).style.backgroundColor =
                  domainColor;
              }
            }}
          >
            {finalButtonLabel}
          </GlowButton>
        </div>

        {/* View Details Link - Fixed height: 36px (or 0 if not shown) */}
        {onViewDetails ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onViewDetails(app);
            }}
            className="h-9 w-full rounded-lg border border-transparent px-0 py-2 text-center text-xs font-semibold uppercase tracking-wide text-primary transition hover:text-primary/80"
          >
            View details
          </button>
        ) : (
          <div className="h-9" />
        )}
      </div>
    </GlowCard>
  );
}

export default AppCardShell;
