'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { FileText, Rocket, Zap } from 'lucide-react';
import { GlowBadge } from '@/components/glow-ui';
import type { SearchResult } from '@/lib/mock-data';

interface SearchResultItemProps {
  result: SearchResult;
  active?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

export function SearchResultItem({ result, active, onClick, onMouseEnter }: SearchResultItemProps) {
  const icon =
    result.type === 'document' ? <FileText className="h-4 w-4" /> : result.type === 'app' ? <Rocket className="h-4 w-4" /> : <Zap className="h-4 w-4" />;

  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all',
        active
          ? 'border-primary bg-primary/10 shadow-glow-primary-sm'
          : 'border-transparent hover:border-border hover:bg-muted/60'
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-center gap-3">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary')}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{result.title}</p>
          <p className="text-xs text-muted-foreground">
            {result.app ? `${result.category} · ${result.app}` : result.category}
          </p>
        </div>
      </div>
      {result.badge && (
        <GlowBadge variant="outline" size="sm">
          {result.badge}
        </GlowBadge>
      )}
    </button>
  );
}
