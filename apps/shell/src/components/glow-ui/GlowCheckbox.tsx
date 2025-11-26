'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface GlowCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  onChange?: (checked: boolean) => void;
}

const GlowCheckbox = React.forwardRef<HTMLInputElement, GlowCheckboxProps>(
  ({ className, label, helperText, error, id, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || `checkbox-${generatedId}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id={checkboxId}
            className={cn(
              'h-4 w-4 rounded border-input text-primary transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'cursor-pointer',
              error && 'border-destructive',
              className
            )}
            ref={ref}
            onChange={handleChange}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {label}
            </label>
          )}
        </div>

        {(helperText || error) && (
          <p
            className={cn(
              'text-sm ml-7',
              error ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

GlowCheckbox.displayName = 'GlowCheckbox';

export { GlowCheckbox };
