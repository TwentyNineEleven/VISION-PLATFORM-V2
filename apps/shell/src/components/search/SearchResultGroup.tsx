'use client';

import * as React from 'react';
import type { SearchResult } from '@/lib/mock-data';
import { SearchResultItem } from './SearchResultItem';

interface SearchResultGroupProps {
  title: string;
  items: SearchResult[];
  activeIndexOffset: number;
  currentActive: number;
  onSelect: (result: SearchResult) => void;
  onHover: (index: number) => void;
}

export function SearchResultGroup({
  title,
  items,
  activeIndexOffset,
  currentActive,
  onSelect,
  onHover,
}: SearchResultGroupProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
        <span>{title}</span>
        <span className="text-muted-foreground/70">{items.length} items</span>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => {
          const globalIndex = activeIndexOffset + index;
          return (
            <SearchResultItem
              key={item.title + index}
              result={item}
              active={globalIndex === currentActive}
              onClick={() => onSelect(item)}
              onMouseEnter={() => onHover(globalIndex)}
            />
          );
        })}
      </div>
    </div>
  );
}
