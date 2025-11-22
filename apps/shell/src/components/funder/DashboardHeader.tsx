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
    <div className="flex flex-col gap-6 border-b border-border px-8 pt-8 pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-primary">Funder Portal</p>
          <h1 className="text-3xl font-semibold text-foreground">Portfolio Overview</h1>
          <p className="text-sm text-muted-foreground">
            Monitor investments, track portfolio health, and see where support is needed most.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <GlowButton variant="outline" leftIcon={<Share2 className="w-4 h-4" />}>
            Share update
          </GlowButton>
          <GlowButton glow="subtle" leftIcon={<Plus className="w-4 h-4" />}>
            Create report
          </GlowButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Time range
          </label>
          <select
            value={timeRange}
            onChange={(event) => onTimeRangeChange(event.target.value)}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Cohort</label>
          <select
            value={cohortFilter}
            onChange={(event) => onCohortChange(event.target.value)}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
          >
            {cohortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Highlights</label>
          <div className="flex items-center justify-between rounded-lg border border-dashed border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Portfolio insights</p>
              <p className="text-xs text-muted-foreground">Updated automatically every 24h</p>
            </div>
            <span className="text-xs font-semibold text-primary">Auto</span>
          </div>
        </div>
      </div>
    </div>
  );
}

