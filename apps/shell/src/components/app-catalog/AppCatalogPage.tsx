'use client';

/**
 * VISION Apps Catalog Page
 * 
 * Complete app catalog following exact structure:
 * 1. Page Header
 * 2. Filters Panel
 * 3. App Grid
 * 4. Empty State (if no results)
 * 
 * Uses Glow UI patterns and 2911 Bold Color System.
 * CRITICAL: Launch button color = Icon color = Phase accent color
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { AppMetadata, AppCatalogFilters, SortOption, Audience } from '@/lib/app-catalog-types';
import { AppCatalogCard } from '@/components/apps/AppCatalogCard';
import { FiltersBar } from './FiltersBar';
import { AppDetailDrawer } from './AppDetailDrawer';

const SORT_OPTIONS: SortOption[] = [
  'Most Relevant',
  'A → Z',
  'Most Used',
  'Newest',
];

export interface AppCatalogPageProps {
  apps: AppMetadata[];
  onLaunchApp?: (app: AppMetadata) => void;
  onToggleFavorite?: (appId: string) => void;
}

export function AppCatalogPage({
  apps,
  onLaunchApp,
  onToggleFavorite,
}: AppCatalogPageProps) {
  const [filters, setFilters] = React.useState<AppCatalogFilters>({
    searchQuery: '',
    phase: 'All',
    audience: 'All',
    focusTags: [],
    sortBy: 'Most Relevant',
  });

  const [selectedApp, setSelectedApp] = React.useState<AppMetadata | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Extract all unique focus tags from apps
  const availableFocusTags = React.useMemo(() => {
    const tags = new Set<string>();
    apps.forEach((app) => {
      app.focusTags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [apps]);

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.phase !== 'All') count++;
    if (filters.audience !== 'All') count++;
    if (filters.focusTags.length > 0) count++;
    return count;
  }, [filters]);

  // Filter and sort apps
  const filteredApps = React.useMemo(() => {
    let result = [...apps];

    // Search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          (app.phase && app.phase.toLowerCase().includes(query)) ||
          (app.category && app.category.toLowerCase().includes(query)) ||
          app.focusTags?.some((tag) => tag.toLowerCase().includes(query)) ||
          app.audiences?.some((aud) => aud.toLowerCase().includes(query))
      );
    }

    // Phase filter
    if (filters.phase !== 'All') {
      result = result.filter((app) => {
        const appPhase = app.phase || app.transformationArea;
        return appPhase === filters.phase;
      });
    }

    // Audience filter
    if (filters.audience !== 'All') {
      const audienceFilter = filters.audience as Audience;
      result = result.filter((app) => app.audiences?.includes(audienceFilter));
    }

    // Focus tags filter (multi-select)
    if (filters.focusTags.length > 0) {
      result = result.filter((app) =>
        filters.focusTags.some((tag) => app.focusTags?.includes(tag))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'A → Z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Most Used':
        result.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
        break;
      case 'Newest':
        result.sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0));
        break;
      case 'Most Relevant':
      default:
        // Keep original order (could be enhanced with relevance scoring)
        break;
    }

    return result;
  }, [apps, filters]);

  const handleViewDetails = (app: AppMetadata) => {
    setSelectedApp(app);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-[#1F2937]">
          VISION Apps
        </h1>
        <p className="text-lg text-[#64748B]">
          Browse every tool in the platform, filter by phase or audience, and launch with one click.
        </p>
      </div>

      {/* 2. Filters Panel */}
      <div className="mb-8">
        <FiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          availableFocusTags={availableFocusTags}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {/* Sort Dropdown (optional, above grid) */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-[#64748B]">
          {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}
        </div>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))
          }
          className="rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#1F2937] focus:border-[#0047AB] focus:outline-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* 3. App Grid */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredApps.map((app) => (
            <AppCatalogCard
              key={app.id}
              app={app}
              onLaunch={onLaunchApp}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        /* 4. Empty State */
        <div className="flex flex-col items-center justify-center rounded-lg border border-[#E2E8F0] bg-white p-12 text-center">
          <p className="mb-2 text-lg font-semibold text-[#1F2937]">
            No apps match these filters
          </p>
          <p className="text-sm text-[#64748B]">
            Try clearing filters or adjusting your search.
          </p>
        </div>
      )}

      {/* App Detail Drawer */}
      <AppDetailDrawer
        app={selectedApp}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onLaunch={onLaunchApp}
      />
    </div>
  );
}
