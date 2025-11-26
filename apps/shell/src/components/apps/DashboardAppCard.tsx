'use client';

import type { AppMetadata } from '@/lib/app-catalog-types';
import { cn } from '@/lib/utils';
import { AppCardShell } from './AppCardShell';

export interface DashboardAppCardProps {
  app: AppMetadata;
  onLaunch?: (app: AppMetadata) => void;
  onToggleFavorite?: (appId: string) => void;
  className?: string;
  showStatusChip?: boolean;
}

export function DashboardAppCard({
  app,
  onLaunch,
  onToggleFavorite,
  className,
  showStatusChip = false,
}: DashboardAppCardProps) {
  return (
    <AppCardShell
      app={app}
      onLaunch={onLaunch}
      onToggleFavorite={onToggleFavorite}
      showDescription={false}
      showStatusChip={showStatusChip || app.status === 'coming-soon'}
      iconSize="sm"
      buttonSize="sm"
      className={cn('min-h-[240px]', className)}
    />
  );
}
