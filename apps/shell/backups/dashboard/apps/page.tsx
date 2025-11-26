'use client';

import React from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { AppLauncher } from '@/components/dashboard/AppLauncher';
import { AppSwitcher } from '@/components/dashboard/AppSwitcher';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { mockApps } from '@/lib/mock-data';
import { LayoutGrid, Compass } from 'lucide-react';

export default function AppCatalogPage() {
  const [appSwitcherOpen, setAppSwitcherOpen] = React.useState(false);

  const handleSelectApp = (app: typeof mockApps[0]) => {
    if (app.status === 'active') {
      window.location.href = app.launchPath || `/apps/${app.id}`;
    }
  };

  const handleLaunchApp = (app: typeof mockApps[0]) => {
    if (app.launchPath) {
      window.location.href = app.launchPath;
    }
  };

  const handleRequestAccess = (app: typeof mockApps[0]) => {
    alert(`Request access to ${app.name}`);
  };

  const handleToggleFavorite = (_appId: string) => {
    // Mock toggle could be added; keeping stateless for now
  };

  return (
    <>
      <AppSwitcher
        open={appSwitcherOpen}
        onOpenChange={setAppSwitcherOpen}
        apps={mockApps}
        onSelectApp={handleSelectApp}
      />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-64">
          {/* Top Navbar */}
          <DashboardNavbar onAppSwitcherClick={() => setAppSwitcherOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-xl border border-border bg-card px-5 py-4 shadow-ambient-card">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-8 h-8 text-primary" />
                  <h1 className="text-3xl font-semibold text-foreground">App Catalog</h1>
                </div>
                <p className="text-muted-foreground">
                  Explore the VISION suite by module, category, or quick search. Fully mock-driven for now.
                </p>
              </div>
              <GlowButton
                variant="outline"
                leftIcon={<Compass className="h-4 w-4" />}
                onClick={() => setAppSwitcherOpen(true)}
              >
                Open switcher
              </GlowButton>
            </div>

            {/* App Launcher */}
            <AppLauncher
              apps={mockApps}
              onLaunchApp={handleLaunchApp}
              onRequestAccess={handleRequestAccess}
              onToggleFavorite={handleToggleFavorite}
              layout="grid"
            />
          </div>
        </main>
      </div>
    </div>
    </>
  );
}
