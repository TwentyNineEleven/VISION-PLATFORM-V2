'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const glowButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-glow-primary hover:shadow-glow-primary-lg hover:scale-[1.02] active:scale-[0.98]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-glow-error hover:shadow-glow-error-lg hover:scale-[1.02]',
        outline:
          'border-2 border-primary bg-transparent text-primary hover:bg-primary/10 hover:shadow-glow-primary',
        secondary:
          'bg-secondary text-secondary-foreground shadow-glow-success hover:shadow-glow-success-lg hover:scale-[1.02]',
        ghost: 'hover:bg-accent hover:text-accent-foreground hover:shadow-ambient-card',
        link: 'text-primary underline-offset-4 hover:underline hover:glow-primary',
        accent:
          'bg-accent text-accent-foreground shadow-glow-accent hover:shadow-glow-accent-lg hover:scale-[1.02]',
        gradient:
          'gradient-brand text-white shadow-ambient-elevated hover:shadow-interactive-hover hover:scale-[1.02]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-14 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
      },
      glow: {
        none: '',
        subtle: 'shadow-glow-primary-sm',
        medium: 'shadow-glow-primary',
        strong: 'shadow-glow-primary-lg',
        pulse: 'animate-glow-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      glow: 'none',
    },
  }
);

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glowButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    // When asChild is true, we use Slot which expects exactly one child
    // So we can't render icons separately - they should be part of the child
    if (asChild) {
      return (
        <Comp
          className={cn(glowButtonVariants({ variant, size, glow, className }))}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(glowButtonVariants({ variant, size, glow, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && leftIcon}
        {children}
        {!loading && rightIcon && rightIcon}
      </Comp>
    );
  }
);

GlowButton.displayName = 'GlowButton';

export { GlowButton, glowButtonVariants };
