'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export interface GlowSwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>, 'onCheckedChange'> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const GlowSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  GlowSwitchProps
>(({ className, label, id, ...props }, ref) => {
  const generatedId = React.useId();
  const switchId = id || generatedId;
  
  return (
    <div className="flex items-center gap-3">
      <SwitchPrimitives.Root
        id={switchId}
        className={cn(
          'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
          className
        )}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0'
          )}
        />
      </SwitchPrimitives.Root>
      {label && (
        <label
          htmlFor={switchId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  );
});

GlowSwitch.displayName = SwitchPrimitives.Root.displayName;

export { GlowSwitch };

