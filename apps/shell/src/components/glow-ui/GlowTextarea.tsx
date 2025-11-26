'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const glowTextareaVariants = cva(
  'w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background transition-all duration-200 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:shadow-glow-primary-sm',
  {
    variants: {
      variant: {
        default: 'border-input',
        glow: 'border-primary/30 focus-visible:border-primary focus-visible:shadow-glow-primary',
        error: 'border-destructive/50 focus-visible:border-destructive focus-visible:shadow-glow-error',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface GlowTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof glowTextareaVariants> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const GlowTextarea = React.forwardRef<HTMLTextAreaElement, GlowTextareaProps>(
  ({ className, label, helperText, error, id, variant, rows = 4, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || `textarea-${generatedId}`;
    const finalVariant = error ? 'error' : variant;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          rows={rows}
          className={cn(glowTextareaVariants({ variant: finalVariant, className }))}
          ref={ref}
          {...props}
        />
        {(helperText || error) && (
          <p className={cn('text-sm', error ? 'text-destructive' : 'text-muted-foreground')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

GlowTextarea.displayName = 'GlowTextarea';


