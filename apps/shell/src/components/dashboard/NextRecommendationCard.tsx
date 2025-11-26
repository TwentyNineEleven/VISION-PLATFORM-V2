'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  GlowBadge,
  GlowCard,
  GlowCardContent,
  GlowCardFooter,
  GlowCardHeader,
  GlowCardTitle,
  GlowButton,
  Stack,
  Group,
  Text,
} from '@/components/glow-ui';
import { Lightbulb, Rocket, ExternalLink } from 'lucide-react';
import type { RecommendedApp } from '@/lib/dashboard/mockDashboardData';
import { AppIcon } from '@/components/apps/AppIcon';
import { getAppMeta, getPhaseLabel } from '@/lib/apps/appMetadata';
import { getPhaseTokenClasses, type PhaseTokenClasses } from '@/lib/phase-colors';
import { cn } from '@/lib/utils';

const fallbackPhaseTokens: PhaseTokenClasses = {
  badgeBackground: 'bg-vision-blue-50',
  badgeText: 'text-vision-blue-700',
  iconBackground: 'bg-vision-blue-50',
  iconText: 'text-vision-blue-700',
  buttonBackground: 'bg-vision-blue-700',
  buttonHover: 'hover:bg-vision-blue-900',
};

export interface NextRecommendationCardProps {
  recommendation?: RecommendedApp;
  onLaunchApp?: (appId: string, href: string) => void;
}

export function NextRecommendationCard({ recommendation, onLaunchApp }: NextRecommendationCardProps) {
  if (!recommendation) {
    return null;
  }

  const meta = getAppMeta(recommendation.appId);
  const phaseTokens = meta ? getPhaseTokenClasses(meta.phase) : fallbackPhaseTokens;
  const phaseLabel = meta ? getPhaseLabel(meta.phase) : 'Recommended';
  const contextAppName = recommendation.contextAppId ? getAppMeta(recommendation.contextAppId)?.name : null;

  return (
    <GlowCard
      variant="interactive"
      className="h-full border shadow-interactive"
    >
      <GlowCardHeader>
        <Group spacing="sm" align="center">
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg',
              phaseTokens.iconBackground,
              phaseTokens.iconText
            )}
          >
            <Lightbulb size={18} />
          </div>
          <GlowCardTitle className="text-sm">Next recommended step</GlowCardTitle>
        </Group>
      </GlowCardHeader>
      <GlowCardContent>
        <Stack spacing="md">
          <Group spacing="md">
            {meta && <AppIcon app={meta} size="lg" />}
            <Stack spacing="xs" className="flex-1">
              <Text size="lg" weight="semibold">
                {meta?.name || 'Recommended app'}
              </Text>
              <Text size="sm" color="tertiary">
                {recommendation.description}
              </Text>
              <GlowBadge
                variant="outline"
                size="sm"
                className={cn(
                  'border-transparent text-[11px]',
                  phaseTokens.badgeBackground,
                  phaseTokens.badgeText
                )}
              >
                {phaseLabel}
              </GlowBadge>
              {contextAppName && (
                <Text size="xs" color="secondary">
                  Based on your activity in {contextAppName}
                </Text>
              )}
            </Stack>
          </Group>
        </Stack>
      </GlowCardContent>
        <GlowCardFooter className="flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <GlowButton
            glow="subtle"
            className={cn('text-white', phaseTokens.buttonBackground, phaseTokens.buttonHover)}
            rightIcon={<Rocket className="h-4 w-4" />}
            onClick={() => onLaunchApp?.(recommendation.appId, recommendation.href)}
          >
            Open {meta?.name || 'app'}
          </GlowButton>
        <Link
          href={"/workflows" as any}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View suggested workflow
          <ExternalLink size={14} />
        </Link>
      </GlowCardFooter>
    </GlowCard>
  );
}
