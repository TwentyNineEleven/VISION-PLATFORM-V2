'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { GlowCard, Stack, Group, Text } from '@/components/glow-ui';
import { TrendingUp, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import type { Kpi } from '@/lib/dashboard/mockDashboardData';
import { cn } from '@/lib/utils';

export interface KpiTileRowProps {
  kpis: Kpi[];
}

// Semantic color mapping to Bold Color System v3.0
const semanticColors = {
  info: '#0047AB',      // Bold Royal Blue (vision-blue-950)
  warning: '#C2410C',   // Vivid Tangerine (vision-orange-900)
  error: '#B91C1C',     // Electric Scarlet (vision-red-900)
  success: '#047857',   // Vivid Forest Green (vision-green-900)
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
        const color = semanticColors[kpi.semantic];

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
                      backgroundColor: `${color}15`,
                      color: color,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <Text size="sm" color="secondary" className="truncate flex-1">
                    {kpi.label}
                  </Text>
                </Group>
                <Stack spacing="none" align="start">
                  <Text size="xl" weight="semibold" className="text-3xl leading-none" style={{ color }}>
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
