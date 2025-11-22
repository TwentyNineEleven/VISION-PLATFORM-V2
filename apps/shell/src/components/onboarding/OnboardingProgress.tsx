'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
  steps: { id: string; label: string }[];
  currentStep: number;
}

export function OnboardingProgress({ steps, currentStep }: OnboardingProgressProps) {
  const progressPercent = React.useMemo(
    () => ((currentStep + 1) / steps.length) * 100,
    [currentStep, steps.length]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="text-foreground">{steps[currentStep]?.label}</span>
      </div>

      <div className="flex items-center gap-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;
          return (
            <div key={step.id} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-all',
                  isActive && 'border-primary bg-primary/10 text-primary shadow-glow-primary-sm',
                  isComplete && 'border-secondary bg-secondary/10 text-secondary shadow-glow-success-sm',
                  !isActive && !isComplete && 'border-border bg-muted text-muted-foreground'
                )}
              >
                {index + 1}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-foreground">{step.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
