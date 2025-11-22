'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardContent,
  GlowBadge,
  Group,
  Stack,
  Text,
} from '@/components/glow-ui';
import {
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  type Task,
  type Deadline,
  type Approval,
  formatDueDate,
  formatRelativeTime,
} from '@/lib/dashboard/mockDashboardData';
import {
  getAppMeta,
  getPhaseColor,
  getPhaseLabel,
  getPhaseSoftColor,
} from '@/lib/apps/appMetadata';

export interface MyWorkTodayCardProps {
  tasks: Task[];
  deadlines: Deadline[];
  approvals: Approval[];
}

const statusConfig = {
  overdue: {
    icon: AlertTriangle,
    color: '#DB2777', // NARRATE
    bg: 'rgba(219, 39, 119, 0.15)',
    label: 'Overdue',
  },
  'due-today': {
    icon: Clock,
    color: '#C2410C', // INSPIRE
    bg: 'rgba(194, 65, 12, 0.18)',
    label: 'Due today',
  },
  upcoming: {
    icon: Calendar,
    color: '#2563EB', // INITIATE
    bg: 'rgba(37, 99, 235, 0.15)',
    label: 'Upcoming',
  },
} as const;

function TaskRow({ task }: { task: Task }) {
  const config = statusConfig[task.status];
  const AppMeta = getAppMeta(task.appId);
  const appName = AppMeta?.name || task.appId;
  const phaseLabel = AppMeta ? getPhaseLabel(AppMeta.phase) : task.context;
  const phaseColor = AppMeta ? getPhaseColor(AppMeta.phase) : '#64748B';
  const phaseSoftColor = AppMeta ? getPhaseSoftColor(AppMeta.phase) : 'rgba(100, 116, 139, 0.12)';

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border border-opacity-40 bg-card px-3 py-3 transition hover:border-border hover:shadow-glow-primary-sm">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        <config.icon size={16} />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <Text size="sm" weight="medium" className="line-clamp-2">
          {task.title}
        </Text>
        <Group spacing="sm" wrap="wrap">
          <GlowBadge
            variant="outline"
            size="sm"
            className="border-transparent text-[11px]"
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
            className="border-transparent text-[11px]"
            style={{
              backgroundColor: phaseSoftColor,
              color: phaseColor,
            }}
          >
            {phaseLabel || task.context}
          </GlowBadge>
          <GlowBadge
            variant="outline"
            size="sm"
            className="border-transparent text-[11px] font-semibold"
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

function TimelineRow({
  title,
  appId,
  dueDate,
  type,
  iconColor,
}: {
  title: string;
  appId: string;
  dueDate: string;
  type: 'deadline' | 'grant';
  iconColor: string;
}) {
  const AppMeta = getAppMeta(appId);
  const appName = AppMeta?.name || appId;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border border-opacity-40 bg-card px-3 py-3 transition hover:border-border">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-xl"
        style={{
          backgroundColor: `${iconColor}30`,
          color: iconColor,
        }}
      >
        <Calendar size={16} />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <Text size="sm" weight="medium" className="line-clamp-2">
          {title}
        </Text>
        <Group spacing="sm" wrap="wrap">
          <Text size="xs" color="tertiary">
            {appName}
          </Text>
          <Text size="xs" color="tertiary">
            ·
          </Text>
          <Text size="xs" color="tertiary">
            {formatDueDate(dueDate)}
          </Text>
          <GlowBadge
            variant="outline"
            size="sm"
            className="border-transparent text-[11px]"
            style={{
              backgroundColor: `${iconColor}15`,
              color: iconColor,
            }}
          >
            {type === 'deadline' ? 'Report' : 'Grant'}
          </GlowBadge>
        </Group>
      </div>
    </div>
  );
}

function ApprovalRow({ approval }: { approval: Approval }) {
  const AppMeta = getAppMeta(approval.appId);
  const appName = AppMeta?.name || approval.appId;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border border-opacity-40 bg-card px-3 py-3 transition hover:border-border">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-xl"
        style={{
          backgroundColor: 'rgba(194, 65, 12, 0.15)',
          color: '#C2410C',
        }}
      >
        <AlertTriangle size={16} />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <Text size="sm" weight="medium" className="line-clamp-2">
          {approval.title}
        </Text>
        <Group spacing="sm" wrap="wrap">
          <Text size="xs" color="tertiary">
            {appName}
          </Text>
          <Text size="xs" color="tertiary">
            ·
          </Text>
          <Text size="xs" color="tertiary">
            {approval.requestedBy}
          </Text>
          <Text size="xs" color="tertiary">
            ·
          </Text>
          <Text size="xs" color="tertiary">
            {formatRelativeTime(approval.requestedAt)}
          </Text>
        </Group>
      </div>
    </div>
  );
}

export function MyWorkTodayCard({ tasks, deadlines, approvals }: MyWorkTodayCardProps) {
  return (
    <GlowCard variant="elevated" className="h-full">
      <GlowCardHeader>
        <Group spacing="sm" align="center">
          <CheckCircle2 className="h-5 w-5 text-vision-blue" />
          <GlowCardTitle className="text-lg md:text-xl">My Work Today</GlowCardTitle>
        </Group>
        <Text size="xs" color="tertiary">
          Task focus, incoming deadlines, and approvals in one glance.
        </Text>
      </GlowCardHeader>
      <GlowCardContent>
        <Stack spacing="lg">
          <Stack spacing="md">
            <Text size="sm" weight="semibold" color="secondary">
              High-priority tasks
            </Text>
            <Stack spacing="sm">
              {tasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </Stack>
          </Stack>

          <div className="h-px" style={{ backgroundColor: 'rgba(148, 163, 184, 0.25)' }} />

          <Stack spacing="md">
            <Text size="sm" weight="semibold" color="secondary">
              Upcoming deadlines
            </Text>
            <Stack spacing="sm">
              {deadlines.map((deadline) => (
                <TimelineRow
                  key={deadline.id}
                  title={deadline.title}
                  appId={deadline.appId}
                  dueDate={deadline.dueDate}
                  type={deadline.type === 'grant' ? 'grant' : 'deadline'}
                  iconColor={deadline.type === 'grant' ? '#2563EB' : '#7C3AED'}
                />
              ))}
            </Stack>
          </Stack>

          <div className="h-px" style={{ backgroundColor: 'rgba(148, 163, 184, 0.25)' }} />

          <Stack spacing="md">
            <Text size="sm" weight="semibold" color="secondary">
              Alerts & approvals
            </Text>
            <Stack spacing="sm">
              {approvals.map((approval) => (
                <ApprovalRow key={approval.id} approval={approval} />
              ))}
            </Stack>
          </Stack>

          <Link
            href="/apps/ops360"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all tasks in Ops360
            <ArrowRight size={14} />
          </Link>
        </Stack>
      </GlowCardContent>
    </GlowCard>
  );
}
