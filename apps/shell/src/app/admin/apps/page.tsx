'use client';

import * as React from 'react';
import {
  GlowBadge,
  GlowButton,
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowSelect,
  GlowSwitch,
} from '@/components/glow-ui';
import { GlowTabs } from '@/components/glow-ui/GlowTabs';
import { VISION_APPS } from '@/lib/vision-apps';
import {
  mockAdminAppControls,
  mockOrgAppAssignments,
  type AdminAppControl,
  type OrgAppAssignment,
} from '@/lib/mock-admin';
import { adminAppService } from '@/services/adminAppService';

export default function AdminAppsPage() {
  const [tab, setTab] = React.useState('catalog');
  const [catalogControls, setCatalogControls] = React.useState<AdminAppControl[]>(mockAdminAppControls);
  const [orgAssignments, setOrgAssignments] = React.useState<OrgAppAssignment[]>(mockOrgAppAssignments);
  const [selectedOrgId, setSelectedOrgId] = React.useState(orgAssignments[0]?.orgId ?? '');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Clear messages after 5 seconds
  React.useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const loadData = async () => {
    try {
      const [controls, assignments] = await Promise.all([
        adminAppService.getAppControls(),
        adminAppService.getOrgAssignments(),
      ]);
      if (controls.length > 0) setCatalogControls(controls);
      if (assignments.length > 0) setOrgAssignments(assignments);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const selectedOrg = orgAssignments.find((org) => org.orgId === selectedOrgId) || orgAssignments[0];

  const handleCatalogToggle = async (appId: string, field: keyof AdminAppControl, value: boolean) => {
    const app = VISION_APPS.find((a) => a.slug === appId);
    const appName = app?.name || appId;

    // Only show confirmation for globallyAvailable toggle
    if (field === 'globallyAvailable') {
      const action = value ? 'enable' : 'disable';
      const installedCount = adminAppService.getInstalledCount(appId, orgAssignments);

      if (
        !confirm(
          `${action.toUpperCase()} "${appName}"?\n\n` +
            `This will ${action} the app for ALL ${installedCount} organizations.\n\n` +
            `Are you sure you want to continue?`
        )
      ) {
        return;
      }
    }

    setIsLoading(true);

    try {
      const updatedControls = catalogControls.map((control) =>
        control.appId === appId ? { ...control, [field]: value } : control
      );
      setCatalogControls(updatedControls);
      await adminAppService.saveAppControls(updatedControls);
      setSuccess(`App ${field === 'globallyAvailable' ? (value ? 'enabled' : 'disabled') : 'updated'} successfully`);
    } catch (err) {
      setError('Failed to update app');
      // Revert on error
      loadData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrgAppToggle = async (appId: string, enabled: boolean) => {
    const app = VISION_APPS.find((a) => a.slug === appId);
    const appName = app?.name || appId;
    const action = enabled ? 'enable' : 'disable';

    if (
      !confirm(
        `${action.toUpperCase()} "${appName}" for ${selectedOrg?.orgName}?\n\n` +
          `This will ${action} the app for this organization.`
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const updatedAssignments = orgAssignments.map((org) => {
        if (org.orgId !== selectedOrg?.orgId) return org;
        return {
          ...org,
          apps: org.apps.map((entry) =>
            entry.appId === appId
              ? {
                  ...entry,
                  status: enabled ? 'enabled' : 'disabled',
                  activeUsers: enabled ? Math.max(entry.activeUsers, 5) : 0,
                }
              : entry
          ),
        };
      });

      setOrgAssignments(updatedAssignments);
      await adminAppService.saveOrgAssignments(updatedAssignments);
      setSuccess(`App ${action}d successfully`);
    } catch (err) {
      setError(`Failed to ${action} app`);
      loadData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApp = async (appId: string) => {
    const app = VISION_APPS.find((a) => a.slug === appId);
    const appName = app?.name || appId;
    const installedCount = adminAppService.getInstalledCount(appId, orgAssignments);

    if (
      !confirm(
        `⚠️ DELETE "${appName}"?\n\n` +
          `This will:\n` +
          `- Remove the app for ${installedCount} organizations\n` +
          `- Delete all user data and configurations\n` +
          `- This action CANNOT be undone\n\n` +
          `Type the app name to confirm:`
      )
    ) {
      return;
    }

    const typedName = prompt(`Type "${appName}" to confirm deletion:`);

    if (typedName !== appName) {
      alert('App name does not match. Deletion cancelled.');
      return;
    }

    setIsLoading(true);

    try {
      await adminAppService.deleteApp(appId);
      await loadData();
      setSuccess('App deleted successfully');
    } catch (err) {
      setError('Failed to delete app');
    } finally {
      setIsLoading(false);
    }
  };

  const catalogView = (
    <div className="grid gap-4 md:grid-cols-2">
      {VISION_APPS.map((app) => {
        const controls = catalogControls.find((control) => control.appId === app.slug);
        return (
          <GlowCard key={app.slug} variant="interactive">
            <GlowCardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <GlowBadge variant="outline" size="sm" className="capitalize">
                  {app.moduleLabel}
                </GlowBadge>
                {app.status && (
                  <GlowBadge variant={app.status === 'coming-soon' ? 'warning' : 'success'} size="sm">
                    {app.status}
                  </GlowBadge>
                )}
              </div>
              <GlowCardTitle>{app.name}</GlowCardTitle>
              <p className="text-sm text-muted-foreground">{app.shortDescription}</p>
            </GlowCardHeader>
            <GlowCardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <GlowSwitch
                  checked={controls?.globallyAvailable}
                  onCheckedChange={(checked) =>
                    handleCatalogToggle(app.slug, 'globallyAvailable', checked)
                  }
                  label="Globally available"
                  disabled={isLoading}
                  aria-label={`Toggle global availability for ${app.name}`}
                />
                <GlowSwitch
                  checked={controls?.betaOnly}
                  onCheckedChange={(checked) => handleCatalogToggle(app.slug, 'betaOnly', checked)}
                  label="Beta/internal"
                  disabled={isLoading}
                  aria-label={`Toggle beta status for ${app.name}`}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{app.audience?.toUpperCase()}</span>
                <span>{app.popularity ? `${app.popularity}% adoption` : 'New'}</span>
              </div>
              <GlowButton
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteApp(app.slug)}
                disabled={isLoading}
                aria-label={`Delete ${app.name} from platform`}
                className="w-full text-vision-error-600 hover:text-vision-error-700"
              >
                Delete App
              </GlowButton>
            </GlowCardContent>
          </GlowCard>
        );
      })}
    </div>
  );

  const enabledApps = selectedOrg?.apps.filter((app) => app.status === 'enabled') ?? [];
  const availableApps = selectedOrg?.apps.filter((app) => app.status !== 'enabled') ?? [];

  const subscriptionView = (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Select organization</p>
          <h2 className="text-lg font-semibold text-foreground">{selectedOrg?.orgName}</h2>
        </div>
        <GlowSelect value={selectedOrg?.orgId} onChange={(event) => setSelectedOrgId(event.target.value)}>
          {orgAssignments.map((org) => (
            <option key={org.orgId} value={org.orgId}>
              {org.orgName}
            </option>
          ))}
        </GlowSelect>
      </div>

      <GlowCard variant="elevated">
        <GlowCardHeader>
          <GlowCardTitle>Enabled apps</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent className="space-y-3">
          {enabledApps.length === 0 && (
            <p className="text-sm text-muted-foreground">No apps enabled yet.</p>
          )}
          {enabledApps.map((entry) => {
            const app = VISION_APPS.find((item) => item.slug === entry.appId);
            if (!app) return null;
            return (
              <div
                key={entry.appId}
                className="rounded-lg border border-border p-3 shadow-ambient-card"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{app.name}</p>
                    <p className="text-xs text-muted-foreground">{app.shortDescription}</p>
                  </div>
                  <GlowSwitch
                    checked={entry.status === 'enabled'}
                    onCheckedChange={(checked) => handleOrgAppToggle(entry.appId, checked)}
                    disabled={isLoading}
                    aria-label={`Toggle ${app.name} for ${selectedOrg?.orgName}`}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span>Active users: {entry.activeUsers}</span>
                  <span>Data objects: {entry.dataObjects.toLocaleString()}</span>
                  {entry.lastUsed && (
                    <span>
                      Last used {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(entry.lastUsed)}
                    </span>
                  )}
                  <GlowBadge variant="outline" size="sm">
                    {app.moduleLabel}
                  </GlowBadge>
                </div>
              </div>
            );
          })}
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="flat">
        <GlowCardHeader>
          <GlowCardTitle>Available apps</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent className="space-y-3">
          {availableApps.map((entry) => {
            const app = VISION_APPS.find((item) => item.slug === entry.appId);
            if (!app) return null;
            return (
              <div key={entry.appId} className="rounded-lg border border-dashed border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{app.name}</p>
                    <p className="text-xs text-muted-foreground">{app.shortDescription}</p>
                  </div>
                  <GlowButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleOrgAppToggle(entry.appId, true)}
                    disabled={isLoading}
                    aria-label={`Enable ${app.name} for ${selectedOrg?.orgName}`}
                  >
                    Enable
                  </GlowButton>
                </div>
              </div>
            );
          })}
        </GlowCardContent>
      </GlowCard>
    </div>
  );

  return (
    <div className="space-y-6">
      {error && (
        <div
          className="rounded-lg border border-vision-error-600 bg-vision-error-50 px-4 py-3 text-vision-error-600"
          role="alert"
        >
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}
      {success && (
        <div
          className="rounded-lg border border-vision-success-600 bg-vision-success-50 px-4 py-3 text-vision-success-600"
          role="status"
        >
          <strong className="font-semibold">Success:</strong> {success}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">App management</h1>
        <p className="text-sm text-muted-foreground">
          Control platform-wide availability and org-level subscriptions.
        </p>
      </div>

      <GlowTabs
        value={tab}
        onValueChange={setTab}
        tabs={[
          {
            id: 'catalog',
            label: 'Global catalog',
            content: catalogView,
          },
          {
            id: 'subscriptions',
            label: 'Org subscriptions',
            content: subscriptionView,
          },
        ]}
      />
    </div>
  );
}

