'use client';

import React from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { AppSwitcher } from '@/components/dashboard/AppSwitcher';
import { mockApps } from '@/lib/mock-data';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';

export default function SettingsSectionLayout({ children }: { children: React.ReactNode }) {
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
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardNavbar onAppSwitcherClick={() => setAppSwitcherOpen(true)} />
          <SettingsLayout sidebar={<SettingsSidebar />}>{children}</SettingsLayout>
        </div>
      </div>
    </>
  );
}
