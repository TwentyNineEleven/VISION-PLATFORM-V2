'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const glowInputVariants = cva(
  'flex w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      variant: {
        default:
          'border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:shadow-glow-primary-sm',
        glow: 'border-primary/30 focus-visible:border-primary focus-visible:shadow-glow-primary',
        error:
          'border-destructive/50 focus-visible:border-destructive focus-visible:shadow-glow-error',
        success:
          'border-secondary/50 focus-visible:border-secondary focus-visible:shadow-glow-success',
      },
      inputSize: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

export interface GlowInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof glowInputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  success?: string;
  label?: string;
  helperText?: string;
}

const GlowInput = React.forwardRef<HTMLInputElement, GlowInputProps>(
  (
    {
      className,
      variant,
      inputSize,
      type,
      leftIcon,
      rightIcon,
      error,
      success,
      label,
      helperText,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || `input-${generatedId}`;
    const finalVariant = error ? 'error' : success ? 'success' : variant;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            className={cn(
              glowInputVariants({ variant: finalVariant, inputSize, className }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10'
            )}
            ref={ref}
            {...props}
          />

          {rightIcon && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || success || helperText) && (
          <p
            className={cn(
              'text-sm',
              error && 'text-destructive',
              success && 'text-secondary',
              !error && !success && 'text-muted-foreground'
            )}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    );
  }
);

GlowInput.displayName = 'GlowInput';

export { GlowInput, glowInputVariants };
