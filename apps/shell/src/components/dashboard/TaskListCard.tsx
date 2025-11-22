'use client';

import * as React from 'react';
import Link from 'next/link';
import { GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, GlowBadge, Group, Stack, Text } from '@/components/glow-ui';
import { ArrowRight, Circle } from 'lucide-react';
import { type Task, formatDueDate } from '@/lib/dashboard/mockDashboardData';
import { getAppMeta, getPhaseColor, getPhaseLabel, getPhaseSoftColor } from '@/lib/apps/appMetadata';

export interface TaskListCardProps {
  tasks: Task[];
}

const statusConfig = {
  overdue: {
    color: '#B91C1C', // Electric Scarlet
    bg: 'rgba(185, 28, 28, 0.12)',
    label: 'Overdue',
  },
  'due-today': {
    color: '#C2410C', // Vivid Tangerine
    bg: 'rgba(194, 65, 12, 0.12)',
    label: 'Due today',
  },
  upcoming: {
    color: '#0047AB', // Bold Royal Blue
    bg: 'rgba(0, 71, 171, 0.12)',
    label: 'Due in',
  },
} as const;

function TaskRow({ task }: { task: Task }) {
  const config = statusConfig[task.status];
  const appMeta = getAppMeta(task.appId);
  const appName = appMeta?.name || task.appId;
  const phaseLabel = appMeta ? getPhaseLabel(appMeta.phase) : task.context;
  const phaseColor = appMeta ? getPhaseColor(appMeta.phase) : '#64748B';
  const phaseSoftColor = appMeta ? getPhaseSoftColor(appMeta.phase) : 'rgba(100, 116, 139, 0.12)';

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3 transition hover:border-border hover:shadow-sm">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
        style={{ backgroundColor: config.bg, color: config.color }}
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
            className="border-transparent text-[10px] font-medium"
            style={{
              backgroundColor: phaseSoftColor,
              color: phaseColor,
            }}
          >
            {appName}
          </GlowBadge>
          <GlowBadge
            variant="outline"
            size="sm"
            className="border-transparent text-[10px] font-medium uppercase tracking-wide"
            style={{
              backgroundColor: phaseSoftColor,
              color: phaseColor,
            }}
          >
            {phaseLabel}
          </GlowBadge>
          <GlowBadge
            variant="outline"
            size="sm"
            className="border-transparent text-[10px] font-semibold"
            style={{
              backgroundColor: config.bg,
              color: config.color,
            }}
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
              href="/apps/ops360"
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

