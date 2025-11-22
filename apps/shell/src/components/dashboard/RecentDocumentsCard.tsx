'use client';

import * as React from 'react';
import { GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, GlowBadge, Group, Stack, Text } from '@/components/glow-ui';
import { FileText, MoreVertical } from 'lucide-react';
import { type Document, formatRelativeTime } from '@/lib/dashboard/mockDashboardData';
import { getAppMeta, getPhaseColor, getPhaseSoftColor } from '@/lib/apps/appMetadata';

export interface RecentDocumentsCardProps {
  documents: Document[];
}

function DocumentRow({ document }: { document: Document }) {
  const appMeta = getAppMeta(document.appId);
  const appName = appMeta?.name || document.appId;
  const phaseColor = appMeta ? getPhaseColor(appMeta.phase) : '#64748B';
  const phaseSoftColor = appMeta ? getPhaseSoftColor(appMeta.phase) : 'rgba(100, 116, 139, 0.12)';

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3 transition hover:border-border hover:shadow-sm cursor-pointer">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
        style={{
          backgroundColor: phaseSoftColor,
          color: phaseColor,
        }}
      >
        <FileText className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <Text size="sm" weight="medium" className="line-clamp-1">
          {document.title}
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
          <Text size="xs" color="tertiary">
            Updated {formatRelativeTime(document.updatedAt)} by {document.updatedBy}
          </Text>
        </Group>
      </div>
      <button className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
        <MoreVertical className="h-4 w-4" />
      </button>
    </div>
  );
}

export function RecentDocumentsCard({ documents }: RecentDocumentsCardProps) {
  return (
    <GlowCard variant="elevated" className="h-full">
      <GlowCardHeader>
        <GlowCardTitle className="text-lg">Recent documents & drafts</GlowCardTitle>
      </GlowCardHeader>
      <GlowCardContent>
        <Stack spacing="sm">
          {documents.map((document) => (
            <DocumentRow key={document.id} document={document} />
          ))}
        </Stack>
      </GlowCardContent>
    </GlowCard>
  );
}
