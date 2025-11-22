'use client';

/**
 * Filters Bar Component
 * 
 * Search input + filter chips for phase, audience, and focus tags.
 * Uses Glow UI patterns and 2911 Bold Color System.
 */

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppCatalogFilters, Audience } from '@/lib/app-catalog-types';
import { phaseColorMap, phaseLabels, type Phase } from '@/lib/phase-colors';

export interface FiltersBarProps {
  filters: AppCatalogFilters;
  onFiltersChange: (filters: AppCatalogFilters) => void;
  availableFocusTags: string[];
  activeFilterCount: number;
}

const PHASES: Phase[] = ['VOICE', 'INSPIRE', 'STRATEGIZE', 'INITIATE', 'OPERATE', 'NARRATE'];
const AUDIENCES: Audience[] = ['Funder', 'Organization', 'Consultant', 'Multi'];

export function FiltersBar({
  filters,
  onFiltersChange,
  availableFocusTags,
  activeFilterCount,
}: FiltersBarProps) {
  const [searchQuery, setSearchQuery] = React.useState(filters.searchQuery);

  const { phase, audience, focusTags, sortBy } = filters;
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

  const handleFocusTagToggle = (tag: string) => {
    const newTags = filters.focusTags.includes(tag)
      ? filters.focusTags.filter((t) => t !== tag)
      : [...filters.focusTags, tag];
    onFiltersChange({ ...filters, focusTags: newTags });
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
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by app name or description…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#CBD5E1] bg-white px-10 py-2.5 text-sm text-[#1F2937] placeholder:text-[#94A3B8] focus:border-[#0047AB] focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20"
          />
        </div>
      </div>

      {/* Phase Filter Chips (Row 1) */}
      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
          Phase
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePhaseClick('All')}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition-all',
              filters.phase === 'All'
                ? 'bg-[#0047AB] text-white shadow-md'
                : 'bg-[#F1F5F9] text-[#1F2937] hover:border hover:border-[#CBD5E1]'
            )}
          >
            All phases
          </button>
          {PHASES.map((phase) => {
            const phaseColor = phaseColorMap[phase];
            const isSelected = filters.phase === phase;
            return (
              <button
                key={phase}
                onClick={() => handlePhaseClick(phase)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                  isSelected && 'text-white shadow-md'
                )}
                style={
                  isSelected
                    ? { backgroundColor: phaseColor }
                    : { backgroundColor: '#F1F5F9', color: '#1F2937' }
                }
              >
                {phaseLabels[phase]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Audience Filter Chips (Row 2) */}
      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
          Audience
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAudienceClick('All')}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition-all',
              filters.audience === 'All'
                ? 'bg-[#0047AB] text-white shadow-md'
                : 'bg-[#F1F5F9] text-[#1F2937] hover:border hover:border-[#CBD5E1]'
            )}
          >
            All audiences
          </button>
          {AUDIENCES.map((audience) => (
            <button
              key={audience}
              onClick={() => handleAudienceClick(audience)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                filters.audience === audience
                  ? 'bg-[#0047AB] text-white shadow-md'
                  : 'bg-[#F1F5F9] text-[#1F2937] hover:border hover:border-[#CBD5E1]'
              )}
            >
              {audience}
            </button>
          ))}
        </div>
      </div>

      {/* Focus Filter Chips (Row 3) */}
      {availableFocusTags.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
            Focus
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFiltersChange({ ...filters, focusTags: [] })}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                filters.focusTags.length === 0
                  ? 'bg-[#0047AB] text-white shadow-md'
                  : 'bg-[#F1F5F9] text-[#1F2937] hover:border hover:border-[#CBD5E1]'
              )}
            >
              All areas
            </button>
            {availableFocusTags.map((tag) => {
              const isSelected = filters.focusTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleFocusTagToggle(tag)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                    isSelected
                      ? 'bg-[#0047AB] text-white shadow-md'
                      : 'bg-[#F1F5F9] text-[#1F2937] hover:border hover:border-[#CBD5E1]'
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Clear Filters / Filter Count */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4">
          <span className="text-sm text-[#64748B]">
            Active filters: {activeFilterCount}
          </span>
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 text-sm font-medium text-[#0047AB] hover:text-[#1E3A8A] transition-colors"
          >
            <X size={16} />
            Clear filters ({activeFilterCount})
          </button>
        </div>
      )}
    </div>
  );
}
