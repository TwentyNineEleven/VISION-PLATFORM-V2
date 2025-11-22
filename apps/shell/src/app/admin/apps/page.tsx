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

export default function AdminAppsPage() {
  const [tab, setTab] = React.useState('catalog');
  const [catalogControls, setCatalogControls] = React.useState<AdminAppControl[]>(mockAdminAppControls);
  const [orgAssignments, setOrgAssignments] = React.useState<OrgAppAssignment[]>(mockOrgAppAssignments);
  const [selectedOrgId, setSelectedOrgId] = React.useState(orgAssignments[0]?.orgId ?? '');

  const selectedOrg = orgAssignments.find((org) => org.orgId === selectedOrgId) || orgAssignments[0];

  const handleCatalogToggle = (appId: string, field: keyof AdminAppControl, value: boolean) => {
    setCatalogControls((prev) =>
      prev.map((control) => (control.appId === appId ? { ...control, [field]: value } : control))
    );
  };

  const handleOrgAppToggle = (appId: string, enabled: boolean) => {
    setOrgAssignments((prev) =>
      prev.map((org) => {
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
      })
    );
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
                />
                <GlowSwitch
                  checked={controls?.betaOnly}
                  onCheckedChange={(checked) => handleCatalogToggle(app.slug, 'betaOnly', checked)}
                  label="Beta/internal"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{app.audience?.toUpperCase()}</span>
                <span>{app.popularity ? `${app.popularity}% adoption` : 'New'}</span>
              </div>
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

