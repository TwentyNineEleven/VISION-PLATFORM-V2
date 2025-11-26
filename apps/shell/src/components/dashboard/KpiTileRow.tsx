'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { GlowCard, Stack, Group, Text } from '@/components/glow-ui';
import { TrendingUp, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import type { Kpi } from '@/lib/dashboard/mockDashboardData';
import { cn } from '@/lib/utils';
import { visionSemantic } from '@/design-system/theme/visionTheme';

export interface KpiTileRowProps {
  kpis: Kpi[];
}

// Semantic color mapping backed by Bold Color System tokens
const semanticColors = {
  info: {
    text: visionSemantic.states.info.text,
    tint: visionSemantic.states.info.bg,
  },
  warning: {
    text: visionSemantic.states.warning.text,
    tint: visionSemantic.states.warning.bg,
  },
  error: {
    text: visionSemantic.states.error.text,
    tint: visionSemantic.states.error.bg,
  },
  success: {
    text: visionSemantic.states.success.text,
    tint: visionSemantic.states.success.bg,
  },
} as const;

const iconMap = {
  info: TrendingUp,
  warning: Clock,
  error: AlertCircle,
  success: BarChart3,
} as const;

export function KpiTileRow({ kpis }: KpiTileRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = iconMap[kpi.semantic];
        const { text: semanticColor, tint } = semanticColors[kpi.semantic];

        return (
          <Link key={kpi.id} href={kpi.href as any} className="block">
            <GlowCard
              variant="elevated"
              padding="md"
              className="h-full cursor-pointer transition-all hover:shadow-interactive-hover hover:-translate-y-0.5"
            >
              <Stack spacing="sm" className="h-full">
                <Group spacing="sm" align="center">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: tint,
                      color: semanticColor,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <Text size="sm" color="secondary" className="truncate flex-1">
                    {kpi.label}
                  </Text>
                </Group>
                <Stack spacing="none" align="start">
                  <Text
                    size="xl"
                    weight="semibold"
                    className="text-3xl leading-none"
                    style={{ color: semanticColor }}
                  >
                    {kpi.value}
                  </Text>
                  <Text size="xs" color="tertiary" className="mt-1">
                    {kpi.sublabel}
                  </Text>
                </Stack>
              </Stack>
            </GlowCard>
          </Link>
        );
      })}
    </div>
  );
}

