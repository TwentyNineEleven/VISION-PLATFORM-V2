'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const titleVariants = cva('font-bold text-foreground', {
  variants: {
    level: {
      1: 'text-4xl lg:text-5xl',
      2: 'text-3xl lg:text-4xl',
      3: 'text-2xl lg:text-3xl',
      4: 'text-xl lg:text-2xl',
      5: 'text-lg lg:text-xl',
      6: 'text-base lg:text-lg',
    },
    weight: {
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
  },
  defaultVariants: {
    level: 1,
    weight: 'bold',
  },
});

export interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, level, weight, as, ...props }, ref) => {
    const Component = as || (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');

    return (
      <Component
        ref={ref}
        className={cn(titleVariants({ level, weight, className }))}
        {...props}
      />
    );
  }
);

Title.displayName = 'Title';

export { Title, titleVariants };
