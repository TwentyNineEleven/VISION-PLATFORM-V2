'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { GlowCard, GlowBadge, GlowButton, GlowInput, Grid, Stack } from '../glow-ui';
import {
  Search,
  Grid3x3,
  List,
  ArrowUpDown,
} from 'lucide-react';
import { APP_MODULES, APP_CATEGORIES, type AppModuleKey, type AppCategory as RegistryCategory } from '@/lib/vision-apps';
import { moduleColors, moduleSoftColors } from '@/lib/vision-theme';
import { moduleShortLabel } from '@/lib/module-utils';
import { AppCard } from '@/components/AppCard';
import { mapAppToCardProps } from '@/lib/app-card';

export type AppStatus = 'active' | 'coming-soon' | 'restricted' | 'available' | 'beta';
export type AppCategory = RegistryCategory;

export interface App {
  id: string;
  slug?: string;
  name: string;
  moduleKey: AppModuleKey;
  moduleLabel: string;
  primaryCategory: AppCategory;
  categories?: AppCategory[];
  description: string;
  shortDescription?: string;
  icon?: React.ComponentType<{ size?: number | string }>;
  status: AppStatus;
  badge?: string;
  badgeVariant?: 'success' | 'warning' | 'info';
  isFavorite?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  launchPath?: string;
  onboardingPath?: string;
  transformationArea?: string;
  audience?: string;
  lastUsed?: Date;
  popularity?: number;
  phase?: string;
  priceLabel?: string;
  category?: string;
}

export type SortOption = 'name' | 'recent' | 'popular';
type ViewMode = 'grid' | 'list';

export interface AppLauncherProps {
  apps: App[];
  onLaunchApp?: (app: App) => void;
  onRequestAccess?: (app: App) => void;
  onToggleFavorite?: (appId: string) => void;
  layout?: ViewMode;
  defaultCategory?: AppCategory | 'all';
  defaultModule?: AppModuleKey | 'all';
  showCategoryFilters?: boolean;
}

export function AppLauncher({
  apps,
  onLaunchApp,
  onToggleFavorite,
  layout: initialLayout = 'grid',
  defaultCategory = 'all',
  defaultModule = 'all',
  showCategoryFilters = true,
}: AppLauncherProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<AppCategory | 'all'>(defaultCategory);
  const [selectedModule, setSelectedModule] = React.useState<AppModuleKey | 'all'>(defaultModule);
  const [layout, setLayout] = React.useState<ViewMode>(initialLayout);
  const [sortBy, setSortBy] = React.useState<SortOption>('name');

  const moduleCounts = React.useMemo(() => {
    const base = APP_MODULES.reduce<Record<AppModuleKey, number>>((acc, module) => {
      acc[module.key] = 0;
      return acc;
    }, {} as Record<AppModuleKey, number>);
    apps.forEach((app) => {
      base[app.moduleKey] = (base[app.moduleKey] || 0) + 1;
    });
    return base;
  }, [apps]);

  const moduleFilters = React.useMemo(
    () => [
      { key: 'all' as const, label: 'All Apps', count: apps.length },
      ...APP_MODULES.map((module) => ({
        key: module.key,
        label: moduleShortLabel[module.key],
        count: moduleCounts[module.key] || 0,
      })),
    ],
    [apps.length, moduleCounts]
  );

  const appsByModule = React.useMemo(
    () => (selectedModule === 'all' ? apps : apps.filter((app) => app.moduleKey === selectedModule)),
    [apps, selectedModule]
  );

  const categoryFilters = React.useMemo(() => {
    const counts: Record<AppCategory, number> = {
      'Capacity Building': 0,
      'Program Management': 0,
      Fundraising: 0,
      'Impact Measurement': 0,
    };
    appsByModule.forEach((app) => {
      const uniques = new Set<AppCategory>([app.primaryCategory, ...(app.categories || [])]);
      uniques.forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return [
      { value: 'all' as const, label: 'All Categories', count: appsByModule.length },
      ...APP_CATEGORIES.map((category) => ({
        value: category,
        label: category,
        count: counts[category] || 0,
      })),
    ];
  }, [appsByModule]);

  const filteredApps = React.useMemo(() => {
    let filtered = appsByModule;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (app) => app.primaryCategory === selectedCategory || app.categories?.includes(selectedCategory)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          app.shortDescription?.toLowerCase().includes(query)
      );
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === 'recent') {
        return (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0);
      }
      if (sortBy === 'popular') {
        const score = (app: App) =>
          (app.popularity || 0) + (app.isFavorite ? 10 : 0) + (app.isPopular ? 20 : 0);
        return score(b) - score(a);
      }
      return a.name.localeCompare(b.name);
    });
  }, [appsByModule, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 max-w-xl">
          <GlowInput
            variant="glow"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 shadow-ambient-card">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-sm text-foreground focus:outline-none"
            >
              <option value="name">Name</option>
              <option value="recent">Recently used</option>
              <option value="popular">Most popular</option>
            </select>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-input bg-card p-1 shadow-ambient-card">
            <button
              onClick={() => setLayout('grid')}
              className={cn(
                'flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all',
                layout === 'grid'
                  ? 'bg-primary text-primary-foreground shadow-glow-primary-sm'
                  : 'text-muted-foreground hover:bg-accent'
              )}
            >
              <Grid3x3 className="h-4 w-4" />
              Grid
            </button>
            <button
              onClick={() => setLayout('list')}
              className={cn(
                'flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all',
                layout === 'list'
                  ? 'bg-primary text-primary-foreground shadow-glow-primary-sm'
                  : 'text-muted-foreground hover:bg-accent'
              )}
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {moduleFilters.map((module) => {
            const isActive = selectedModule === module.key;
            const isAll = module.key === 'all';
            const color = isAll ? '#2D2D2D' : moduleColors[module.key as AppModuleKey];
            const soft = isAll ? 'rgba(0,0,0,0.05)' : moduleSoftColors[module.key as AppModuleKey];
            return (
              <button
                key={module.key}
                onClick={() => {
                  setSelectedModule(module.key);
                  setSelectedCategory('all');
                }}
                className={cn(
                  'relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all',
                  isActive ? 'shadow-ambient-card-hover' : 'border border-border bg-card hover:border-muted-foreground/40'
                )}
                style={isActive ? { backgroundColor: soft, color } : undefined}
              >
                <span>{module.label}</span>
                <span className="text-xs text-muted-foreground">({module.count})</span>
                {!isAll && (
                  <span
                    className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full"
                    style={{ backgroundColor: color, opacity: 0.75 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {showCategoryFilters && (
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
                  selectedCategory === category.value
                    ? 'border-muted-foreground bg-muted text-foreground shadow-ambient-card'
                    : 'border-transparent bg-card hover:border-border hover:bg-muted/60'
                )}
              >
                <span>{category.label}</span>
                <span className="text-[11px] text-muted-foreground">({category.count})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredApps.length > 0 ? (
        layout === 'grid' ? (
          <Grid columns={4} gap="lg">
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                {...mapAppToCardProps(app)}
                onLaunch={() => onLaunchApp?.(app)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </Grid>
        ) : (
          <Stack spacing="md">
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                {...mapAppToCardProps(app)}
                className="w-full"
                onLaunch={() => onLaunchApp?.(app)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </Stack>
        )
      ) : (
        <GlowCard variant="flat" padding="lg" className="text-center">
          <div className="flex flex-col items-center gap-3">
            <Search className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-base font-semibold text-foreground">No applications found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your module or category filters or update the search query.
              </p>
            </div>
          </div>
        </GlowCard>
      )}
    </div>
  );
}
