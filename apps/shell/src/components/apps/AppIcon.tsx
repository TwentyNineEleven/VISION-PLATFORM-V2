'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { AppMetadata } from '@/lib/app-catalog-types';
import { getPhaseColor } from '@/lib/apps/appMetadata';
import {
  MapPin,
  Users,
  Lightbulb,
  Network,
  Settings,
  Rocket,
  Zap,
  BarChart3,
  FileText,
  Sparkles,
  Grid3x3,
  Scale,
  Coins,
  Calculator,
  type LucideIcon,
} from 'lucide-react';

type AppIconSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<AppIconSize, { container: string; icon: number }> = {
  sm: { container: 'h-10 w-10', icon: 18 },
  md: { container: 'h-14 w-14', icon: 24 },
  lg: { container: 'h-16 w-16', icon: 28 },
};

export const APP_ICON_MAP: Record<string, LucideIcon> = {
  'community-compass': MapPin,
  stakeholdr: Users,
  visionverse: Lightbulb,
  pathwaypro: Network,
  architex: Settings,
  thinkgrid: Grid3x3,
  launchpath: Rocket,
  ops360: Zap,
  metricmap: BarChart3,
  capacityiq: BarChart3,
  fundingframer: FileText,
  narrateiq: Sparkles,
  equiframe: Scale,
  fundflo: Coins,
  fundgrid: Calculator,
};

interface AppIconProps {
  app: AppMetadata;
  size?: AppIconSize;
  className?: string;
  showBackground?: boolean;
}

export function AppIcon({ app, size = 'md', className, showBackground = true }: AppIconProps) {
  const iconSize = SIZE_MAP[size];
  const Icon = APP_ICON_MAP[app.iconName] ?? Grid3x3;
  const phaseColor = getPhaseColor(app.phase);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full shadow-ambient-card',
        iconSize.container,
        className
      )}
      style={{
        backgroundColor: showBackground ? phaseColor : 'transparent',
        color: showBackground ? '#FFFFFF' : phaseColor,
      }}
      aria-label={`${app.name} icon`}
      title={app.name}
    >
      <Icon size={iconSize.icon} />
    </div>
  );
}

export default AppIcon;
