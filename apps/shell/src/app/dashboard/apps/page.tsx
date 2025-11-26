'use client';

import { AppLauncher } from '@/components/dashboard/AppLauncher';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { useAppShell } from '@/components/layout/AppShell';
import { mockApps } from '@/lib/mock-data';
import { LayoutGrid, Compass } from 'lucide-react';

export default function AppCatalogPage() {
  const { openAppLauncher } = useAppShell();

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
    <div className="max-w-7xl mx-auto space-y-6">
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
              onClick={openAppLauncher}
            >
              Open switcher
            </GlowButton>
      </div>

      <AppLauncher
        apps={mockApps}
        onLaunchApp={handleLaunchApp}
        onRequestAccess={handleRequestAccess}
        onToggleFavorite={handleToggleFavorite}
        layout="grid"
      />
    </div>
  );
}
