'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowBadge, GlowButton, GlowSwitch, Grid, Group } from '@/components/glow-ui';
import { mockApps, mockAppSubscriptions, mockCurrentPlan } from '@/lib/mock-data';
import { appSettingsService } from '@/services/appSettingsService';
import { Activity, Settings } from 'lucide-react';
import { Stack } from '@/design-system';
import { AppCard } from '@/components/AppCard';
import { mapAppToCardProps } from '@/lib/app-card';

export default function AppSubscriptionsPage() {
  const [enabledApps, setEnabledApps] = React.useState<Record<string, boolean>>({});

  // Load app settings from localStorage on mount
  React.useEffect(() => {
    loadAppSettings();
  }, []);

  const loadAppSettings = async () => {
    const initialSettings = mockApps.reduce<Record<string, boolean>>((acc, app) => {
      acc[app.id] = app.status === 'active';
      return acc;
    }, {});

    // Initialize with mock data if empty
    await appSettingsService.initializeAppSettings(initialSettings);

    // Load settings from localStorage
    const settings = await appSettingsService.getAppSettings();
    setEnabledApps(settings);
  };

  const toggleApp = async (id: string) => {
    const newValue = !enabledApps[id];
    setEnabledApps((prev) => ({ ...prev, [id]: newValue }));

    try {
      await appSettingsService.toggleApp(id, newValue);
    } catch (error) {
      console.error('Failed to save app setting:', error);
      // Revert on error
      setEnabledApps((prev) => ({ ...prev, [id]: !newValue }));
    }
  };

  const enabledList = mockApps.filter((app) => enabledApps[app.id]);
  const availableList = mockApps.filter((app) => !enabledApps[app.id]);
  const enabledCount = enabledList.length;
  const estimatedCost = enabledCount * 49;

  const handleLaunch = (app: (typeof mockApps)[number]) => {
    if (app.launchPath) {
      window.location.href = app.launchPath;
    }
  };

  return (
    <Stack gap="6xl">
      <GlowCard variant="elevated">
        <GlowCardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <GlowCardTitle>Current plan</GlowCardTitle>
            <GlowCardDescription>Manage billing and app access.</GlowCardDescription>
          </div>
          <GlowBadge variant="info" size="sm">
            Next billing {mockCurrentPlan.nextBillingDate.toLocaleDateString()}
          </GlowBadge>
        </GlowCardHeader>
        <GlowCardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="text-xl font-semibold">{mockCurrentPlan.name}</p>
            <p className="text-sm text-muted-foreground">{mockCurrentPlan.price}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment method</p>
            <p className="text-xl font-semibold">
              {mockCurrentPlan.paymentMethod.brand} •••• {mockCurrentPlan.paymentMethod.last4}
            </p>
            <p className="text-sm text-muted-foreground">Expires {mockCurrentPlan.paymentMethod.expiry}</p>
          </div>
          <div className="flex items-center gap-2">
            <GlowButton variant="outline">Change plan</GlowButton>
            <GlowButton glow="subtle">Manage billing</GlowButton>
          </div>
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="flat">
        <GlowCardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Apps enabled</p>
            <p className="text-2xl font-semibold">
              {enabledCount} / {mockApps.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estimated monthly cost</p>
            <p className="text-2xl font-semibold">${estimatedCost}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Usage trend</p>
            <p className="text-2xl font-semibold text-success">+8%</p>
          </div>
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="elevated">
        <GlowCardHeader className="space-y-1">
          <GlowCardTitle>Enabled apps</GlowCardTitle>
          <GlowCardDescription>Launch and manage active applications.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent>
          <Grid columns={3} gap="lg">
            {enabledList.map((app) => {
              const sub = mockAppSubscriptions.find((s) => s.appId === app.id);
              return (
                <div key={app.id} className="space-y-3">
                  <AppCard
                    {...mapAppToCardProps(app)}
                    className="w-full"
                    onLaunch={() => handleLaunch(app)}
                  />
                  <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span>Active users: {sub?.activeUsers ?? 0}</span>
                    </div>
                    <span>Data: {sub?.dataObjects ?? 0}</span>
                  </div>
                  <Group spacing="sm" wrap="wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Enabled</span>
                      <GlowSwitch
                        checked={enabledApps[app.id] ?? false}
                        onCheckedChange={() => toggleApp(app.id)}
                        aria-label={`${enabledApps[app.id] ? 'Disable' : 'Enable'} ${app.name}`}
                      />
                    </div>
                    <GlowButton
                      variant="outline"
                      size="sm"
                      rightIcon={<Settings className="h-4 w-4" />}
                    >
                      Configure
                    </GlowButton>
                  </Group>
                </div>
              );
            })}
            {enabledList.length === 0 && (
              <p className="text-sm text-muted-foreground">No apps enabled yet.</p>
            )}
          </Grid>
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="elevated">
        <GlowCardHeader className="space-y-1">
          <GlowCardTitle>Available apps</GlowCardTitle>
          <GlowCardDescription>Enable additional functionality for your workspace.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent>
          <Grid columns={3} gap="lg">
            {availableList.map((app) => {
              const cardProps = mapAppToCardProps(app);
              const derivedStatus =
                cardProps.status === 'active' ? 'paused' : cardProps.status;
              return (
                <div key={app.id} className="space-y-3">
                  <AppCard
                    {...cardProps}
                    status={derivedStatus}
                    className="w-full"
                  />
                  <Group spacing="sm">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {cardProps.status === 'coming_soon' ? 'Coming soon' : 'Enable'}
                      </span>
                      <GlowSwitch
                        checked={enabledApps[app.id] ?? false}
                        onCheckedChange={() => toggleApp(app.id)}
                        disabled={cardProps.status === 'coming_soon'}
                        aria-label={`${enabledApps[app.id] ? 'Disable' : 'Enable'} ${app.name}`}
                      />
                    </div>
                  </Group>
                </div>
              );
            })}
          </Grid>
        </GlowCardContent>
      </GlowCard>
    </Stack>
  );
}
