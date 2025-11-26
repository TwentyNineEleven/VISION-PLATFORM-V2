'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { modulePalette, type ModuleKey } from '@/lib/vision-theme';
import { GlowCard } from '@/components/glow-ui';

export interface DashboardAppCardProps {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  module: ModuleKey;
  onLaunch?: () => void;
  className?: string;
}

export function DashboardAppCard({
  id,
  name,
  icon: IconComponent,
  module,
  onLaunch,
  className,
}: DashboardAppCardProps) {
  const moduleTheme = modulePalette[module];
  const Icon = IconComponent;

  const handleClick = () => {
    onLaunch?.();
  };

  return (
    <GlowCard
      variant="interactive"
      padding="md"
      onClick={handleClick}
      className={cn(
        'dashboard-app-card cursor-pointer transition-all',
        'hover:shadow-interactive-hover hover:-translate-y-0.5',
        className
      )}
      style={
        {
          '--app-card-module-color': moduleTheme.solid,
        } as React.CSSProperties
      }
    >
      <div className="flex flex-col items-center justify-center gap-2 text-center min-h-[100px]">
        {/* Icon */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-lg transition-colors flex-shrink-0"
          style={{
            backgroundColor: moduleTheme.soft,
            color: moduleTheme.solid,
          }}
        >
          <Icon size={24} className="flex-shrink-0" />
        </div>
        
        {/* App Name */}
        <p
          className="text-sm font-semibold leading-tight line-clamp-2 min-h-[2.5rem]"
          style={{
            color: moduleTheme.solid,
          }}
        >
          {name}
        </p>
      </div>
    </GlowCard>
  );
}

