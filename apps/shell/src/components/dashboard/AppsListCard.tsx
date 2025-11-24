'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, GlowButton, Group, Stack, Text } from '@/components/glow-ui';
import { Clock, Star, Lightbulb, Rocket, ExternalLink } from 'lucide-react';
import type { AppItem } from '@/lib/dashboard/mockDashboardData';
import { formatRelativeTime } from '@/lib/dashboard/mockDashboardData';
import { AppIcon } from './AppIcon';
import { getAppMeta, getPhaseColor } from '@/lib/apps/appMetadata';

const WORKFLOWS_ROUTE: Route = '/workflows' as Route;

export interface AppsListCardProps {
  recentApps: AppItem[];
  favoriteApps: AppItem[];
  recommendedApp?: {
    id: string;
    name: string;
    module: string;
    description: string;
    href: string;
    contextApp: string;
  };
  onLaunchApp?: (appId: string, href: string) => void;
}

/**
 * AppChipCard - Glow UI Media List Pattern
 * 
 * Displays an app with icon, name, description, and launch button.
 * Uses the centralized AppIcon component for consistency.
 */
function AppChipCard({ app, onLaunch, showLastUsed = false }: { app: AppItem; onLaunch?: (appId: string, href: string) => void; showLastUsed?: boolean }) {
  const appMeta = getAppMeta(app.id);
  const appName = appMeta?.name || app.name;
  const appDescription = appMeta?.shortDescription || app.description;

  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-accent/50 cursor-pointer group"
      onClick={() => onLaunch?.(app.id, app.href)}
    >
      {/* Left: AppIcon (standardized icon system) */}
      <AppIcon appId={app.id} size="md" />

      {/* Middle: App name and description */}
      <Stack spacing="xs" className="flex-1 min-w-0">
        <Text size="sm" weight="medium" className="line-clamp-1">
          {appName}
        </Text>
        <Text size="xs" color="tertiary" className="line-clamp-1">
          {appDescription}
        </Text>
        {showLastUsed && app.lastUsed && (
          <Text size="xs" color="tertiary">
            Last used {formatRelativeTime(app.lastUsed)}
          </Text>
        )}
      </Stack>

      {/* Right: Launch button */}
      <GlowButton
        size="sm"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onLaunch?.(app.id, app.href);
        }}
      >
        Launch
      </GlowButton>
    </div>
  );
}

export function AppsListCard({ recentApps, favoriteApps, recommendedApp, onLaunchApp }: AppsListCardProps) {
  return (
    <Stack spacing="lg">
      {/* Recent Apps */}
      <GlowCard variant="interactive" className="h-full">
        <GlowCardHeader>
          <Group spacing="sm" align="center">
            <Clock className="h-4 w-4" />
            <GlowCardTitle className="text-sm">Recent apps</GlowCardTitle>
          </Group>
        </GlowCardHeader>
        <GlowCardContent>
          <Stack spacing="sm">
            {recentApps.slice(0, 4).map((app) => (
              <AppChipCard
                key={app.id}
                app={app}
                onLaunch={onLaunchApp}
                showLastUsed={true}
              />
            ))}
          </Stack>
        </GlowCardContent>
      </GlowCard>

      {/* Favorites */}
      <GlowCard variant="interactive" className="h-full">
        <GlowCardHeader>
          <Group spacing="sm" align="center">
            <Star className="h-4 w-4 fill-vision-orange text-vision-orange" />
            <GlowCardTitle className="text-sm">Favorites</GlowCardTitle>
          </Group>
        </GlowCardHeader>
        <GlowCardContent>
          <Stack spacing="sm">
            {favoriteApps.slice(0, 3).map((app) => (
              <div key={app.id}>
                <AppChipCard app={app} onLaunch={onLaunchApp} />
                {app.pinnedBy && (
                  <Text size="xs" color="tertiary" className="mt-1 ml-13">
                    {app.pinnedBy === 'user' ? 'Pinned by you' : 'Funder recommended'}
                  </Text>
                )}
              </div>
            ))}
          </Stack>
        </GlowCardContent>
      </GlowCard>

      {/* Next Recommended Tool - Glow UI Insight/Callout Card Pattern */}
      {recommendedApp && (() => {
        const appMeta = getAppMeta(recommendedApp.id);
        const phaseColor = appMeta ? getPhaseColor(appMeta.phase) : '#C2410C';

        return (
          <GlowCard 
            variant="interactive" 
            className="h-full border-primary/20"
            style={{
              borderColor: `${phaseColor}30`,
            }}
          >
            <GlowCardHeader>
              <Group spacing="sm" align="center">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${phaseColor}15`,
                    color: phaseColor,
                  }}
                >
                  <Lightbulb size={16} />
                </div>
                <GlowCardTitle className="text-sm">Next recommended step</GlowCardTitle>
              </Group>
            </GlowCardHeader>
            <GlowCardContent>
              <Stack spacing="md">
                <Text size="sm" color="secondary" className="leading-relaxed">
                  {recommendedApp.description}
                </Text>
                <Group spacing="sm" wrap="wrap">
                  <GlowButton
                    glow="subtle"
                    rightIcon={<Rocket className="h-4 w-4" />}
                    onClick={() => onLaunchApp?.(recommendedApp.id, recommendedApp.href)}
                    style={{
                      backgroundColor: phaseColor,
                      color: '#FFFFFF',
                    }}
                  >
                    Open {recommendedApp.name}
                  </GlowButton>
                  <Link
                    href={WORKFLOWS_ROUTE}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    View suggested workflow
                    <ExternalLink size={14} />
                  </Link>
                </Group>
              </Stack>
            </GlowCardContent>
          </GlowCard>
        );
      })()}
    </Stack>
  );
}
