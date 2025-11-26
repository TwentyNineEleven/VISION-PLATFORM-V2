'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export function SearchInput({ className, onClear, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
      <input
        {...props}
        className={cn(
          'w-full rounded-lg border border-input bg-muted/50 pl-10 pr-24 py-3 text-sm',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:shadow-glow-primary-sm',
          'placeholder:text-muted-foreground'
        )}
      />
      <div className="absolute right-3 flex items-center gap-2">
        {props.value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
        <div className="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10px] uppercase text-muted-foreground">
          <span>Esc</span>
        </div>
      </div>
    </div>
  );
}
