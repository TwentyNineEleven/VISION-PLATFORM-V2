'use client';

import * as React from 'react';
import {
  GlowBadge,
  GlowButton,
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowInput,
  Grid,
} from '@/components/glow-ui';
import { AppCard } from '@/components/AppCard';
import {
  AppAudience,
  VISION_APP_AUDIENCES,
  APP_MODULES,
  type AppModuleKey,
} from '@/lib/vision-apps';
import {
  Filter,
  RefreshCcw,
  Search,
  List,
  LayoutGrid,
  ArrowUpDown,
} from 'lucide-react';
import Link from 'next/link';
import { mockApps } from '@/lib/mock-data';
import { mapAppToCardProps } from '@/lib/app-card';

type PhaseFilter = AppModuleKey | 'all';
type AudienceFilter = AppAudience | 'all';
type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'phase' | 'status';

export default function AppsPage() {
  const [searchInput, setSearchInput] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [phaseFilter, setPhaseFilter] = React.useState<PhaseFilter>('all');
  const [audienceFilter, setAudienceFilter] =
    React.useState<AudienceFilter>('all');
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const [sortBy, setSortBy] = React.useState<SortOption>('name');
  const [favoriteState, setFavoriteState] = React.useState<Record<string, boolean>>(
    () =>
      mockApps.reduce<Record<string, boolean>>((acc, app) => {
        acc[app.id] = !!app.isFavorite;
        return acc;
      }, {})
  );

  React.useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const transformationAreas = React.useMemo(() => {
    const areas = mockApps
      .map((app) => app.transformationArea)
      .filter(
      Boolean
      ) as string[];
    return Array.from(new Set(areas));
  }, []);
  const [areaFilter, setAreaFilter] = React.useState<string | 'all'>('all');

  const filteredApps = React.useMemo(
    () => {
      const query = searchQuery.toLowerCase();
      return mockApps.filter((app) => {
        const shortDescription = app.shortDescription?.toLowerCase() ?? '';
        const matchesSearch =
          app.name.toLowerCase().includes(query) ||
          shortDescription.includes(query) ||
          app.description.toLowerCase().includes(query);
        const matchesPhase =
          phaseFilter === 'all' || app.moduleKey === phaseFilter;
        const matchesAudience =
          audienceFilter === 'all' || app.audience === audienceFilter;
        const matchesArea =
          areaFilter === 'all' || app.transformationArea === areaFilter;

        return matchesSearch && matchesPhase && matchesAudience && matchesArea;
      });
    },
    [areaFilter, audienceFilter, phaseFilter, searchQuery]
  );

  const sortedApps = React.useMemo(() => {
    const next = [...filteredApps];
    next.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'phase') return a.moduleLabel.localeCompare(b.moduleLabel);
      if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '');
      return 0;
    });
    return next;
  }, [filteredApps, sortBy]);

  const resetFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setPhaseFilter('all');
    setAudienceFilter('all');
    setAreaFilter('all');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <GlowBadge variant="info" size="sm">
          Platform launcher
        </GlowBadge>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold leading-tight text-foreground">
              VISION Apps
            </h1>
            <p className="text-muted-foreground">
              Browse every tool in the platform, filter by phase or audience,
              and launch with one click.
            </p>
          </div>
          <div className="flex gap-2">
            <GlowBadge variant="outline" size="sm">
              {mockApps.length} apps
            </GlowBadge>
            <GlowBadge variant="success" size="sm">
              {mockApps.filter((app) => app.status !== 'coming-soon').length}{' '}
              ready
            </GlowBadge>
          </div>
        </div>
      </div>

      <GlowCard variant="default">
        <GlowCardHeader className="gap-2">
          <GlowCardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Filter className="h-4 w-4" />
            Filters
          </GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent className="space-y-4 pt-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full max-w-xl">
              <GlowInput
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by app or description"
                variant="glow"
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <GlowButton variant="ghost" size="sm" onClick={resetFilters}>
                <RefreshCcw className="h-4 w-4" />
                Reset
              </GlowButton>
              <div className="flex items-center gap-2 rounded-md border border-border px-2 py-1">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-sm text-foreground focus:outline-none"
                >
                  <option value="name">Sort by Name</option>
                  <option value="phase">Sort by Phase</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
              <div className="flex items-center gap-1 rounded-md border border-border p-1">
                <GlowButton
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  glow={viewMode === 'grid' ? 'subtle' : 'none'}
                >
                  <LayoutGrid className="h-4 w-4" />
                </GlowButton>
                <GlowButton
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  glow={viewMode === 'list' ? 'subtle' : 'none'}
                >
                  <List className="h-4 w-4" />
                </GlowButton>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Phase
              </span>
              <div className="flex flex-wrap gap-2">
                <FilterPill
                  selected={phaseFilter === 'all'}
                  onClick={() => setPhaseFilter('all')}
                  label="All phases"
                />
                {APP_MODULES.map((phase) => (
                  <FilterPill
                    key={phase.key}
                    selected={phaseFilter === phase.key}
                    onClick={() => setPhaseFilter(phase.key)}
                    label={phase.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Audience
              </span>
              <div className="flex flex-wrap gap-2">
                <FilterPill
                  selected={audienceFilter === 'all'}
                  onClick={() => setAudienceFilter('all')}
                  label="All audiences"
                />
                {VISION_APP_AUDIENCES.map((audience) => (
                  <FilterPill
                    key={audience}
                    selected={audienceFilter === audience}
                    onClick={() => setAudienceFilter(audience)}
                    label={audience.charAt(0).toUpperCase() + audience.slice(1)}
                  />
                ))}
              </div>
            </div>

            {transformationAreas.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Focus
                </span>
                <div className="flex flex-wrap gap-2">
                  <FilterPill
                    selected={areaFilter === 'all'}
                    onClick={() => setAreaFilter('all')}
                    label="All areas"
                  />
                  {transformationAreas.map((area) => (
                    <FilterPill
                      key={area}
                      selected={areaFilter === area}
                      onClick={() => setAreaFilter(area)}
                      label={area}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </GlowCardContent>
      </GlowCard>

      <Grid columns={viewMode === 'grid' ? 4 : 1} gap="lg">
        {sortedApps.map((app) => {
          const cardProps = mapAppToCardProps(app);
          const isFavorite = favoriteState[app.id] ?? cardProps.isFavorite;
          return (
            <AppCard
              key={app.id}
              {...cardProps}
              isFavorite={isFavorite}
              className={viewMode === 'list' ? 'w-full' : undefined}
              onToggleFavorite={(id) =>
                setFavoriteState((prev) => ({ ...prev, [id]: !prev[id] }))
              }
            />
          );
        })}
      </Grid>

      {sortedApps.length === 0 && (
        <GlowCard variant="glow">
          <GlowCardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <Search className="h-8 w-8 text-muted-foreground" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                No apps match these filters
              </h3>
              <p className="text-sm text-muted-foreground">
                Try removing a filter or clearing your search to see everything.
              </p>
            </div>
            <GlowButton variant="outline" size="sm" onClick={resetFilters}>
              Reset filters
            </GlowButton>
          </GlowCardContent>
        </GlowCard>
      )}
    </div>
  );
}

function FilterPill({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <GlowButton
      variant={selected ? 'default' : 'outline'}
      size="sm"
      glow={selected ? 'subtle' : 'none'}
      onClick={onClick}
      className="shadow-none"
    >
      {label}
    </GlowButton>
  );
}
