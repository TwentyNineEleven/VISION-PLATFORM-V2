'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { Star, Grid3x3 } from 'lucide-react';
import {
  GlowBadge,
  GlowButton,
  GlowCard,
  Group,
  Stack,
  Text,
} from '@/components/glow-ui';
import { modulePalette, moduleLabels, type ModuleKey } from '@/lib/vision-theme';
import { cn } from '@/lib/utils';

export type AppStatus = 'active' | 'coming_soon' | 'paused';

export interface AppCardProps {
  id: string;
  name: string;
  description: string;
  module: ModuleKey;
  category?: string;
  icon: React.ComponentType<{ size?: number | string }>;
  status?: AppStatus;
  isFavorite?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  launchPath?: string;
  onboardingPath?: string;
  onLaunch?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  className?: string;
}

const moduleColorMap: Record<ModuleKey, string> = {
  voice: modulePalette.voice.solid,
  inspire: modulePalette.inspire.solid,
  strategize: modulePalette.strategize.solid,
  initiate: modulePalette.initiate.solid,
  operate: modulePalette.operate.solid,
  narrate: modulePalette.narrate.solid,
};

export function AppCard({
  id,
  name,
  description,
  module,
  category,
  icon: IconComponent,
  status = 'active',
  isFavorite = false,
  isNew,
  isPopular,
  launchPath,
  onLaunch,
  onToggleFavorite,
  className,
}: AppCardProps) {
  const router = useRouter();
  const moduleTheme = modulePalette[module];
  const Icon = IconComponent ?? Grid3x3;
  const isDisabled = status !== 'active';
  const launchLabel = isDisabled ? 'Preview' : 'Launch';

  const handleLaunch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isDisabled) {
      return;
    }
    if (onLaunch) {
      onLaunch(id);
      return;
    }
    if (launchPath) {
      router.push(launchPath as Route);
    }
  };

  const handleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleFavorite?.(id);
  };

  return (
    <GlowCard
      variant="flat"
      padding="lg"
      role="group"
      tabIndex={0}
      data-status={status}
      data-module={module}
      className={cn(
        'app-card h-full focus-visible:outline-none',
        isDisabled && 'app-card-disabled',
        className
      )}
      style={
        {
          '--app-card-module-color': moduleTheme.solid,
          '--app-card-module-soft': moduleTheme.soft,
        } as React.CSSProperties
      }
    >
      <Stack spacing="md" className="h-full">
        <Group justify="between" align="start" wrap="wrap" className="gap-y-2">
          <Group spacing="xs" wrap="wrap" align="center" className="gap-y-1">
            <GlowBadge
              variant="outline"
              size="sm"
              className="border-transparent text-[11px] font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: moduleTheme.soft,
                color: moduleColorMap[module],
              }}
            >
              {moduleLabels[module]}
            </GlowBadge>
            {isPopular && (
              <GlowBadge variant="success" size="sm">
                Popular
              </GlowBadge>
            )}
            {isNew && (
              <GlowBadge variant="info" size="sm">
                New
              </GlowBadge>
            )}
            {status === 'coming_soon' && (
              <GlowBadge variant="warning" size="sm">
                Coming soon
              </GlowBadge>
            )}
            {status === 'paused' && (
              <GlowBadge variant="outline" size="sm" className="text-muted-foreground">
                Paused
              </GlowBadge>
            )}
          </Group>
          <GlowButton
            variant="ghost"
            size="icon"
            glow="none"
            className="app-card-favorite"
            data-active={isFavorite}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={handleFavorite}
            disabled={!onToggleFavorite}
          >
            <Star
              className="h-4 w-4"
              strokeWidth={1.5}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </GlowButton>
        </Group>

        <Stack spacing="xs" align="center">
          <div className="app-card-icon">
            <Icon size={28} />
          </div>
          <Text as="p" weight="semibold" className="text-center text-base">
            {name}
          </Text>
          {category && (
            <Text size="xs" color="secondary" className="text-center">
              {category}
            </Text>
          )}
        </Stack>

        <Text
          size="sm"
          color="secondary"
          className="text-center leading-relaxed line-clamp-3 flex-1"
        >
          {description}
        </Text>

        <Group justify="center" className="mt-auto">
          <GlowButton
            size="sm"
            variant={isDisabled ? 'outline' : 'default'}
            glow={isDisabled ? 'none' : 'subtle'}
            disabled={isDisabled}
            onClick={handleLaunch}
          >
            {launchLabel}
          </GlowButton>
        </Group>
      </Stack>
    </GlowCard>
  );
}

