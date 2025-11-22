'use client';

import * as React from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { AppSwitcher } from '@/components/dashboard/AppSwitcher';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowBadge, GlowButton } from '@/components/glow-ui';
import { mockApps, mockCohorts } from '@/lib/mock-data';
import { CalendarClock, Users, Plus } from 'lucide-react';

export default function FunderCohortsPage() {
  const [appSwitcherOpen, setAppSwitcherOpen] = React.useState(false);

  return (
    <>
      <AppSwitcher
        open={appSwitcherOpen}
        onOpenChange={setAppSwitcherOpen}
        apps={mockApps}
        onSelectApp={(app) => {
          if (app.status === 'active') {
            window.location.href = app.launchPath || `/apps/${app.id}`;
          }
        }}
      />
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
          <DashboardNavbar onAppSwitcherClick={() => setAppSwitcherOpen(true)} />

          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-primary">Funder</p>
                  <h1 className="text-3xl font-semibold text-foreground">Cohorts</h1>
                  <p className="text-sm text-muted-foreground">
                    Organize grantees into cohorts for learning, pilots, and capacity building.
                  </p>
                </div>
                <GlowButton glow="subtle" leftIcon={<Plus className="h-4 w-4" />}>
                  New cohort
                </GlowButton>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mockCohorts.map((cohort) => (
                  <GlowCard key={cohort.id} variant="interactive" padding="md" className="h-full">
                    <GlowCardHeader className="space-y-1">
                      <GlowCardTitle className="text-lg">{cohort.name}</GlowCardTitle>
                      <GlowCardDescription>{cohort.focus}</GlowCardDescription>
                    </GlowCardHeader>
                    <GlowCardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {cohort.memberCount} members
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <CalendarClock className="h-4 w-4" />
                          {cohort.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <GlowBadge variant="outline" size="sm">
                        Active
                      </GlowBadge>
                    </GlowCardContent>
                  </GlowCard>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
