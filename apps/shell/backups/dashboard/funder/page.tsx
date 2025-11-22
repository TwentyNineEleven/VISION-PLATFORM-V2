'use client';

import * as React from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { AppSwitcher } from '@/components/dashboard/AppSwitcher';
import { DashboardHeader } from '@/components/funder/DashboardHeader';
import { MetricWidget } from '@/components/funder/MetricWidget';
import { ListWidget } from '@/components/funder/ListWidget';
import { mockApps } from '@/lib/mock-data';
import { User, ShoppingCart, Users, TrendingUp, BarChart3 } from 'lucide-react';

export default function FunderDashboardPage() {
  const [appSwitcherOpen, setAppSwitcherOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('overview');

  // Mock data for metric widgets
  const metrics = [
    {
      id: '1',
      title: 'Total orders',
      value: '480',
      icon: <ShoppingCart className="w-5 h-5 text-muted-foreground" />,
      trend: { value: '23%', isPositive: true },
    },
    {
      id: '2',
      title: 'Returning Users',
      value: '42%',
      icon: <User className="w-5 h-5 text-muted-foreground" />,
    },
    {
      id: '3',
      title: 'New Users',
      value: '235',
      icon: <Users className="w-5 h-5 text-muted-foreground" />,
      trend: { value: '23%', isPositive: true },
    },
    {
      id: '4',
      title: 'Revenue',
      value: '$12,450',
      icon: <TrendingUp className="w-5 h-5 text-muted-foreground" />,
      trend: { value: '15%', isPositive: true },
    },
  ];

  // Mock data for list widget
  const teamMembers = [
    { id: '1', name: 'Cameron Smith', progress: 99, value: '99%' },
    { id: '2', name: 'John Doe', progress: 78, value: '78%' },
    { id: '3', name: 'Will Smith', progress: 72, value: '72%' },
    { id: '4', name: 'Sarah Johnson', progress: 87, value: '87%' },
    { id: '5', name: 'Michael Chen', progress: 65, value: '65%' },
  ];

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

          <main className="flex-1 overflow-y-auto bg-background">
            <div className="mx-auto flex max-w-7xl flex-col">
              <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
              
              <div className="px-8 pb-8">
                <div className="grid gap-6">
                  {/* Metric Widgets Grid */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {metrics.map((metric) => (
                      <MetricWidget
                        key={metric.id}
                        title={metric.title}
                        value={metric.value}
                        icon={metric.icon}
                        trend={metric.trend}
                      />
                    ))}
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
                    {/* Chart/Graph Area - Placeholder for now */}
                    <div className="min-h-[400px] rounded-xl border border-border bg-card p-6 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">Chart visualization area</p>
                      </div>
                    </div>

                    {/* List Widget */}
                    <ListWidget
                      title="Your team"
                      items={teamMembers}
                      onViewAll={() => console.log('View all team members')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
