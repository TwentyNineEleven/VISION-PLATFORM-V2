'use client';

import type { AppMetadata } from '@/lib/app-catalog-types';
import { cn } from '@/lib/utils';
import { AppCardShell } from './AppCardShell';

export interface AppCatalogCardProps {
  app: AppMetadata;
  onLaunch?: (app: AppMetadata) => void;
  onToggleFavorite?: (appId: string) => void;
  onViewDetails?: (app: AppMetadata) => void;
  className?: string;
}

export function AppCatalogCard({
  app,
  onLaunch,
  onToggleFavorite,
  onViewDetails,
  className,
}: AppCatalogCardProps) {
  return (
    <AppCardShell
      app={app}
      onLaunch={onLaunch}
      onToggleFavorite={onToggleFavorite}
      onViewDetails={onViewDetails}
      showDescription
      showStatusChip={false}
      iconSize="md"
      buttonSize="md"
      className={cn('h-[340px]', className)}
    />
  );
}
