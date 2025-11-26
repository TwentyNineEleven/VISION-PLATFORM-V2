'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

// Hero & Metrics
import { HeroWelcome } from '@/components/dashboard/HeroWelcome';
import { DashboardStatCard } from '@/components/dashboard/DashboardStatCard';

// Primary Column Components
import { TaskListCard } from '@/components/dashboard/TaskListCard';
import { DeadlinesCard } from '@/components/dashboard/DeadlinesCard';
import { ApprovalsCard } from '@/components/dashboard/ApprovalsCard';

// Sidebar Components
import { MiniAppCard } from '@/components/dashboard/MiniAppCard';
import { TransformationSnapshotCard } from '@/components/dashboard/TransformationSnapshotCard';

// Bottom Sections
import { RecentDocumentsCard } from '@/components/dashboard/RecentDocumentsCard';
import { CatalogBanner } from '@/components/dashboard/CatalogBanner';

// Document Management Widgets
import {
  RecentDocumentsWidget,
  StorageUsageWidget,
  DocumentActivityWidget,
} from '@/components/dashboard/DashboardWidgets';

// Mock Data
import {
  currentUser,
  currentOrg,
  kpis,
  tasksToday,
  upcomingDeadlines,
  approvals,
  recentApps,
  recentDocuments,
  transformationSnapshot,
} from '@/lib/dashboard/mockDashboardData';
import { appMetadata } from '@/lib/apps/appMetadata';
import { favoritesService } from '@/services/favoritesService';
import { useAppShell } from '@/components/layout/AppShell';

function buildDashboardCtas(deps: {
  openAppLauncher: () => void;
  navigate: (path: string) => void;
}) {
  return {
    onAskVisionAI: () => deps.openAppLauncher(),
    onLearnMore: () => deps.navigate('/#transformation'),
  };
}

function toggleFavoriteWithPersistence(
  appId: string,
  setFavoriteAppIds: React.Dispatch<React.SetStateAction<string[]>>,
  service = favoritesService
) {
  const isFavorite = service.toggleFavorite(appId);

  setFavoriteAppIds((prev) => {
    if (isFavorite) {
      return prev.includes(appId) ? prev : [...prev, appId];
    }

    return prev.filter((id) => id !== appId);
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const { openAppLauncher } = useAppShell();
  const [favoriteAppIds, setFavoriteAppIds] = React.useState<string[]>([]);
  const { onAskVisionAI, onLearnMore } = React.useMemo(
    () => buildDashboardCtas({ openAppLauncher, navigate: (path) => router.push(path as any) }),
    [openAppLauncher, router]
  );

  React.useEffect(() => {
    const storedFavorites = favoritesService.getFavorites();
    setFavoriteAppIds(storedFavorites);
  }, []);

  const decoratedRecentApps = React.useMemo(
    () =>
      recentApps.map((activity) => ({
        ...activity,
        pinnedBy: favoriteAppIds.includes(activity.appId) ? 'user' : activity.pinnedBy,
      })),
    [favoriteAppIds]
  );

  const handleOpenCatalog = () => {
    router.push('/applications');
  };

  const handleLaunchApp = (appId: string, href: string) => {
    router.push(href as any);
  };

  const handleToggleFavorite = (appId: string) => {
    toggleFavoriteWithPersistence(appId, setFavoriteAppIds);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 pb-16">
        <div className="flex flex-col gap-8">
          {/* Hero Section */}
          <section className="w-full">
            <HeroWelcome
              user={currentUser}
              organization={currentOrg}
              onAskVisionAI={onAskVisionAI}
            />
          </section>

          {/* Key Metrics Row - 4 Stat Cards */}
          <section className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi) => (
                <DashboardStatCard
                  key={kpi.id}
                  id={kpi.id}
                  label={kpi.label}
                  value={kpi.value}
                  sublabel={kpi.sublabel}
                  semantic={kpi.semantic}
                />
              ))}
            </div>
          </section>

          {/* Document Management Widgets - 3 Column Grid */}
          <section className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <RecentDocumentsWidget />
              <StorageUsageWidget />
              <DocumentActivityWidget />
            </div>
          </section>

          {/* Primary Column (8 cols) + Sidebar (4 cols) */}
          <section className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Primary Column - Left (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <TaskListCard tasks={tasksToday} />
                <DeadlinesCard deadlines={upcomingDeadlines} />
                <ApprovalsCard approvals={approvals} />
              </div>

              {/* Sidebar Column - Right (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Recent Apps */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Recent apps
                  </h3>
                  <div className="flex flex-col gap-4">
                    {decoratedRecentApps.map((activity) => (
                      <MiniAppCard
                        key={activity.appId}
                        activity={activity}
                        onLaunch={handleLaunchApp}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                </div>

                {/* Transformation Snapshot */}
                <TransformationSnapshotCard areas={transformationSnapshot} />
              </div>
            </div>
          </section>

          {/* Recent Documents & Drafts - Full Width */}
          <section className="w-full">
            <RecentDocumentsCard documents={recentDocuments} />
          </section>

          {/* App Catalog Banner - Full Width */}
          <section className="w-full">
            <CatalogBanner
              totalApps={Object.keys(appMetadata).length}
              onOpenCatalog={handleOpenCatalog}
              onLearnMore={onLearnMore}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
