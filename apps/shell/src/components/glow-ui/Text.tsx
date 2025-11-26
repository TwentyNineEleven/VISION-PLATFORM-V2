'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    textColor: {
      primary: 'text-foreground',
      secondary: 'text-muted-foreground',
      tertiary: 'text-muted-foreground/70',
      brand: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-destructive',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    textColor: 'primary',
  },
});

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
  color?: 'primary' | 'secondary' | 'tertiary' | 'brand' | 'success' | 'warning' | 'error';
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, weight, color, as = 'p', ...props }, ref) => {
    const Component = as;

    return (
      <Component
        ref={ref as any}
        className={cn(textVariants({ size, weight, textColor: color, className }))}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text, textVariants };
