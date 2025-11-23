'use client';

/**
 * AppsFilterBar Component
 * 
 * Compact filter bar with:
 * - Search input
 * - Domain segmented control (single-choice)
 * - Audience segmented control (single-choice)
 * - "More filters" button (toggles advanced panel)
 * - Reset link/button
 * - Sort dropdown
 * - View toggle (Grid / List)
 * - Active filters summary
 * 
 * Sticky behavior: position: sticky within content column
 * Uses Glow UI patterns and 2911 Bold Color System.
 */

import * as React from 'react';
import { Search, X, Filter, Grid3x3, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppCatalogFilters, Audience, SortOption } from '@/lib/app-catalog-types';
import { phaseColorMap, phaseLabels, type Phase } from '@/lib/phase-colors';
import { GlowCard, GlowInput, GlowSelect, GlowButton } from '@/components/glow-ui';

export interface AppsFilterBarProps {
  filters: AppCatalogFilters;
  onFiltersChange: (filters: AppCatalogFilters) => void;
  activeFilterCount: number;
  filteredAppCount: number;
  viewMode?: 'GRID' | 'LIST';
  onViewModeChange?: (mode: 'GRID' | 'LIST') => void;
  onToggleAdvancedFilters?: () => void;
  isAdvancedFiltersOpen?: boolean;
}

const PHASES: Phase[] = ['VOICE', 'INSPIRE', 'STRATEGIZE', 'INITIATE', 'OPERATE', 'NARRATE'];
const AUDIENCES: Audience[] = ['Funder', 'Organization', 'Consultant', 'Multi'];
const SORT_OPTIONS: SortOption[] = ['Most Relevant', 'A → Z', 'Most Used', 'Newest'];

export function AppsFilterBar({
  filters,
  onFiltersChange,
  activeFilterCount,
  filteredAppCount,
  viewMode = 'GRID',
  onViewModeChange,
  onToggleAdvancedFilters,
  isAdvancedFiltersOpen = false,
}: AppsFilterBarProps) {
  const [searchQuery, setSearchQuery] = React.useState(filters.searchQuery);

  const filtersRef = React.useRef(filters);
  React.useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filtersRef.current, searchQuery });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, onFiltersChange]);

  const handlePhaseClick = (phase: Phase | 'All') => {
    onFiltersChange({ ...filters, phase });
  };

  const handleAudienceClick = (audience: Audience | 'All') => {
    onFiltersChange({ ...filters, audience });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchQuery: '',
      phase: 'All',
      audience: 'All',
      focusTags: [],
      sortBy: filters.sortBy,
    });
    setSearchQuery('');
  };

  return (
    <div className="sticky top-0 z-10 bg-background pb-4">
      <GlowCard variant="default" padding="md" className="border-border">
        {/* Primary Row: Search + Phase + Audience + Actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4">
          {/* Left: Search */}
          <div className="flex-1">
            <GlowInput
              type="text"
              placeholder="Search by app name or description…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              variant="glow"
              inputSize="default"
              className="w-full"
            />
          </div>

          {/* Middle: Domain & Audience Chips (compact) */}
          <div className="flex flex-wrap gap-2 lg:flex-nowrap">
            {/* Domain Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => handlePhaseClick('All')}
                className={cn(
                  'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all',
                  filters.phase === 'All'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-foreground hover:border hover:border-border'
                )}
                aria-pressed={filters.phase === 'All'}
              >
                All
              </button>
              {PHASES.map((phase) => {
                const domainColor = phaseColorMap[phase];
                const isSelected = filters.phase === phase;
                return (
                  <button
                    key={phase}
                    onClick={() => handlePhaseClick(phase)}
                    className={cn(
                      'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all',
                      isSelected
                        ? 'text-white shadow-md'
                        : 'bg-muted text-foreground hover:border hover:border-border'
                    )}
                    style={
                      isSelected
                        ? { backgroundColor: domainColor }
                        : undefined
                    }
                    aria-pressed={isSelected}
                  >
                    {phaseLabels[phase].split(' ')[0]}
                  </button>
                );
              })}
            </div>

            {/* Audience Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => handleAudienceClick('All')}
                className={cn(
                  'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all',
                  filters.audience === 'All'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-foreground hover:border hover:border-border'
                )}
                aria-pressed={filters.audience === 'All'}
              >
                All
              </button>
              {AUDIENCES.map((audience) => (
                <button
                  key={audience}
                  onClick={() => handleAudienceClick(audience)}
                  className={cn(
                    'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all',
                    filters.audience === audience
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-foreground hover:border hover:border-border'
                  )}
                  aria-pressed={filters.audience === audience}
                >
                  {audience}
                </button>
              ))}
            </div>
          </div>

          {/* Right: More Filters + Reset + Sort + View Toggle */}
          <div className="flex items-center gap-2">
            {/* More Filters Button */}
            {onToggleAdvancedFilters && (
              <GlowButton
                variant={isAdvancedFiltersOpen ? 'default' : 'outline'}
                size="sm"
                onClick={onToggleAdvancedFilters}
                leftIcon={<Filter className="h-4 w-4" />}
                aria-expanded={isAdvancedFiltersOpen}
                aria-label="Toggle advanced filters"
              >
                More filters
              </GlowButton>
            )}

            {/* Reset */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                <X size={16} />
                Reset
              </button>
            )}

            {/* Sort Dropdown */}
            <GlowSelect
              value={filters.sortBy}
              onChange={(e) =>
                onFiltersChange({ ...filters, sortBy: e.target.value as SortOption })
              }
              variant="glow"
              controlSize="sm"
              className="min-w-[140px]"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </GlowSelect>

            {/* View Toggle */}
            {onViewModeChange && (
              <div className="flex rounded-lg border border-border p-1">
                <button
                  onClick={() => onViewModeChange('GRID')}
                  className={cn(
                    'rounded p-1.5 transition-colors',
                    viewMode === 'GRID'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'GRID'}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onViewModeChange('LIST')}
                  className={cn(
                    'rounded p-1.5 transition-colors',
                    viewMode === 'LIST'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                  aria-label="List view"
                  aria-pressed={viewMode === 'LIST'}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Row */}
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredAppCount}</span>{' '}
            {filteredAppCount === 1 ? 'app' : 'apps'}
            {activeFilterCount > 0 && (
              <>
                {' · '}
                <span className="font-semibold text-foreground">{activeFilterCount}</span>{' '}
                {activeFilterCount === 1 ? 'filter' : 'filters'} active
              </>
            )}
            {activeFilterCount === 0 && ' · No filters applied'}
          </p>
        </div>
      </GlowCard>
    </div>
  );
}

