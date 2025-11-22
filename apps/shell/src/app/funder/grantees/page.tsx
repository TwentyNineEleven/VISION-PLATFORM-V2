'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowInput, GlowBadge, GlowButton } from '@/components/glow-ui';
import { mockApps, mockGrantees, mockCohorts } from '@/lib/mock-data';
import { Filter, Users, Download, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FunderGranteesPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'on-track' | 'at-risk' | 'off-track'>('all');
  const [riskFilter, setRiskFilter] = React.useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [cohortFilter, setCohortFilter] = React.useState<'all' | string>('all');

  const filtered = mockGrantees.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || g.riskLevel === riskFilter;
    const matchesCohort = cohortFilter === 'all' || g.cohortId === cohortFilter;
    return matchesSearch && matchesStatus && matchesRisk && matchesCohort;
  });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">Funder</p>
          <h1 className="text-3xl font-semibold text-foreground">Grantees</h1>
          <p className="text-sm text-muted-foreground">Monitor performance, capacity, and risk across grantees.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <GlowButton variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Export CSV
          </GlowButton>
          <GlowButton glow="subtle" rightIcon={<Users className="h-4 w-4" />}>
            Invite grantee
          </GlowButton>
        </div>
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
                <GlowCardContent className="grid gap-4 md:grid-cols-4">
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cohort</label>
                    <select
                      value={cohortFilter}
                      onChange={(e) => setCohortFilter(e.target.value as any)}
                      className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="all">All cohorts</option>
                      {mockCohorts.map((cohort) => (
                        <option key={cohort.id} value={cohort.id}>
                          {cohort.name}
                        </option>
                      ))}
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
                        <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
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
                          <td className="px-4 py-3 text-foreground">
                            <div className="space-y-1">
                              <div className="h-2 rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${grantee.capacityScore}%`,
                                    backgroundColor:
                                      grantee.capacityScore >= 80
                                        ? 'rgb(34 197 94)'
                                        : grantee.capacityScore >= 60
                                          ? 'rgb(234 179 8)'
                                          : 'rgb(239 68 68)',
                                  }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{grantee.capacityScore}%</span>
                            </div>
                          </td>
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
                          <td className="px-4 py-3 text-right">
                            <GlowButton variant="ghost" size="sm" rightIcon={<ArrowUpRight className="h-4 w-4" />}>
                              View details
                            </GlowButton>
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
  );
}
