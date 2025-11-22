'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const groupVariants = cva('flex flex-row', {
  variants: {
    spacing: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    },
    wrap: {
      wrap: 'flex-wrap',
      nowrap: 'flex-nowrap',
    },
  },
  defaultVariants: {
    spacing: 'md',
    align: 'center',
    justify: 'start',
    wrap: 'nowrap',
  },
});

export interface GroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof groupVariants> {}

const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  ({ className, spacing, align, justify, wrap, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(groupVariants({ spacing, align, justify, wrap, className }))}
        {...props}
      />
    );
  }
);

Group.displayName = 'Group';

export { Group, groupVariants };
