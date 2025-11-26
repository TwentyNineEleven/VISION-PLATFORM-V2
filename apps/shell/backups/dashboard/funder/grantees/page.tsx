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
import { GlowInput, GlowBadge, GlowButton } from '@/components/glow-ui';
import { mockApps, mockGrantees } from '@/lib/mock-data';
import { Filter, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FunderGranteesPage() {
  const [appSwitcherOpen, setAppSwitcherOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'on-track' | 'at-risk' | 'off-track'>('all');
  const [riskFilter, setRiskFilter] = React.useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filtered = mockGrantees.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || g.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

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
                  <h1 className="text-3xl font-semibold text-foreground">Grantees</h1>
                  <p className="text-sm text-muted-foreground">
                    Monitor performance, capacity, and risk across grantees.
                  </p>
                </div>
                <GlowButton glow="subtle" rightIcon={<Users className="h-4 w-4" />}>
                  Invite grantee
                </GlowButton>
              </div>

              <GlowCard variant="flat">
                <GlowCardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <GlowCardTitle>Filters</GlowCardTitle>
                    <GlowCardDescription>Search and filter the portfolio.</GlowCardDescription>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs text-primary">
                    <Filter className="h-4 w-4" />
                    Dynamic filters
                  </div>
                </GlowCardHeader>
                <GlowCardContent className="grid gap-4 md:grid-cols-3">
                  <GlowInput
                    placeholder="Search grantees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="all">All</option>
                      <option value="on-track">On Track</option>
                      <option value="at-risk">At Risk</option>
                      <option value="off-track">Off Track</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Risk level</label>
                    <select
                      value={riskFilter}
                      onChange={(e) => setRiskFilter(e.target.value as any)}
                      className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="all">All</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </GlowCardContent>
              </GlowCard>

              <GlowCard variant="elevated">
                <GlowCardHeader>
                  <GlowCardTitle>Portfolio</GlowCardTitle>
                  <GlowCardDescription>Capacity and risk snapshot.</GlowCardDescription>
                </GlowCardHeader>
                <GlowCardContent className="overflow-hidden rounded-lg border border-border">
                  <table className="min-w-full divide-y divide-border text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Grantee</th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Focus</th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Capacity</th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Risk</th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Last check-in</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.map((grantee) => (
                        <tr key={grantee.id} className="hover:bg-muted/70">
                          <td className="px-4 py-3 font-semibold text-foreground">{grantee.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{grantee.focusArea}</td>
                          <td className="px-4 py-3">
                            <GlowBadge
                              variant={
                                grantee.status === 'on-track'
                                  ? 'success'
                                  : grantee.status === 'at-risk'
                                    ? 'warning'
                                    : 'destructive'
                              }
                              size="sm"
                            >
                              {grantee.status}
                            </GlowBadge>
                          </td>
                          <td className="px-4 py-3 text-foreground">{grantee.capacityScore}%</td>
                          <td className="px-4 py-3">
                            <GlowBadge
                              variant={
                                grantee.riskLevel === 'high'
                                  ? 'destructive'
                                  : grantee.riskLevel === 'medium'
                                    ? 'warning'
                                    : 'outline'
                              }
                              size="sm"
                            >
                              {grantee.riskLevel}
                            </GlowBadge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {grantee.lastCheckIn.toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No grantees match the current filters.
                    </p>
                  )}
                </GlowCardContent>
              </GlowCard>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
