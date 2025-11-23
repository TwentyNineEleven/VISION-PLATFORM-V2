'use client';

/**
 * App Card Component
 * 
 * Displays a single app in the catalog grid.
 * Follows exact structure from requirements:
 * 1. Phase tag (top-left)
 * 2. Favorite icon (top-right)
 * 3. Icon circle (centered, phase accent color background)
 * 4. App name (centered)
 * 5. Category line (centered)
 * 6. Description (centered, 1-2 lines)
 * 7. Status chip (optional)
 * 8. Launch button (MUST match phase accent color)
 * 
 * CRITICAL: Launch button color = Icon circle color = Phase accent color
 */

import * as React from 'react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { Star, Lock, Grid3x3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppMetadata } from '@/lib/app-catalog-types';
import { phaseColorMap, getPhaseHoverColor, phaseLabels, type Phase } from '@/lib/phase-colors';
import { APP_ICON_MAP } from '@/components/apps/AppIcon';

export interface AppCardProps {
  app: AppMetadata;
  onLaunch?: (app: AppMetadata) => void;
  onToggleFavorite?: (appId: string) => void;
  onViewDetails?: (app: AppMetadata) => void;
  className?: string;
}

export function AppCard({
  app,
  onLaunch,
  onToggleFavorite,
  onViewDetails,
  className,
}: AppCardProps) {
  const router = useRouter();
  const Icon = APP_ICON_MAP[app.iconName] ?? Grid3x3;
  
  // Get phase - support both new and legacy fields
  const phase: Phase = (app.phase || app.transformationArea || 'OPERATE') as Phase;
  const phaseColor = phaseColorMap[phase];
  const phaseHoverColor = getPhaseHoverColor(phase);
  const phaseLabel = phaseLabels[phase] || phase;
  
  // Status handling
  const isDisabled = 
    app.status === 'coming-soon' || 
    app.status === 'preview' ||
    app.access === 'Requires Upgrade';
  
  const isFavorite = app.isFavorited ?? app.isFavorite ?? false;
  
  // Get status label
  const getStatusLabel = () => {
    if (app.status === 'coming-soon') return 'Coming soon';
    if (app.status === 'preview') return 'Preview';
    if (app.status === 'beta') return 'Beta';
    if (app.status === 'funder-only') return 'Funder-only';
    if (app.access === 'Requires Upgrade') return 'Request access';
    return 'Launch';
  };

  const handleLaunch = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDisabled) return;
    if (onLaunch) {
      onLaunch(app);
    } else {
      const route = app.route || app.launchPath;
        if (route) {
          router.push(route as Route);
        }
      }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(app.id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.(app);
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-lg border bg-white p-6 transition-all',
        'hover:shadow-md',
        isDisabled && 'opacity-60',
        className
      )}
      style={{
        borderColor: '#E2E8F0',
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.borderColor = phaseColor;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E2E8F0';
      }}
    >
      {/* Top Row: Phase Tag (left) + Favorite (right) */}
      <div className="mb-4 flex items-start justify-between">
        {/* Phase Tag (top-left) */}
        <span
          className="rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide"
          style={{
            backgroundColor: `${phaseColor}15`, // 15% opacity
            color: phaseColor,
          }}
        >
          {phaseLabel.toUpperCase().replace(/\s+/g, ' ')}
        </span>

        {/* Favorite Icon (top-right) */}
        <button
          onClick={handleFavorite}
          className={cn(
            'flex items-center justify-center rounded p-1 transition-colors',
            'hover:bg-[#F1F5F9]',
            isFavorite && 'text-[#C2410C]'
          )}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={isFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Favorite this app'}
        >
          <Star
            size={16}
            className={cn(
              'transition-all',
              isFavorite 
                ? `fill-[${phaseColor}] text-[${phaseColor}]` 
                : 'text-[#64748B]'
            )}
            style={isFavorite ? { fill: phaseColor, color: phaseColor } : undefined}
          />
        </button>
      </div>

      {/* Icon Circle (centered) */}
      <div className="mb-4 flex justify-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            backgroundColor: phaseColor,
          }}
        >
          <Icon size={28} className="text-white" />
        </div>
      </div>

      {/* App Name (centered) */}
      <h3 className="mb-1 text-center text-lg font-bold text-[#1F2937]">
        {app.name}
      </h3>

      {/* Category Line (centered) */}
      <p className="mb-3 text-center text-xs text-[#64748B]">
        {app.category}
      </p>

      {/* Description (centered, 1-2 lines) */}
      <p className="mb-4 text-center text-sm text-[#64748B] leading-relaxed line-clamp-2">
        {app.description}
      </p>

      {/* Status Chip (optional, under description) */}
      {(app.status === 'beta' || app.status === 'coming-soon' || app.status === 'preview' || app.status === 'funder-only') && (
        <div className="mb-4 flex justify-center">
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
              app.status === 'beta' && 'border border-[#C2410C] text-[#C2410C] bg-[#FFEDD5]',
              app.status === 'coming-soon' && 'border border-[#64748B] text-[#64748B] bg-[#F1F5F9]',
              app.status === 'preview' && 'border border-[#2563EB] text-[#2563EB] bg-[#DBEAFE]',
              app.status === 'funder-only' && 'border border-[#6D28D9] text-[#6D28D9] bg-[#EDE9FE]'
            )}
          >
            {app.status === 'beta' && 'Beta'}
            {app.status === 'coming-soon' && 'Coming soon'}
            {app.status === 'preview' && 'Preview'}
            {app.status === 'funder-only' && 'Funder-only'}
          </span>
        </div>
      )}

      {/* Action Row (bottom) */}
      <div className="mt-auto space-y-2 pt-4 border-t border-[#E2E8F0]">
        {/* Launch Button - MUST match phase accent color */}
        <button
          onClick={handleLaunch}
          disabled={isDisabled}
          className={cn(
            'w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all',
            'hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50',
            'focus:outline-none focus:ring-2 focus:ring-offset-2'
          )}
          style={
            isDisabled
              ? { backgroundColor: '#94A3B8' }
              : {
                  backgroundColor: phaseColor,
                  '--hover-color': phaseHoverColor,
                } as React.CSSProperties & { '--hover-color': string }
          }
          onMouseEnter={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = phaseHoverColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = phaseColor;
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 2px ${phaseColor}40`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isDisabled ? (
            <span className="flex items-center justify-center gap-2">
              <Lock size={14} />
              {getStatusLabel()}
            </span>
          ) : (
            getStatusLabel()
          )}
        </button>

        {/* Optional: View Details Link */}
        {onViewDetails && (
          <button
            onClick={handleViewDetails}
            className="w-full text-center text-xs font-medium text-[#0047AB] hover:text-[#1E3A8A] transition-colors"
          >
            View details
          </button>
        )}
      </div>
    </div>
  );
}
