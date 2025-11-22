'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const glowBadgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-glow-primary-sm hover:shadow-glow-primary',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground shadow-glow-success-sm hover:shadow-glow-success',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow-glow-error-sm hover:shadow-glow-error',
        accent:
          'border-transparent bg-accent text-accent-foreground shadow-glow-accent-sm hover:shadow-glow-accent',
        outline: 'text-foreground border-border hover:bg-accent/10',
        success:
          'border-transparent bg-vision-green text-white shadow-glow-success-sm',
        warning:
          'border-transparent bg-vision-orange text-white shadow-glow-accent-sm',
        info: 'border-transparent bg-vision-blue text-white shadow-glow-primary-sm',
      },
      size: {
        sm: 'text-[10px] px-2 py-0',
        default: 'text-xs px-2.5 py-0.5',
        lg: 'text-sm px-3 py-1',
      },
      glow: {
        none: '',
        subtle: 'shadow-glow-primary-sm',
        medium: 'shadow-glow-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      glow: 'none',
    },
  }
);

export interface GlowBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glowBadgeVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const GlowBadge = React.forwardRef<HTMLDivElement, GlowBadgeProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      leftIcon,
      rightIcon,
      removable,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(glowBadgeVariants({ variant, size, glow }), className)}
        {...props}
      >
        {leftIcon && <span className="mr-1">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-1">{rightIcon}</span>}
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 rounded-full hover:bg-white/20 p-0.5 transition-colors"
            aria-label="Remove"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

GlowBadge.displayName = 'GlowBadge';

export { GlowBadge, glowBadgeVariants };
