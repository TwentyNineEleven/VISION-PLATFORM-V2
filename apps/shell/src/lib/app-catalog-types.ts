/**
 * App Catalog & App Launcher - Type Definitions
 * 
 * Complete metadata model for VISION Platform apps
 * Used by both App Catalog page and App Launcher modal
 */

import type React from 'react';
import type { Phase } from './phase-colors';

// ============================================================================
// APP METADATA MODEL
// ============================================================================

export type TransformationArea = Phase;

export type UseCase = 
  | 'Planning' 
  | 'Funding' 
  | 'Operations' 
  | 'Evaluation' 
  | 'Funder';

export type AppStatus = 
  | 'available' 
  | 'preview' 
  | 'beta' 
  | 'coming-soon' 
  | 'funder-only';

export type AccessLevel = 
  | 'Included' 
  | 'Requires Upgrade';

export type SortOption = 
  | 'Most Relevant' 
  | 'A → Z' 
  | 'Most Used' 
  | 'Newest';

export type Audience = 'Funder' | 'Organization' | 'Consultant' | 'Multi';

export interface AppMetadata {
  id: string;
  slug: string;
  name: string;
  phase: Phase;
  category: string;
  description: string;
  iconName: string;
  shortDescription?: string;
  status: AppStatus;
  route: string;
  launchPath?: string;
  onboardingPath?: string;
  isFavorited?: boolean;
  isFavorite?: boolean;
  audiences?: Audience[];
  focusTags?: string[];
  connectedApps?: string[];
  lastUsed?: Date;
  usageCount?: number;
  access?: AccessLevel;
  timeToComplete?: string;
  bestForRoles?: string[];
  transformationArea?: Phase;
}

// ============================================================================
// FILTER STATE
// ============================================================================

export interface AppCatalogFilters {
  searchQuery: string;
  phase: Phase | 'All';
  audience: Audience | 'All';
  focusTags: string[]; // Multi-select
  sortBy: SortOption;
}

// ============================================================================
// APP LAUNCHER STATE
// ============================================================================

export interface AppLauncherState {
  isOpen: boolean;
  searchQuery: string;
  selectedAppId?: string;
}

// ============================================================================
// APP DETAIL DRAWER STATE
// ============================================================================

export interface AppDetailDrawerState {
  isOpen: boolean;
  appId?: string;
}
