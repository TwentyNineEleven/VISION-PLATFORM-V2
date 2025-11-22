'use client';

/**
 * PageHero Component
 * 
 * Shared hero pattern for all main pages (Dashboard, Applications, Funder, etc.)
 * 
 * Layout:
 * - Left side: Eyebrow (optional), Title, Subtitle
 * - Right side: Primary action + optional secondary action
 * - Mobile: Stacks vertically with actions below text
 * 
 * Uses Glow UI patterns and 2911 Bold Color System.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { GlowCard, GlowButton } from '@/components/glow-ui';

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function PageHero({
  title,
  subtitle,
  eyebrow,
  primaryAction,
  secondaryAction,
  className,
}: PageHeroProps) {
  return (
    <GlowCard
      variant="default"
      padding="lg"
      className={cn(
        'border-vision-gray-100 bg-vision-gray-50 rounded-2xl',
        className
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left side */}
        <div className="flex-1 space-y-2">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground lg:text-base">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right side - Actions */}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row lg:items-center">
            {primaryAction}
            {secondaryAction}
          </div>
        )}
      </div>
    </GlowCard>
  );
}

