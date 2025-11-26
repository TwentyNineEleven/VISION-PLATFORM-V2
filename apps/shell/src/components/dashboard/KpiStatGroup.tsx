'use client';

import * as React from 'react';
import { GlowCard, Stack, Group, Text } from '@/components/glow-ui';
import { BarChart3, Clock, AlertCircle, Activity } from 'lucide-react';
import type { Kpi } from '@/lib/dashboard/mockDashboardData';
import { visionSemantic } from '@/design-system/theme/visionTheme';

export interface KpiStatGroupProps {
  kpis: Kpi[];
}

const semanticConfig: Record<
  Kpi['semantic'],
  { color: string; tint: string; icon: React.ComponentType<any> }
> = {
  info: {
    color: visionSemantic.states.info.text,
    tint: visionSemantic.states.info.bg,
    icon: Activity,
  },
  warning: {
    color: visionSemantic.states.warning.text,
    tint: visionSemantic.states.warning.bg,
    icon: Clock,
  },
  error: {
    color: visionSemantic.states.error.text,
    tint: visionSemantic.states.error.bg,
    icon: AlertCircle,
  },
  success: {
    color: visionSemantic.states.success.text,
    tint: visionSemantic.states.success.bg,
    icon: BarChart3,
  },
};

export function KpiStatGroup({ kpis }: KpiStatGroupProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const { color, tint, icon: Icon } = semanticConfig[kpi.semantic];
        return (
          <GlowCard
            key={kpi.id}
            variant="elevated"
            padding="md"
            className="border border-border/70"
          >
            <Stack spacing="sm">
              <Group spacing="sm" align="center">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: tint,
                    color,
                  }}
                >
                  <Icon size={18} />
                </div>
                <Text size="sm" color="secondary" className="uppercase tracking-wide">
                  {kpi.label}
                </Text>
                <div className="flex-1" />
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </Group>
              <Stack spacing="none">
                <Text
                  size="xl"
                  weight="semibold"
                  className="leading-tight"
                  style={{ color }}
                >
                  {kpi.value}
                </Text>
                <Text size="xs" color="tertiary">
                  {kpi.sublabel}
                </Text>
              </Stack>
            </Stack>
          </GlowCard>
        );
      })}
    </div>
  );
}
