'use client';

import * as React from 'react';
import { ArrowLeft, BarChart3, Sparkles } from 'lucide-react';
import { GlowButton, GlowCard } from '@/components/glow-ui';
import { useAppShell } from '@/components/layout/AppShell';
import { appMetadataList } from '@/lib/apps/appMetadata';
import { getPhaseTokenClasses } from '@/lib/phase-colors';

export default function ApplicationUsagePage() {
  const { openAppLauncher } = useAppShell();
  const sortedApps = React.useMemo(
    () =>
      [...appMetadataList]
        .map((app) => ({
          ...app,
          usageCount: app.usageCount ?? 0,
          lastUsed: app.lastUsed ?? null,
        }))
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)),
    []
  );

  const totalUsage = sortedApps.reduce((total, app) => total + (app.usageCount ?? 0), 0);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-5 py-6 shadow-ambient-card">
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
          <BarChart3 className="h-4 w-4" />
          Usage overview
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">VISION app usage</h1>
            <p className="text-muted-foreground">
              Track which apps are seeing the most activity so you can prioritize training, licenses, and rollouts.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <GlowButton asChild variant="ghost" size="sm" className="border-border">
              <a href="/applications" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to catalog
              </a>
            </GlowButton>
            <GlowButton
              variant="default"
              size="sm"
              rightIcon={<Sparkles className="h-4 w-4" />}
              onClick={openAppLauncher}
            >
              Ask VISION AI for adoption ideas
            </GlowButton>
          </div>
        </div>
      </div>

      <GlowCard padding="lg" className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-semibold text-foreground">Usage by app</div>
          <p className="text-sm text-muted-foreground">
            Sorted by most used. Usage counts come from app metadata; entries without data default to 0.
          </p>
          <p className="text-sm font-medium text-foreground">Total launches (mock): {totalUsage}</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/40">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  App
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Phase
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Usage
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Last used
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {sortedApps.map((app) => {
                const phaseTokens = getPhaseTokenClasses(app.phase);

                return (
                  <tr key={app.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{app.name}</td>
                    <td className="px-4 py-3 text-xs font-semibold uppercase">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 ${phaseTokens.badgeBackground} ${phaseTokens.badgeText}`}
                      >
                        {app.phase}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{app.usageCount ?? 0}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {app.lastUsed ? app.lastUsed.toLocaleDateString?.() ?? app.lastUsed.toString() : 'Not tracked'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlowCard>
    </div>
  );
}
