'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardHeader,
  GlowCardContent,
  GlowCardTitle,
  Stack,
  Group,
  Text,
} from '@/components/glow-ui';
import { Star } from 'lucide-react';
import type { AppActivity } from '@/lib/dashboard/mockDashboardData';
import { DashboardAppCard } from '@/components/apps/DashboardAppCard';
import { getAppMeta } from '@/lib/apps/appMetadata';

export interface AppsFavoritesCardProps {
  apps: AppActivity[];
  onLaunchApp?: (appId: string, href: string) => void;
}

export function AppsFavoritesCard({ apps, onLaunchApp }: AppsFavoritesCardProps) {
  return (
    <GlowCard variant="interactive" className="h-full">
      <GlowCardHeader>
        <Group spacing="sm" align="center">
          <Star className="h-4 w-4 text-vision-orange" />
          <GlowCardTitle className="text-sm">Favorites</GlowCardTitle>
        </Group>
      </GlowCardHeader>
      <GlowCardContent>
        <Stack spacing="md">
          {apps.map((activity) => {
            const meta = getAppMeta(activity.appId);
            if (!meta) {
              return null;
            }
            return (
              <Stack key={activity.appId} spacing="xs">
                <DashboardAppCard
                  app={meta}
                  className="w-full"
                  onLaunch={() => onLaunchApp?.(activity.appId, activity.href)}
                />
                {activity.note && (
                  <Text size="xs" color="secondary">
                    {activity.note}
                  </Text>
                )}
              </Stack>
            );
          })}
        </Stack>
      </GlowCardContent>
    </GlowCard>
  );
}
