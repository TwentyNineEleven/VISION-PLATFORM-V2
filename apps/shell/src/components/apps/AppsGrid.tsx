'use client';

/**
 * AppsGrid Component
 * 
 * Purely responsible for rendering app cards in a grid/list layout.
 * 
 * Desktop: 3-4 cards per row
 * Tablet: 2 per row
 * Mobile: 1 per row
 * 
 * Uses standardized AppCatalogCard component.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { AppMetadata } from '@/lib/app-catalog-types';
import { AppCatalogCard } from './AppCatalogCard';

export interface AppsGridProps {
  apps: AppMetadata[];
  viewMode?: 'GRID' | 'LIST';
  onLaunch?: (app: AppMetadata) => void;
  onToggleFavorite?: (appId: string) => void;
  onViewDetails?: (app: AppMetadata) => void;
  className?: string;
}

export function AppsGrid({
  apps,
  viewMode = 'GRID',
  onLaunch,
  onToggleFavorite,
  onViewDetails,
  className,
}: AppsGridProps) {
  if (apps.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="mb-2 text-lg font-semibold text-foreground">
          No apps match these filters
        </p>
        <p className="text-sm text-muted-foreground">
          Try clearing filters or adjusting your search.
        </p>
      </div>
    );
  }

  if (viewMode === 'LIST') {
    return (
      <div className={cn('space-y-4', className)}>
        {apps.map((app) => (
          <AppCatalogCard
            key={app.id}
            app={app}
            onLaunch={onLaunch}
            onToggleFavorite={onToggleFavorite}
            onViewDetails={onViewDetails}
            className="h-auto"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {apps.map((app) => (
        <AppCatalogCard
          key={app.id}
          app={app}
          onLaunch={onLaunch}
          onToggleFavorite={onToggleFavorite}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

