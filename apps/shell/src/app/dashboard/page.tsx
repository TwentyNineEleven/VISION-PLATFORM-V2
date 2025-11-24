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

export default function DashboardPage() {
  const router = useRouter();

  const handleOpenCatalog = () => {
    router.push('/applications');
  };

  const handleAskVisionAI = () => {
    // TODO: Implement VISION AI modal/feature
    console.log('Ask VISION AI clicked');
  };

  const handleLaunchApp = (appId: string, href: string) => {
    router.push(href as any);
  };

  const handleToggleFavorite = (appId: string) => {
    // TODO: Implement favorite toggle with backend
    console.log('Toggle favorite:', appId);
  };

  const handleLearnMore = () => {
    // TODO: Navigate to transformation areas documentation
    console.log('Learn more clicked');
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
              onAskVisionAI={handleAskVisionAI}
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
                    {recentApps.map((activity) => (
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
              onLearnMore={handleLearnMore}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
