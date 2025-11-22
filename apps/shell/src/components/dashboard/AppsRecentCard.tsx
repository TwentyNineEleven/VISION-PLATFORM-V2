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
import { Clock } from 'lucide-react';
import type { AppActivity } from '@/lib/dashboard/mockDashboardData';
import { formatRelativeTime } from '@/lib/dashboard/mockDashboardData';
import { DashboardAppCard } from '@/components/apps/DashboardAppCard';
import { getAppMeta } from '@/lib/apps/appMetadata';

export interface AppsRecentCardProps {
  apps: AppActivity[];
  onLaunchApp?: (appId: string, href: string) => void;
}

export function AppsRecentCard({ apps, onLaunchApp }: AppsRecentCardProps) {
  return (
    <GlowCard variant="interactive" className="h-full">
      <GlowCardHeader>
        <Group spacing="sm" align="center">
          <Clock className="h-4 w-4" />
          <GlowCardTitle className="text-sm">Recent apps</GlowCardTitle>
        </Group>
      </GlowCardHeader>
      <GlowCardContent>
        <Stack spacing="md">
          {apps.map((activity) => {
            const meta = getAppMeta(activity.appId);
            if (!meta) return null;

            return (
              <Stack key={activity.appId} spacing="xs">
                <DashboardAppCard
                  app={meta}
                  className="w-full"
                  onLaunch={() => onLaunchApp?.(activity.appId, activity.href)}
                />
                {activity.lastUsed && (
                  <Text size="xs" color="tertiary">
                    Last used {formatRelativeTime(activity.lastUsed)}
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
