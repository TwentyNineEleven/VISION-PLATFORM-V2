'use client';

import * as React from 'react';
import { getAppMeta, type Phase } from '@/lib/apps/appMetadata';
import { getPhaseTokenClasses } from '@/lib/phase-colors';
import { cn } from '@/lib/utils';
import {
  MapPin,
  Users,
  Lightbulb,
  Network,
  Rocket,
  Settings,
  FileText,
  BarChart3,
  Sparkles,
  Zap,
  Grid3x3,
  type LucideIcon,
} from 'lucide-react';

/**
 * AppIcon Component - Centralized Icon System
 * 
 * This component ensures consistent app icons across:
 * - Dashboard (Recent Apps, Favorites, Recommendations)
 * - App Catalog
 * - All app references throughout the platform
 * 
 * Icons are mapped to app IDs and use phase-based colors from the 2911 Bold Color System.
 */

// Icon mapping - maps iconName to Lucide icon component
// In production, this would use actual SVG exports from Figma
const iconMap: Record<string, LucideIcon> = {
  // VOICE Phase
  'community-compass': MapPin,
  'stakeholdr': Users,
  
  // INSPIRE Phase
  'visionverse': Lightbulb,
  
  // STRATEGIZE Phase
  'pathwaypro': Network,
  'thinkgrid': Grid3x3,
  'architex': Settings,
  
  // INITIATE Phase
  'launchpath': Rocket,
  
  // OPERATE Phase
  'ops360': Zap,
  'metricmap': BarChart3,
  'capacityiq': BarChart3,
  
  // NARRATE Phase
  'fundingframer': FileText,
  'narrateiq': Sparkles,
  
  // Default fallback
  'default': Grid3x3,
};

export interface AppIconProps {
  appId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBackground?: boolean;
}

const sizeMap = {
  sm: {
    container: 'h-8 w-8',
    icon: 16,
  },
  md: {
    container: 'h-10 w-10',
    icon: 20,
  },
  lg: {
    container: 'h-12 w-12',
    icon: 24,
  },
} as const;

export function AppIcon({ appId, size = 'md', className, showBackground = true }: AppIconProps) {
  const appMeta = getAppMeta(appId);

  // If app not found, use default
  if (!appMeta) {
    const DefaultIcon = iconMap.default;
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full transition-colors',
          sizeMap[size].container,
          showBackground ? 'bg-vision-gray-100 text-vision-gray-700' : 'bg-transparent text-vision-gray-700',
          className
        )}
        title="Unknown app"
        aria-label="Unknown app icon"
      >
        <DefaultIcon size={sizeMap[size].icon} className="flex-shrink-0" />
      </div>
    );
  }

  const Icon = iconMap[appMeta.iconName] || iconMap.default;
  // Use Bold Color System tokens via getPhaseTokenClasses
  const phaseClasses = getPhaseTokenClasses(appMeta.phase);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full transition-colors',
        sizeMap[size].container,
        showBackground ? phaseClasses.iconBackground : 'bg-transparent',
        phaseClasses.iconText,
        className
      )}
      title={appMeta.name}
      aria-label={`${appMeta.name} icon`}
    >
      <Icon size={sizeMap[size].icon} className="flex-shrink-0" />
    </div>
  );
}

/**
 * Helper component for phase-based icon (when you only have phase, not appId)
 */
export interface PhaseIconProps {
  phase: Phase;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PhaseIcon({ phase, size = 'md', className }: PhaseIconProps) {
  // Use Bold Color System tokens via getPhaseTokenClasses
  const phaseClasses = getPhaseTokenClasses(phase);
  const Icon = iconMap.default; // Use default icon for phase-only

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full',
        sizeMap[size].container,
        phaseClasses.iconBackground,
        phaseClasses.iconText,
        className
      )}
    >
      <Icon size={sizeMap[size].icon} className="flex-shrink-0" />
    </div>
  );
}

