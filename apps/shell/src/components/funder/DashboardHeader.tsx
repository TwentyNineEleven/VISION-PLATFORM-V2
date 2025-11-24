'use client';

import { GlowButton } from '@/components/glow-ui/GlowButton';
import { Filter, Plus, Share2 } from 'lucide-react';

interface DashboardHeaderProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  cohortFilter: string;
  onCohortChange: (value: string) => void;
  cohortOptions: { value: string; label: string }[];
}

const timeRangeOptions = [
  { value: '30', label: 'Last 30 days' },
  { value: '60', label: 'Last 60 days' },
  { value: '90', label: 'Last 90 days' },
];

export function DashboardHeader({
  timeRange,
  onTimeRangeChange,
  cohortFilter,
  onCohortChange,
  cohortOptions,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-8 bg-gradient-to-b from-muted/30 to-background border-b border-border px-8 pt-10 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 border border-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">Funder Portal</p>
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Portfolio Overview</h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            Monitor investments, track portfolio health, and see where support is needed most.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <GlowButton variant="outline" size="lg" leftIcon={<Share2 className="w-4 h-4" />}>
            Share update
          </GlowButton>
          <GlowButton glow="subtle" size="lg" leftIcon={<Plus className="w-4 h-4" />}>
            Create report
          </GlowButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            Time range
          </label>
          <select
            value={timeRange}
            onChange={(event) => onTimeRangeChange(event.target.value)}
            className="h-12 w-full rounded-lg border-2 border-border bg-background px-4 text-sm font-medium shadow-sm hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cohort</label>
          <select
            value={cohortFilter}
            onChange={(event) => onCohortChange(event.target.value)}
            className="h-12 w-full rounded-lg border-2 border-border bg-background px-4 text-sm font-medium shadow-sm hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
          >
            {cohortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Highlights</label>
          <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 px-5 py-3.5 shadow-sm">
            <div>
              <p className="text-sm font-bold text-foreground">Portfolio insights</p>
              <p className="text-xs text-muted-foreground mt-0.5">Updated automatically every 24h</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-xs font-bold text-primary">Auto</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

