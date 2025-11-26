'use client';

import * as React from 'react';
import { mockSearchResults, type SearchResult } from '@/lib/mock-data';

interface UseGlobalSearchOptions {
  debounceMs?: number;
}

export function useGlobalSearch(options: UseGlobalSearchOptions = {}) {
  const { debounceMs = 300 } = options;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(handler);
  }, [query, debounceMs]);

  React.useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isCmdK) {
        event.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (!open) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [open]);

  React.useEffect(() => {
    if (open) {
      setActiveIndex(0);
    }
  }, [debouncedQuery, open]);

  const filteredResults = React.useMemo(() => {
    if (!debouncedQuery) {
      return [...mockSearchResults].sort((a, b) => {
        if (a.group === 'Recent' && b.group !== 'Recent') return -1;
        if (b.group === 'Recent' && a.group !== 'Recent') return 1;
        return 0;
      });
    }

    const lowerQuery = debouncedQuery.toLowerCase();
    return mockSearchResults.filter(
      (result) =>
        result.title.toLowerCase().includes(lowerQuery) ||
        result.category?.toLowerCase().includes(lowerQuery) ||
        result.app?.toLowerCase().includes(lowerQuery)
    );
  }, [debouncedQuery]);

  const groupedResults = React.useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};

    filteredResults.forEach((result) => {
      const groupKey = result.group || (debouncedQuery ? 'Results' : 'Recent');
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(result);
    });

    return Object.entries(groups).map(([title, items]) => ({ title, items }));
  }, [filteredResults, debouncedQuery]);

  const flatResults = React.useMemo(() => groupedResults.flatMap((group) => group.items), [groupedResults]);

  const selectResult = (result: SearchResult) => {
    if (result.url) {
      window.location.href = result.url;
    }
    setOpen(false);
  };

  const moveSelection = (direction: 'up' | 'down') => {
    const total = flatResults.length;
    if (total === 0) return;

    setActiveIndex((prev) => {
      if (direction === 'down') {
        return prev + 1 >= total ? 0 : prev + 1;
      }
      return prev - 1 < 0 ? total - 1 : prev - 1;
    });
  };

  return {
    open,
    setOpen,
    query,
    setQuery,
    debouncedQuery,
    activeIndex,
    setActiveIndex,
    groupedResults,
    flatResults,
    selectResult,
    moveSelection,
  };
}
