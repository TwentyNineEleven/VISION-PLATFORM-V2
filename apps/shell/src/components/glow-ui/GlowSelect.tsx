'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const glowSelectVariants = cva(
  'flex w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:shadow-glow-primary-sm disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input',
        glow: 'border-primary/40 focus-visible:border-primary',
        error: 'border-destructive/60 focus-visible:border-destructive focus-visible:shadow-glow-error',
      },
      controlSize: {
        sm: 'h-9 text-xs',
        md: 'h-10',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      controlSize: 'md',
    },
  }
);

export interface GlowSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof glowSelectVariants> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const GlowSelect = React.forwardRef<HTMLSelectElement, GlowSelectProps>(
  ({ className, variant, controlSize, label, helperText, error, children, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || `select-${generatedId}`;
    const finalVariant = error ? 'error' : variant;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}

        <select
          id={selectId}
          className={cn(glowSelectVariants({ variant: finalVariant, controlSize, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </select>

        {(helperText || error) && (
          <p className={cn('text-sm', error ? 'text-destructive' : 'text-muted-foreground')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

GlowSelect.displayName = 'GlowSelect';

