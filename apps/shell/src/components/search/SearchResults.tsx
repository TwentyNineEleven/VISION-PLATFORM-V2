'use client';

import * as React from 'react';
import type { SearchResult } from '@/lib/mock-data';
import { SearchResultGroup } from './SearchResultGroup';
import { FileSearch } from 'lucide-react';

interface SearchResultsProps {
  groups: { title: string; items: SearchResult[] }[];
  activeIndex: number;
  onSelect: (result: SearchResult) => void;
  onHover: (index: number) => void;
}

export function SearchResults({ groups, activeIndex, onSelect, onHover }: SearchResultsProps) {
  if (!groups.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        <FileSearch className="h-6 w-6 text-muted-foreground" />
        <p>No results found</p>
      </div>
    );
  }

  let offset = 0;
  return (
    <div className="space-y-5">
      {groups.map((group) => {
        const component = (
          <SearchResultGroup
            key={group.title}
            title={group.title}
            items={group.items}
            activeIndexOffset={offset}
            currentActive={activeIndex}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
        offset += group.items.length;
        return component;
      })}
    </div>
  );
}
