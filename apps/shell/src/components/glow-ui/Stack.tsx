'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const stackVariants = cva('flex flex-col', {
  variants: {
    spacing: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-10',
      '3xl': 'gap-12',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    },
  },
  defaultVariants: {
    spacing: 'md',
    align: 'stretch',
    justify: 'start',
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, spacing, align, justify, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(stackVariants({ spacing, align, justify, className }))}
        {...props}
      />
    );
  }
);

Stack.displayName = 'Stack';

export { Stack, stackVariants };
