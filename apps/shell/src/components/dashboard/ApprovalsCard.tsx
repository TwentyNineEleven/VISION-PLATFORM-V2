'use client';

import * as React from 'react';
import { GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, GlowBadge, Group, Stack, Text } from '@/components/glow-ui';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { type Approval, formatRelativeTime } from '@/lib/dashboard/mockDashboardData';
import { getAppMeta } from '@/lib/apps/appMetadata';
import { getPhaseTokenClasses } from '@/lib/phase-colors';
import { cn } from '@/lib/utils';

export interface ApprovalsCardProps {
  approvals: Approval[];
}

function ApprovalRow({ approval }: { approval: Approval }) {
  const appMeta = getAppMeta(approval.appId);
  const appName = appMeta?.name || approval.appId;

  // Use Bold Color System tokens via getPhaseTokenClasses
  const phaseClasses = appMeta
    ? getPhaseTokenClasses(appMeta.phase)
    : { badgeBackground: 'bg-vision-gray-100', badgeText: 'text-vision-gray-700' };

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3 transition hover:border-border hover:shadow-sm">
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 mt-0.5',
          'bg-vision-orange-50 text-vision-orange-900'
        )}
      >
        <AlertCircle className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <Text size="sm" weight="medium" className="line-clamp-2">
          {approval.title}
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
            variant="warning"
            size="sm"
            className="text-[10px] font-semibold"
          >
            Needs review
          </GlowBadge>
          <Text size="xs" color="tertiary">
            {formatRelativeTime(approval.requestedAt)}
          </Text>
        </Group>
      </div>
      <button className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ApprovalsCard({ approvals }: ApprovalsCardProps) {
  return (
    <GlowCard variant="elevated" className="h-full">
      <GlowCardHeader>
        <GlowCardTitle className="text-lg">Alerts & approvals</GlowCardTitle>
      </GlowCardHeader>
      <GlowCardContent>
        <Stack spacing="sm">
          {approvals.map((approval) => (
            <ApprovalRow key={approval.id} approval={approval} />
          ))}
        </Stack>
      </GlowCardContent>
    </GlowCard>
  );
}

