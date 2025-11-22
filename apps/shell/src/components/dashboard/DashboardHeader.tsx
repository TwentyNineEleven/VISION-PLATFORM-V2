'use client';

import React from 'react';
import { Crown, Users, Layers3, Zap, ChartPie, Plus, MoreHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="flex flex-col gap-6">
        {/* Title and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-medium text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button className="p-2.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Widget
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 h-12 px-2 py-3 text-sm font-medium transition-colors border-b-2',
                selectedTab === tab.id || tab.active
                  ? 'text-gray-900 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          ))}
          <button className="flex items-center gap-1.5 h-12 px-2 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
