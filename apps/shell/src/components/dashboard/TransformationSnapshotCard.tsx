'use client';

import * as React from 'react';
import { GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, GlowBadge, Stack, Text } from '@/components/glow-ui';
import { type TransformationArea } from '@/lib/dashboard/mockDashboardData';
import { phaseLabels, phaseColorMap, phaseSoftColorMap } from '@/lib/phase-colors';
import type { Phase } from '@/lib/phase-colors';

export interface TransformationSnapshotCardProps {
  areas: TransformationArea[];
}

const phaseDescriptions: Record<Phase, string> = {
  VOICE: 'Listening & stakeholders',
  INSPIRE: 'Mission & vision',
  STRATEGIZE: 'Program design',
  INITIATE: '90-day plans',
  OPERATE: 'Ops & KPIs',
  NARRATE: 'Grants & stories',
  FUNDER: 'Tools for grantmakers',
};

function TransformationRow({ area }: { area: TransformationArea }) {
  const phaseColor = phaseColorMap[area.phase];
  const phaseSoftColor = phaseSoftColorMap[area.phase];
  const label = phaseLabels[area.phase];
  const description = phaseDescriptions[area.phase];

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-card/50 px-4 py-3 transition hover:border-border hover:shadow-sm">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="h-2 w-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: phaseColor }}
          />
          <Text size="sm" weight="medium" className="truncate">
            {label}
          </Text>
        </div>
        <Text size="xs" color="tertiary">
          {description}
        </Text>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <GlowBadge
          variant="outline"
          size="sm"
          className="border-transparent text-[10px] font-semibold"
          style={{
            backgroundColor: phaseSoftColor,
            color: phaseColor,
          }}
        >
          {area.activeApps} app{area.activeApps !== 1 ? 's' : ''}
        </GlowBadge>
      </div>
    </div>
  );
}

export function TransformationSnapshotCard({ areas }: TransformationSnapshotCardProps) {
  return (
    <GlowCard variant="elevated" className="h-full">
      <GlowCardHeader>
        <GlowCardTitle className="text-lg">Transformation snapshot</GlowCardTitle>
        <Text size="sm" color="secondary">
          Where your organization is investing time across TEIF components.
        </Text>
      </GlowCardHeader>
      <GlowCardContent>
        <Stack spacing="sm">
          {areas.map((area) => (
            <TransformationRow key={area.phase} area={area} />
          ))}
        </Stack>
        <div className="mt-4 pt-4 border-t border-border/50">
          <Text size="xs" color="tertiary" className="italic">
            Pinned by your funder
          </Text>
        </div>
      </GlowCardContent>
    </GlowCard>
  );
}
