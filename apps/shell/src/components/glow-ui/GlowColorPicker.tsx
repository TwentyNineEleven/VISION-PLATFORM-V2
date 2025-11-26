'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { semanticColors } from '@/design-system';

export interface GlowColorPickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  value?: string;
  defaultColor?: string;
  onChange: (color: string) => void;
  swatchLabel?: string;
}

export const GlowColorPicker = React.forwardRef<HTMLInputElement, GlowColorPickerProps>(
  (
    {
      label,
      helperText,
      error,
      className,
      id,
      value,
      defaultColor,
      onChange,
      swatchLabel,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || `color-picker-${generatedId}`;
    const colorValue = value || defaultColor || semanticColors.fillPrimary;
    const finalSwatchLabel = swatchLabel || `${label ?? 'Brand'} color preview`;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    };

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              disabled && 'opacity-60'
            )}
          >
            {label}
          </label>
        )}

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-vision-gray-100 bg-vision-gray-0">
            <span
              role="img"
              aria-label={finalSwatchLabel}
              className="h-10 w-10 rounded-full border border-vision-gray-100"
              style={{ backgroundColor: colorValue }}
            />
          </div>

          <input
            id={inputId}
            type="color"
            value={colorValue}
            onChange={handleChange}
            className={cn(
              'h-12 w-full cursor-pointer rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
        </div>

        {(helperText || error) && (
          <p className={cn('text-sm', error ? 'text-destructive' : 'text-muted-foreground')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

GlowColorPicker.displayName = 'GlowColorPicker';

