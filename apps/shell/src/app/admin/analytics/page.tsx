'use client';

import * as React from 'react';
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from '@/components/glow-ui';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide analytics and reporting.
        </p>
      </div>

      <GlowCard variant="interactive">
        <GlowCardHeader>
          <GlowCardTitle>Coming Soon</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          <p className="text-sm text-muted-foreground">
            Analytics dashboard with charts, metrics, and export functionality is under development.
          </p>
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
