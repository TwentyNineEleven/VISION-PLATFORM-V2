'use client';

/**
 * VISION Apps Catalog Page
 * 
 * Refactored to use:
 * - PageHero (standardized hero)
 * - AppsFilterBar (compact, sticky filter bar)
 * - AppsAdvancedFilters (collapsible drawer/panel)
 * - AppsGrid (app cards rendering)
 * 
 * Layout:
 * 1. Hero (fixed height)
 * 2. Filter Bar (sticky)
 * 3. Apps Grid (scrollable)
 * 
 * Only the apps grid scrolls; hero and filter bar stay anchored.
 */

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { AppsFilterBar } from '@/components/apps/AppsFilterBar';
import { AppsAdvancedFilters } from '@/components/apps/AppsAdvancedFilters';
import { AppsGrid } from '@/components/apps/AppsGrid';
import { AppDetailDrawer } from '@/components/app-catalog/AppDetailDrawer';
import { GlowButton } from '@/components/glow-ui';
import { useAppShell } from '@/components/layout/AppShell';
import { APP_CATALOG_DATA } from '@/lib/app-catalog-data';
import type { AppMetadata, AppCatalogFilters, SortOption } from '@/lib/app-catalog-types';
import { favoritesService } from '@/services/favoritesService';

function buildApplicationsCtas(deps: {
  openAppLauncher: () => void;
  navigate: (path: string) => void;
}) {
  return {
    onAskVisionAI: () => deps.openAppLauncher(),
    onViewAppUsage: () => deps.navigate('/applications/usage'),
  };
}

export default function ApplicationsPage() {
  const { openAppLauncher } = useAppShell();
  const router = useRouter();
  const { onAskVisionAI, onViewAppUsage } = React.useMemo(
    () => buildApplicationsCtas({ openAppLauncher, navigate: (path) => router.push(path as any) }),
    [openAppLauncher, router]
  );
  const [filters, setFilters] = React.useState<AppCatalogFilters>({
    searchQuery: '',
    phase: 'All',
    audience: 'All',
    focusTags: [],
    sortBy: 'Most Relevant',
  });
  const [viewMode, setViewMode] = React.useState<'GRID' | 'LIST'>('GRID');
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = React.useState(false);
  const [selectedApp, setSelectedApp] = React.useState<AppMetadata | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>([]);

  // Load favorites on mount
  React.useEffect(() => {
    const favorites = favoritesService.getFavorites();
    setFavoriteIds(favorites);
  }, []);

  // Detect mobile (using lg breakpoint: 1024px)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract all unique focus tags from apps
  const availableFocusTags = React.useMemo(() => {
    const tags = new Set<string>();
    APP_CATALOG_DATA.forEach((app) => {
      app.focusTags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.phase !== 'All') count++;
    if (filters.focusTags.length > 0) count++;
    return count;
  }, [filters]);

  // Filter and sort apps (with favorites status)
  const filteredApps = React.useMemo(() => {
    // Merge favorite status with app data
    let result = APP_CATALOG_DATA.map((app) => ({
      ...app,
      isFavorite: favoriteIds.includes(app.id),
      isFavorited: favoriteIds.includes(app.id), // Support both property names
    }));

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
  }, [filters, favoriteIds]);

  const handleLaunchApp = (app: AppMetadata) => {
    if (app.launchPath) {
      window.location.href = app.launchPath;
    } else if (app.route) {
      window.location.href = app.route;
    }
  };

  const handleToggleFavorite = (appId: string) => {
    // Toggle favorite in localStorage
    const newIsFavorite = favoritesService.toggleFavorite(appId);

    // Update local state to reflect the change
    setFavoriteIds((prev) => {
      if (newIsFavorite) {
        return [...prev, appId];
      } else {
        return prev.filter((id) => id !== appId);
      }
    });
  };

  const handleViewDetails = (app: AppMetadata) => {
    setSelectedApp(app);
    setIsDrawerOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* 1. Hero Section */}
      <div className="mb-6">
        <PageHero
          title="VISION Apps"
          subtitle="Browse every tool in the platform, filter by domain or audience, and launch with one click."
          primaryAction={
              <GlowButton
                variant="default"
                size="default"
                onClick={onAskVisionAI}
                rightIcon={<Sparkles className="h-4 w-4" />}
              >
                Ask VISION AI
            </GlowButton>
          }
          secondaryAction={
              <GlowButton
                variant="ghost"
                size="default"
                onClick={onViewAppUsage}
              >
                View app usage
              </GlowButton>
          }
        />
      </div>

      {/* 2. Filter Bar (sticky) */}
      <div className="mb-6">
        <AppsFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          activeFilterCount={activeFilterCount}
          filteredAppCount={filteredApps.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onToggleAdvancedFilters={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
          isAdvancedFiltersOpen={isAdvancedFiltersOpen}
        />
      </div>

      {/* 3. Advanced Filters Panel (collapsible) */}
      {isAdvancedFiltersOpen && (
        <div className="mb-6">
          <AppsAdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableFocusTags={availableFocusTags}
            isOpen={isAdvancedFiltersOpen}
            onClose={() => setIsAdvancedFiltersOpen(false)}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* 4. Apps Grid (scrollable) */}
      <div className="mt-6 pb-6">
        <AppsGrid
          apps={filteredApps}
          viewMode={viewMode}
          onLaunch={handleLaunchApp}
          onToggleFavorite={handleToggleFavorite}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* App Detail Drawer */}
      <AppDetailDrawer
        app={selectedApp}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onLaunch={handleLaunchApp}
      />
    </div>
  );
}

