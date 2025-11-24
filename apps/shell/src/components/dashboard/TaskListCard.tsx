'use client';

import * as React from 'react';
import Link from 'next/link';
import { GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, GlowBadge, Group, Stack, Text } from '@/components/glow-ui';
import { ArrowRight, Circle } from 'lucide-react';
import { type Task, formatDueDate } from '@/lib/dashboard/mockDashboardData';
import { getAppMeta, getPhaseLabel } from '@/lib/apps/appMetadata';
import { getPhaseTokenClasses } from '@/lib/phase-colors';
import { cn } from '@/lib/utils';

export interface TaskListCardProps {
  tasks: Task[];
}

const statusConfig = {
  overdue: {
    textColor: 'text-vision-red-900',       // Bold Color System
    bgColor: 'bg-vision-red-50',            // Bold Color System
    label: 'Overdue',
  },
  'due-today': {
    textColor: 'text-vision-orange-900',    // Bold Color System
    bgColor: 'bg-vision-orange-50',         // Bold Color System
    label: 'Due today',
  },
  upcoming: {
    textColor: 'text-vision-blue-950',      // Bold Color System
    bgColor: 'bg-vision-blue-50',           // Bold Color System
    label: 'Due in',
  },
} as const;

function TaskRow({ task }: { task: Task }) {
  const config = statusConfig[task.status];
  const appMeta = getAppMeta(task.appId);
  const appName = appMeta?.name || task.appId;
  const phaseLabel = appMeta ? getPhaseLabel(appMeta.phase) : task.context;

  // Use Bold Color System tokens via getPhaseTokenClasses
  const phaseClasses = appMeta
    ? getPhaseTokenClasses(appMeta.phase)
    : { badgeBackground: 'bg-vision-gray-100', badgeText: 'text-vision-gray-700' };

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3 transition hover:border-border hover:shadow-sm">
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 mt-0.5',
          config.bgColor,
          config.textColor
        )}
      >
        <Circle className="h-3 w-3 fill-current" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <Text size="sm" weight="medium" className="line-clamp-2">
          {task.title}
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
              'border-transparent text-[10px] font-medium uppercase tracking-wide',
              phaseClasses.badgeBackground,
              phaseClasses.badgeText
            )}
          >
            {phaseLabel}
          </GlowBadge>
          <GlowBadge
            variant="outline"
            size="sm"
            className={cn(
              'border-transparent text-[10px] font-semibold',
              config.bgColor,
              config.textColor
            )}
          >
            {formatDueDate(task.dueDate, task.status)}
          </GlowBadge>
        </Group>
      </div>
    </div>
  );
}

export function TaskListCard({ tasks }: TaskListCardProps) {
  return (
    <GlowCard variant="elevated" className="h-full">
      <GlowCardHeader>
        <GlowCardTitle className="text-lg">My work today</GlowCardTitle>
        <Text size="sm" color="secondary">
          Tasks, key deadlines, and approvals in one glance.
        </Text>
      </GlowCardHeader>
      <GlowCardContent>
        <Stack spacing="md">
          <Stack spacing="sm">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </Stack>
          <div className="flex justify-end pt-2">
            <Link
              href="/applications"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all tasks in Ops360
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Stack>
      </GlowCardContent>
    </GlowCard>
  );
}

