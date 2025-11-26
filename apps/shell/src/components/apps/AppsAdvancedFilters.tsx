'use client';

/**
 * AppsAdvancedFilters Component
 * 
 * Collapsible panel/drawer for Focus tags and secondary filters.
 * 
 * Desktop: Slide-down panel under filter bar
 * Mobile: Full-height bottom sheet / side sheet
 * 
 * Uses Glow UI patterns and 2911 Bold Color System.
 */

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppCatalogFilters } from '@/lib/app-catalog-types';
import { GlowCard, GlowButton } from '@/components/glow-ui';

export interface AppsAdvancedFiltersProps {
  filters: AppCatalogFilters;
  onFiltersChange: (filters: AppCatalogFilters) => void;
  availableFocusTags: string[];
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}


export function AppsAdvancedFilters({
  filters,
  onFiltersChange,
  availableFocusTags,
  isOpen,
  onClose,
  isMobile = false,
}: AppsAdvancedFiltersProps) {
  const handleFocusTagToggle = (tag: string) => {
    const newTags = filters.focusTags.includes(tag)
      ? filters.focusTags.filter((t) => t !== tag)
      : [...filters.focusTags, tag];
    onFiltersChange({ ...filters, focusTags: newTags });
  };

  const clearFocusFilters = () => {
    onFiltersChange({ ...filters, focusTags: [] });
  };

  const handleApply = () => {
    // Filters are already applied in real-time, just close
    onClose();
  };

  if (!isOpen) return null;

  // Mobile: Full-height bottom sheet
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        {/* Bottom Sheet */}
        <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] rounded-t-lg border-t border-border bg-card shadow-2xl animate-in slide-in-from-bottom duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold text-foreground">Focus Filters</h2>
            <button
              onClick={onClose}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[calc(80vh-140px)] overflow-y-auto p-4">
            <div className="mb-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Focus
              </p>
              <div className="flex flex-wrap gap-2">
                {availableFocusTags.length > 0 ? (
                  availableFocusTags.map((tag) => {
                    const isSelected = filters.focusTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleFocusTagToggle(tag)}
                        className={cn(
                          'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-muted text-foreground hover:border hover:border-border'
                        )}
                        aria-pressed={isSelected}
                      >
                        {tag}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No focus tags available</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border p-4">
            <button
              onClick={clearFocusFilters}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear focus filters
            </button>
            <GlowButton variant="default" size="sm" onClick={handleApply}>
              Apply filters
            </GlowButton>
          </div>
        </div>
      </>
    );
  }

  // Desktop: Slide-down panel
  return (
    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <GlowCard variant="default" padding="md" className="border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Focus
              </p>
              <button
                onClick={onClose}
                className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableFocusTags.length > 0 ? (
                availableFocusTags.map((tag) => {
                  const isSelected = filters.focusTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleFocusTagToggle(tag)}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-muted text-foreground hover:border hover:border-border'
                      )}
                      aria-pressed={isSelected}
                    >
                      {tag}
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No focus tags available</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {filters.focusTags.length > 0 && (
          <div className="mt-4 flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              onClick={clearFocusFilters}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear focus filters
            </button>
            <GlowButton variant="default" size="sm" onClick={handleApply}>
              Apply filters
            </GlowButton>
          </div>
        )}
      </GlowCard>
    </div>
  );
}
