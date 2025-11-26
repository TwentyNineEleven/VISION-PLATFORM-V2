'use client';

import * as React from 'react';
import { Command, Search as SearchIcon } from 'lucide-react';
import { GlowButton, GlowModal } from '@/components/glow-ui';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { useGlobalSearch } from './useGlobalSearch';

interface GlobalSearchProps {
  showTrigger?: boolean;
  renderTrigger?: (open: boolean, openSearch: () => void) => React.ReactNode;
}

export function GlobalSearch({ showTrigger = true, renderTrigger }: GlobalSearchProps) {
  const search = useGlobalSearch();
  const openSearch = React.useCallback(() => search.setOpen(true), [search]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      search.moveSelection('down');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      search.moveSelection('up');
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const result = search.flatResults[search.activeIndex];
      if (result) {
        search.selectResult(result);
      }
    } else if (event.key === 'Escape') {
      search.setOpen(false);
    }
  };

  const triggerNode =
    renderTrigger?.(search.open, openSearch) ||
    (showTrigger && (
      <GlowButton
        type="button"
        variant="ghost"
        className="hidden lg:inline-flex"
        leftIcon={<SearchIcon className="h-4 w-4" />}
        onClick={openSearch}
      >
        Search
      </GlowButton>
    ));

  return (
    <>
      {triggerNode}

      <GlowModal
        open={search.open}
        onOpenChange={search.setOpen}
        title="Quick search"
        description="Search apps, documents, proposals, and quick actions."
        size="xl"
        closeOnOverlayClick
        footer={
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1">
                <span>↑↓</span>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1">
                <span>Enter</span>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1">
                <span>Esc</span>
                <span>Close</span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1">
              <Command className="h-3.5 w-3.5" />
              <span>K</span>
            </div>
          </div>
        }
      >
        <div className="space-y-4" onKeyDown={handleKeyDown}>
          <SearchInput
            autoFocus
            placeholder="Search apps, documents, proposals…"
            value={search.query}
            onChange={(e) => search.setQuery(e.target.value)}
            onClear={() => search.setQuery('')}
          />

          <div className="max-h-[420px] overflow-y-auto pr-1">
            <SearchResults
              groups={search.groupedResults}
              activeIndex={search.activeIndex}
              onSelect={search.selectResult}
              onHover={(index) => search.setActiveIndex(index)}
            />
          </div>
        </div>
      </GlowModal>
    </>
  );
}
