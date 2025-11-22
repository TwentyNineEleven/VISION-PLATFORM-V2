'use client';

import React from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { AppLauncher } from '@/components/dashboard/AppLauncher';
import { AppSwitcher } from '@/components/dashboard/AppSwitcher';
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from '@/components/glow-ui/GlowCard';
import { GlowBadge } from '@/components/glow-ui/GlowBadge';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import {
  mockApps,
  mockUser,
  mockOrganization,
  getRecentApps,
  getFavoriteApps,
  mockDocuments,
  formatUpdated,
} from '@/lib/mock-data';
import {
  Star,
  Clock,
  TrendingUp,
  Zap,
  FileText,
  ArrowRight,
  Grid3x3,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [appSwitcherOpen, setAppSwitcherOpen] = React.useState(false);

  const handleSelectApp = (app: typeof mockApps[0]) => {
    if (app.status === 'active') {
      window.location.href = app.launchPath || `/apps/${app.id}`;
    }
  };

  const recentApps = getRecentApps(mockApps, 4);
  const favoriteApps = getFavoriteApps(mockApps);
  const activeAppsCount = mockApps.filter((app) => app.status === 'active').length;
  const mostRecentLaunch = recentApps[0];

  const handleLaunchApp = (app: typeof mockApps[0]) => {
    window.location.href = app.launchPath || `/apps/${app.id}`;
  };

  const stats = [
    {
      label: 'Active apps',
      value: activeAppsCount,
      helper: '+3 this week',
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
    },
    {
      label: 'Requests pending',
      value: 2,
      helper: 'Awaiting approval',
      icon: <Clock className="w-4 h-4 text-amber-600" />,
    },
    {
      label: 'Unread alerts',
      value: 4,
      helper: 'Across all workspaces',
      icon: <Zap className="w-4 h-4 text-primary" />,
    },
  ];

  return (
    <>
      <AppSwitcher
        open={appSwitcherOpen}
        onOpenChange={setAppSwitcherOpen}
        apps={mockApps}
        onSelectApp={handleSelectApp}
      />
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:ml-64">
          <DashboardNavbar onAppSwitcherClick={() => setAppSwitcherOpen(true)} />

          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8">
              <GlowCard variant="glow" padding="lg">
                <GlowCardContent className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <GlowBadge variant="info" size="sm">
                      Dashboard
                    </GlowBadge>
                    <div className="space-y-1">
                      <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                        Welcome back, {mockUser.name}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {mockOrganization.name} · You have access to {activeAppsCount} active
                        apps
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <GlowButton
                        glow="subtle"
                        className="shadow-glow-primary-sm"
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                        onClick={() => mostRecentLaunch && handleLaunchApp(mostRecentLaunch)}
                        disabled={!mostRecentLaunch}
                      >
                        Launch most recent
                      </GlowButton>
                      <GlowButton
                        variant="outline"
                        glow="none"
                        rightIcon={<Grid3x3 className="h-4 w-4" />}
                        onClick={() => setAppSwitcherOpen(true)}
                      >
                        Open switcher
                      </GlowButton>
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
                    {stats.map((stat) => (
                      <GlowCard key={stat.label} variant="elevated" padding="md" className="h-full">
                        <GlowCardContent className="flex h-full flex-col justify-between gap-3 p-0">
                          <div className="flex items-start justify-between text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">{stat.icon} {stat.label}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-semibold text-foreground">{stat.value}</div>
                            <p className="mt-1 text-xs text-muted-foreground">{stat.helper}</p>
                          </div>
                        </GlowCardContent>
                      </GlowCard>
                    ))}
                  </div>
                </GlowCardContent>
              </GlowCard>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:col-span-2">
                  <GlowCard variant="interactive" className="h-full">
                    <GlowCardHeader className="pb-2">
                      <GlowCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Recent Apps
                      </GlowCardTitle>
                    </GlowCardHeader>
                    <GlowCardContent className="pt-0">
                      <div className="space-y-2.5">
                        {recentApps.slice(0, 4).map((app) => {
                          const Icon = app.icon || Grid3x3;
                          return (
                          <button
                            key={app.id}
                            className="ambient-interactive flex w-full items-center gap-3 rounded-lg border border-transparent p-3 text-left transition-all hover:-translate-y-0.5 hover:border-border hover:bg-accent hover:shadow-ambient-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                            onClick={() => handleLaunchApp(app)}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-500 text-white shadow-glow-primary-sm">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex min-w-0 flex-1 items-center gap-2">
                              <p className="truncate text-sm font-medium text-foreground">{app.name}</p>
                              <span className="truncate text-xs text-muted-foreground">
                                {app.lastUsed ? new Date(app.lastUsed).toLocaleDateString() : 'Available'}
                              </span>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </button>
                          );
                        })}
                      </div>
                    </GlowCardContent>
                  </GlowCard>

                  <GlowCard variant="interactive" className="h-full">
                    <GlowCardHeader className="pb-2">
                      <GlowCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Star className="h-4 w-4 fill-vision-orange text-vision-orange" />
                        Favorites
                      </GlowCardTitle>
                    </GlowCardHeader>
                    <GlowCardContent className="pt-0">
                      <div className="space-y-2.5">
                        {favoriteApps.slice(0, 4).map((app) => {
                          const Icon = app.icon || Grid3x3;
                          return (
                          <button
                            key={app.id}
                            className="ambient-interactive flex w-full items-center gap-3 rounded-lg border border-transparent p-3 text-left transition-all hover:-translate-y-0.5 hover:border-border hover:bg-accent hover:shadow-ambient-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                            onClick={() => handleLaunchApp(app)}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-500 text-white shadow-glow-primary-sm">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex min-w-0 flex-1 items-center gap-2">
                              <p className="truncate text-sm font-medium text-foreground">{app.name}</p>
                              <span className="truncate text-xs text-muted-foreground">
                                {app.phase || 'Active'}
                              </span>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </button>
                          );
                        })}
                      </div>
                    </GlowCardContent>
                  </GlowCard>
                </div>

                <GlowCard variant="interactive" className="h-full">
                  <GlowCardHeader className="pb-2">
                    <GlowCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Recent Documents
                    </GlowCardTitle>
                  </GlowCardHeader>
                  <GlowCardContent className="pt-0">
                    <div className="space-y-2.5">
                      {mockDocuments.map((doc) => (
                        <Link
                          key={doc.id}
                          href={"/documents" as any}
                          className="ambient-interactive flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:-translate-y-0.5 hover:border-border hover:bg-accent hover:shadow-ambient-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card text-foreground shadow-ambient-card">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex min-w-0 flex-1 items-center gap-2">
                            <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
                            <span className="truncate text-xs text-muted-foreground">
                              {formatUpdated(doc.updatedAt)}
                            </span>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  </GlowCardContent>
                </GlowCard>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-foreground">Explore the catalog</h2>
                  <p className="text-sm text-muted-foreground">
                    Browse all VISION tools available to your organization.
                  </p>
                </div>
                <AppLauncher
                  apps={mockApps}
                  onLaunchApp={handleLaunchApp}
                  onRequestAccess={() => {}}
                  onToggleFavorite={() => {}}
                  layout="grid"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
