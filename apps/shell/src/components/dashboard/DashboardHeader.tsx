'use client';

import React from 'react';
import { Crown, Users, Layers3, Zap, ChartPie, Plus, MoreHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlowButton, GlowSelect } from '@/components/glow-ui';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}

const tabs: Tab[] = [
  { id: 'default', label: 'Default', icon: <Crown className="w-4 h-4" /> },
  { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
  { id: 'orders', label: 'Orders', icon: <Layers3 className="w-4 h-4" />, active: true },
  { id: 'users', label: 'Users', icon: <Zap className="w-4 h-4" /> },
  { id: 'overview', label: 'Overview', icon: <ChartPie className="w-4 h-4" /> },
];

export function DashboardHeader() {
  const [selectedTab, setSelectedTab] = React.useState('orders');
  const [dateFilter, setDateFilter] = React.useState('Last 30 days');

  return (
    <div className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="flex flex-col gap-6">
        {/* Title and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-medium text-foreground">Dashboard</h1>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <GlowButton variant="ghost" size="icon" className="shadow-none text-vision-gray-700 hover:text-foreground">
              <MoreHorizontal className="w-5 h-5" />
            </GlowButton>
            <GlowSelect
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="w-48"
              controlSize="md"
              data-testid="dashboard-date-filter"
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 90 days">Last 90 days</option>
              <option value="Last year">Last year</option>
            </GlowSelect>
            <GlowButton
              variant="default"
              size="sm"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Widget
            </GlowButton>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <GlowButton
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              variant="ghost"
              size="sm"
              className={cn(
                'flex items-center gap-1.5 h-12 px-2 py-3 text-sm font-medium border-b-2 rounded-none',
                selectedTab === tab.id || tab.active
                  ? 'text-foreground border-primary'
                  : 'text-vision-gray-700 border-transparent hover:text-foreground'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
            </GlowButton>
          ))}
          <GlowButton
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 h-12 px-2 py-3 text-sm font-medium text-vision-gray-700 hover:text-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
