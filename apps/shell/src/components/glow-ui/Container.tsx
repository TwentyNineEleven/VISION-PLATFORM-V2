'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const containerVariants = cva('mx-auto w-full', {
  variants: {
    maxWidth: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      '7xl': 'max-w-7xl',
      full: 'max-w-full',
    },
    padding: {
      none: '',
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8',
    },
  },
  defaultVariants: {
    maxWidth: '7xl',
    padding: 'md',
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(containerVariants({ maxWidth, padding, className }))}
        {...props}
      />
    );
  }
);

Container.displayName = 'Container';

export { Container, containerVariants };
