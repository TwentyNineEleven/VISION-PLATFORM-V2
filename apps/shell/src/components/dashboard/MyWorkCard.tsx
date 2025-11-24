'use client';

import * as React from 'react';
import Link from 'next/link';
import { GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, GlowBadge, Group, Stack, Text } from '@/components/glow-ui';
import { CheckCircle2, Calendar, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import type { Task, Deadline, Approval } from '@/lib/dashboard/mockDashboardData';
import { formatRelativeTime, formatDueDate } from '@/lib/dashboard/mockDashboardData';
import { getAppMeta } from '@/lib/apps/appMetadata';
import { getPhaseTokenClasses } from '@/lib/phase-colors';
import { cn } from '@/lib/utils';

export interface MyWorkCardProps {
  tasks: Task[];
  deadlines: Deadline[];
  approvals: Approval[];
}

const statusConfig = {
  overdue: {
    icon: AlertTriangle,
    textColor: 'text-vision-red-900',       // Bold Color System
    bgColor: 'bg-vision-red-50',            // Bold Color System
    label: 'Overdue',
  },
  'due-today': {
    icon: Clock,
    textColor: 'text-vision-orange-900',    // Bold Color System
    bgColor: 'bg-vision-orange-50',         // Bold Color System
    label: 'Due today',
  },
  upcoming: {
    icon: Calendar,
    textColor: 'text-vision-blue-950',      // Bold Color System
    bgColor: 'bg-vision-blue-50',           // Bold Color System
    label: 'Upcoming',
  },
} as const;

export function MyWorkCard({ tasks, deadlines, approvals }: MyWorkCardProps) {
  return (
    <GlowCard variant="interactive" className="h-full">
      <GlowCardHeader>
        <Group spacing="sm" align="center">
          <CheckCircle2 className="h-4 w-4" />
          <GlowCardTitle className="text-sm">My Work Today</GlowCardTitle>
        </Group>
      </GlowCardHeader>
      <GlowCardContent>
        <Stack spacing="lg">
          {/* High Priority Tasks */}
          <Stack spacing="md">
            <Text size="sm" weight="semibold" color="secondary">
              High-priority tasks
            </Text>
            <Stack spacing="sm">
              {tasks.slice(0, 5).map((task) => {
                const config = statusConfig[task.status];
                const StatusIcon = config.icon;
                // Try to find app metadata using appId
                const taskAppMeta = getAppMeta(task.appId);
                // Use Bold Color System tokens via getPhaseTokenClasses
                const phaseClasses = taskAppMeta
                  ? getPhaseTokenClasses(taskAppMeta.phase)
                  : { badgeBackground: 'bg-vision-gray-100', badgeText: 'text-vision-gray-700' };

                return (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-accent/50"
                  >
                    {/* Left: Status indicator dot */}
                    <div
                      className={cn(
                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
                        config.bgColor,
                        config.textColor
                      )}
                    >
                      <StatusIcon size={14} />
                    </div>
                    {/* Middle: Task content */}
                    <Stack spacing="xs" className="flex-1 min-w-0">
                      <Text size="sm" weight="medium" className="line-clamp-2">
                        {task.title}
                      </Text>
                      <Group spacing="xs" wrap="wrap">
                        <GlowBadge
                          variant="outline"
                          size="sm"
                          className={cn(
                            'border-transparent text-[10px]',
                            phaseClasses.badgeBackground,
                            phaseClasses.badgeText
                          )}
                        >
                          {taskAppMeta?.name ?? task.appId}
                        </GlowBadge>
                        {taskAppMeta && (
                          <GlowBadge
                            variant="outline"
                            size="sm"
                            className={cn(
                              'border-transparent text-[10px] uppercase',
                              phaseClasses.badgeBackground,
                              phaseClasses.badgeText
                            )}
                          >
                            {taskAppMeta.phase}
                          </GlowBadge>
                        )}
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
                    </Stack>
                  </div>
                );
              })}
            </Stack>
          </Stack>

          {/* Upcoming Deadlines */}
          <Stack spacing="md">
            <Text size="sm" weight="semibold" color="secondary">
              Upcoming deadlines
            </Text>
            <Stack spacing="sm">
              {deadlines.slice(0, 3).map((deadline) => {
                const isReport = deadline.type === 'report';
                // Use Bold Color System tokens
                const typeClasses = isReport
                  ? { bgColor: 'bg-vision-blue-50', textColor: 'text-vision-blue-700' }
                  : { bgColor: 'bg-vision-purple-50', textColor: 'text-vision-purple-900' };

                return (
                  <div
                    key={deadline.id}
                    className="flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-accent/50"
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
                        typeClasses.bgColor,
                        typeClasses.textColor
                      )}
                    >
                      <Calendar size={14} />
                    </div>
                    <Stack spacing="xs" className="flex-1 min-w-0">
                      <Text size="sm" weight="medium" className="line-clamp-1">
                        {deadline.title}
                      </Text>
                      <Group spacing="xs" wrap="wrap">
                        <Text size="xs" color="tertiary">
                          {getAppMeta(deadline.appId)?.name ?? deadline.appId}
                        </Text>
                        <Text size="xs" color="tertiary">
                          ·
                        </Text>
                        <Text size="xs" color="tertiary">
                          {formatDueDate(deadline.dueDate)}
                        </Text>
                        <GlowBadge
                          variant="outline"
                          size="sm"
                          className={cn(
                            'border-transparent text-[10px]',
                            typeClasses.bgColor,
                            typeClasses.textColor
                          )}
                        >
                          {deadline.type === 'report' ? 'Report' : 'Grant'}
                        </GlowBadge>
                      </Group>
                    </Stack>
                  </div>
                );
              })}
            </Stack>
          </Stack>

          {/* Alerts & Approvals */}
          {approvals.length > 0 && (
            <Stack spacing="md">
              <Text size="sm" weight="semibold" color="secondary">
                Alerts & approvals
              </Text>
              <Stack spacing="sm">
                {approvals.map((approval) => (
                  <div
                    key={approval.id}
                    className="flex items-start gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-accent/50"
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
                        'bg-vision-orange-50 text-vision-orange-900'  // Bold Color System
                      )}
                    >
                      <AlertTriangle size={14} />
                    </div>
                    <Stack spacing="xs" className="flex-1 min-w-0">
                      <Text size="sm" weight="medium" className="line-clamp-2">
                        {approval.title}
                      </Text>
                      <Group spacing="xs" wrap="wrap">
                        <Text size="xs" color="tertiary">
                          {getAppMeta(approval.appId)?.name ?? approval.appId}
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
                    </Stack>
                  </div>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Footer Link */}
          <Link
            href="/applications"
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-2"
          >
            View all tasks in Ops360
            <ArrowRight size={14} />
          </Link>
        </Stack>
      </GlowCardContent>
    </GlowCard>
  );
}
