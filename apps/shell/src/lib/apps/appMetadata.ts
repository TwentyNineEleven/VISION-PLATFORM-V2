/**
 * App Metadata Registry
 *
 * Provides a shared source of truth for app information across the platform.
 * Uses the Glow UI + 2911 Bold Color System (phase colors come from phase-colors.ts).
 */

import { APP_CATALOG_DATA } from '@/lib/app-catalog-data';
import { phaseColorMap, phaseLabels, phaseSoftColorMap, type Phase } from '@/lib/phase-colors';
import type { AppMetadata } from '@/lib/app-catalog-types';

export type { Phase };

export const appMetadata: Record<string, AppMetadata> = APP_CATALOG_DATA.reduce(
  (acc, app) => {
    acc[app.id] = app;
    return acc;
  },
  {} as Record<string, AppMetadata>
);

export const appMetadataList = APP_CATALOG_DATA;

export function getAppMeta(appId: string): AppMetadata | undefined {
  return appMetadata[appId];
}

export function getPhaseColor(phase: Phase): string {
  return phaseColorMap[phase];
}

export function getPhaseSoftColor(phase: Phase): string {
  return phaseSoftColorMap[phase];
}

export function getPhaseLabel(phase: Phase): string {
  return phaseLabels[phase];
}

