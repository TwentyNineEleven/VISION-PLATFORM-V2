'use client';

import * as React from 'react';
import {
  GlowBadge,
  GlowButton,
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowInput,
  GlowSelect,
  GlowSwitch,
} from '@/components/glow-ui';
import { GlowTabs } from '@/components/glow-ui/GlowTabs';
import { mockAdminSettings } from '@/lib/mock-admin';

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState(mockAdminSettings);
  const [tab, setTab] = React.useState('branding');

  const brandingTab = (
    <GlowCard variant="interactive">
      <GlowCardHeader>
        <GlowCardTitle>Branding</GlowCardTitle>
      </GlowCardHeader>
      <GlowCardContent className="space-y-4">
        <GlowInput
          label="Tagline"
          value={settings.branding.tagline}
          onChange={(event) =>
            setSettings((prev) => ({
              ...prev,
              branding: { ...prev.branding, tagline: event.target.value },
            }))
          }
        />
        <GlowInput
          label="Accent color"
          value={settings.branding.accentColor}
          onChange={(event) =>
            setSettings((prev) => ({
              ...prev,
              branding: { ...prev.branding, accentColor: event.target.value },
            }))
          }
        />
        <div className="grid gap-3 md:grid-cols-3">
          {Object.entries(settings.branding.links).map(([key, url]) => (
            <GlowInput
              key={key}
              label={`${key.replace(/([A-Z])/g, ' $1')}`}
              value={url ?? ''}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  branding: {
                    ...prev.branding,
                    links: { ...prev.branding.links, [key]: event.target.value },
                  },
                }))
              }
            />
          ))}
        </div>
      </GlowCardContent>
    </GlowCard>
  );

  const securityTab = (
    <GlowCard variant="interactive">
      <GlowCardHeader>
        <GlowCardTitle>Security</GlowCardTitle>
      </GlowCardHeader>
      <GlowCardContent className="space-y-4">
        <GlowSwitch
          checked={settings.security.require2FA}
          onCheckedChange={(checked) =>
            setSettings((prev) => ({
              ...prev,
              security: { ...prev.security, require2FA: checked },
            }))
          }
          label="Require 2FA for admins"
        />
        <GlowInput
          label="Password policy"
          value={settings.security.passwordPolicy}
          onChange={(event) =>
            setSettings((prev) => ({
              ...prev,
              security: { ...prev.security, passwordPolicy: event.target.value },
            }))
          }
        />
        <GlowSelect
          label="Session timeout"
          value={String(settings.security.sessionTimeoutMinutes)}
          onChange={(event) =>
            setSettings((prev) => ({
              ...prev,
              security: {
                ...prev.security,
                sessionTimeoutMinutes: Number(event.target.value),
              },
            }))
          }
        >
          {[30, 60, 120].map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes} minutes
            </option>
          ))}
        </GlowSelect>
        <GlowSwitch
          checked={settings.security.deviceApprovals}
          onCheckedChange={(checked) =>
            setSettings((prev) => ({
              ...prev,
              security: { ...prev.security, deviceApprovals: checked },
            }))
          }
          label="Require device approvals"
        />
      </GlowCardContent>
    </GlowCard>
  );

  const notificationsTab = (
    <GlowCard variant="flat">
      <GlowCardHeader>
        <GlowCardTitle>Notifications</GlowCardTitle>
      </GlowCardHeader>
      <GlowCardContent className="space-y-3">
        {settings.notifications.map((notification, index) => (
          <div key={notification.id} className="rounded-lg border border-border p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{notification.label}</p>
                <p className="text-xs text-muted-foreground">{notification.description}</p>
              </div>
              <GlowBadge variant="outline" size="sm">
                {notification.roles.join(', ')}
              </GlowBadge>
            </div>
            <div className="mt-3 flex flex-wrap gap-4">
              <GlowSwitch
                checked={notification.emailEnabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => {
                    const next = [...prev.notifications];
                    next[index] = { ...next[index], emailEnabled: checked };
                    return { ...prev, notifications: next };
                  })
                }
                label="Email"
              />
              <GlowSwitch
                checked={notification.inAppEnabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => {
                    const next = [...prev.notifications];
                    next[index] = { ...next[index], inAppEnabled: checked };
                    return { ...prev, notifications: next };
                  })
                }
                label="In-app"
              />
            </div>
          </div>
        ))}
      </GlowCardContent>
    </GlowCard>
  );

  const guardrailsTab = (
    <GlowCard variant="interactive">
      <GlowCardHeader>
        <GlowCardTitle>AI & data guardrails</GlowCardTitle>
      </GlowCardHeader>
      <GlowCardContent className="space-y-4">
        <GlowSwitch
          checked={settings.guardrails.allowAIDrafts}
          onCheckedChange={(checked) =>
            setSettings((prev) => ({
              ...prev,
              guardrails: { ...prev.guardrails, allowAIDrafts: checked },
            }))
          }
          label="Allow AI-generated drafts"
        />
        <GlowSwitch
          checked={settings.guardrails.autoRedactPII}
          onCheckedChange={(checked) =>
            setSettings((prev) => ({
              ...prev,
              guardrails: { ...prev.guardrails, autoRedactPII: checked },
            }))
          }
          label="Auto-redact PII"
        />
        <GlowSelect
          label="Data retention window"
          value={String(settings.guardrails.retentionWindowDays)}
          onChange={(event) =>
            setSettings((prev) => ({
              ...prev,
              guardrails: { ...prev.guardrails, retentionWindowDays: Number(event.target.value) },
            }))
          }
        >
          {[30, 60, 90, 180].map((days) => (
            <option key={days} value={days}>
              {days} days
            </option>
          ))}
        </GlowSelect>
        <GlowSwitch
          checked={settings.guardrails.limitExternalSharing}
          onCheckedChange={(checked) =>
            setSettings((prev) => ({
              ...prev,
              guardrails: { ...prev.guardrails, limitExternalSharing: checked },
            }))
          }
          label="Limit external sharing"
        />
      </GlowCardContent>
    </GlowCard>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">Admin settings</h1>
        <p className="text-sm text-muted-foreground">Govern the platform experience for every tenant.</p>
      </div>

      <GlowTabs
        value={tab}
        onValueChange={setTab}
        tabs={[
          { id: 'branding', label: 'Branding', content: brandingTab },
          { id: 'security', label: 'Security', content: securityTab },
          { id: 'notifications', label: 'Notifications', content: notificationsTab },
          { id: 'guardrails', label: 'AI & guardrails', content: guardrailsTab },
        ]}
      />

      <div className="flex justify-end">
        <GlowButton glow="subtle">Save settings</GlowButton>
      </div>
    </div>
  );
}

