'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowBadge, GlowButton, GlowSwitch } from '@/components/glow-ui';
import { mockApps, mockAppSubscriptions } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Activity, Settings } from 'lucide-react';

export default function AppSubscriptionsPage() {
  const [enabledApps, setEnabledApps] = React.useState<Record<string, boolean>>(
    () =>
      mockApps.reduce<Record<string, boolean>>((acc, app) => {
        acc[app.id] = app.status === 'active';
        return acc;
      }, {})
  );

  const toggleApp = (id: string) => {
    setEnabledApps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <GlowCard variant="elevated">
        <GlowCardHeader className="space-y-1">
          <GlowCardTitle>Applications</GlowCardTitle>
          <GlowCardDescription>Enable, configure, and review app usage.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mockApps.map((app) => {
            const sub = mockAppSubscriptions.find((s) => s.appId === app.id);
            const Icon = app.icon || Activity;
            return (
              <GlowCard key={app.id} variant="interactive" padding="md" className="h-full">
                <GlowCardContent className="space-y-3 p-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow-glow-primary-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{app.name}</p>
                        <p className="text-xs text-muted-foreground">{app.description}</p>
                      </div>
                    </div>
                    <GlowBadge
                      variant={
                        app.status === 'coming-soon'
                          ? 'warning'
                          : enabledApps[app.id]
                            ? 'success'
                            : 'outline'
                      }
                      size="sm"
                    >
                      {app.status === 'coming-soon'
                        ? 'Coming soon'
                        : enabledApps[app.id]
                          ? 'Enabled'
                          : 'Disabled'}
                    </GlowBadge>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span>Active users: {sub?.activeUsers ?? 0}</span>
                    </div>
                    <span>Data: {sub?.dataObjects ?? 0}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <GlowSwitch
                      checked={enabledApps[app.id]}
                      disabled={app.status === 'coming-soon'}
                      onCheckedChange={() => toggleApp(app.id)}
                    />
                    <GlowButton variant="outline" size="sm" rightIcon={<Settings className="h-4 w-4" />}>
                      Configure
                    </GlowButton>
                  </div>
                </GlowCardContent>
              </GlowCard>
            );
          })}
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
