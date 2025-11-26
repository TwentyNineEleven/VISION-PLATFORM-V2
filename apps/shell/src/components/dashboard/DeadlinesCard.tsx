'use client';

import * as React from 'react';
import Link from 'next/link';
import { GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, GlowBadge, Group, Stack, Text } from '@/components/glow-ui';
import { FileText, ArrowRight } from 'lucide-react';
import { type Deadline, formatDueDate } from '@/lib/dashboard/mockDashboardData';
import { getAppMeta } from '@/lib/apps/appMetadata';
import { getPhaseTokenClasses } from '@/lib/phase-colors';
import { cn } from '@/lib/utils';

export interface DeadlinesCardProps {
  deadlines: Deadline[];
}

function DeadlineRow({ deadline }: { deadline: Deadline }) {
  const appMeta = getAppMeta(deadline.appId);
  const appName = appMeta?.name || deadline.appId;

  // Use Bold Color System tokens via getPhaseTokenClasses
  const phaseClasses = appMeta
    ? getPhaseTokenClasses(appMeta.phase)
    : { iconBackground: 'bg-vision-gray-100', iconText: 'text-vision-gray-700', badgeBackground: 'bg-vision-gray-100', badgeText: 'text-vision-gray-700' };

  // Format date for chip (e.g., "Dec 14", "Jan 3")
  const date = new Date(deadline.dueDate + 'T00:00:00Z');
  const dateChip = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3 transition hover:border-border hover:shadow-sm">
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 mt-0.5',
          phaseClasses.iconBackground,
          phaseClasses.iconText
        )}
      >
        <FileText className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <Text size="sm" weight="medium" className="line-clamp-2">
          {deadline.title}
        </Text>
        <Group spacing="sm" wrap="wrap">
          <GlowBadge
            variant="outline"
            size="sm"
            className={cn(
              'border-transparent text-[10px] font-medium',
              phaseClasses.badgeBackground,
              phaseClasses.badgeText
            )}
          >
            {appName}
          </GlowBadge>
          <GlowBadge
            variant="outline"
            size="sm"
            className={cn(
              'border-transparent text-[10px] font-semibold',
              phaseClasses.badgeBackground,
              phaseClasses.badgeText
            )}
          >
            {dateChip}
          </GlowBadge>
        </Group>
      </div>
    </div>
  );
}

export function DeadlinesCard({ deadlines }: DeadlinesCardProps) {
  return (
    <GlowCard variant="elevated" className="h-full">
      <GlowCardHeader>
        <GlowCardTitle className="text-lg">Upcoming deadlines</GlowCardTitle>
      </GlowCardHeader>
      <GlowCardContent>
        <Stack spacing="md">
          <Stack spacing="sm">
            {deadlines.map((deadline) => (
              <DeadlineRow key={deadline.id} deadline={deadline} />
            ))}
          </Stack>
          <div className="flex justify-end pt-2">
            <Link
              href={"/dashboard/deadlines" as any}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              See all deadlines
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Stack>
      </GlowCardContent>
    </GlowCard>
  );
}

