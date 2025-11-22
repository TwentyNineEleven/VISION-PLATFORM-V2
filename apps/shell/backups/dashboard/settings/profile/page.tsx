'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowInput, GlowButton, GlowSwitch, GlowBadge } from '@/components/glow-ui';
import { AvatarUpload } from '@/components/settings/AvatarUpload';
import { ConfirmDialog } from '@/components/settings/ConfirmDialog';
import {
  mockProfileSettings,
  mockTimezones,
} from '@/lib/mock-data';
import { CheckCircle2, Shield, Bell } from 'lucide-react';

export default function ProfileSettingsPage() {
  const [formState, setFormState] = React.useState(mockProfileSettings);
  const [passwords, setPasswords] = React.useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [saved, setSaved] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleInputChange = (key: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const toggleNotification = (key: keyof typeof formState.notificationPreferences) => {
    setFormState((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key],
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <GlowCard variant="elevated">
        <GlowCardHeader className="space-y-1.5">
          <GlowCardTitle>Profile</GlowCardTitle>
          <GlowCardDescription>Update your personal information and avatar.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent className="space-y-6">
          <AvatarUpload
            value={formState.avatar}
            onChange={(val) => handleInputChange('avatar', val)}
            helperText="Used across teams and documents."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <GlowInput
              label="Display name"
              value={formState.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              variant="glow"
            />
            <GlowInput
              label="Email"
              value={formState.email}
              readOnly
              helperText="Email is managed by your workspace admin."
            />
            <GlowInput
              label="Phone"
              placeholder="+1 (555) 123-4567"
              value={formState.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            <GlowInput
              label="Title / Role"
              value={formState.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Timezone</label>
              <select
                value={formState.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
              >
                {mockTimezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label} ({tz.offset})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="elevated">
        <GlowCardHeader className="space-y-1.5">
          <GlowCardTitle>Security</GlowCardTitle>
          <GlowCardDescription>Keep your account secure with a strong password.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent className="grid gap-4 md:grid-cols-3">
          <GlowInput
            type="password"
            label="Current password"
            value={passwords.current}
            onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
          />
          <GlowInput
            type="password"
            label="New password"
            value={passwords.next}
            onChange={(e) => setPasswords((prev) => ({ ...prev, next: e.target.value }))}
          />
          <GlowInput
            type="password"
            label="Confirm new password"
            value={passwords.confirm}
            onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
          />
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="elevated">
        <GlowCardHeader className="space-y-1.5">
          <GlowCardTitle>Notifications</GlowCardTitle>
          <GlowCardDescription>Choose what updates you want to receive.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <GlowSwitch
              checked={formState.notificationPreferences.productUpdates}
              onCheckedChange={() => toggleNotification('productUpdates')}
              label="Product updates"
            />
            <GlowSwitch
              checked={formState.notificationPreferences.securityAlerts}
              onCheckedChange={() => toggleNotification('securityAlerts')}
              label="Security alerts"
            />
            <GlowSwitch
              checked={formState.notificationPreferences.weeklySummary}
              onCheckedChange={() => toggleNotification('weeklySummary')}
              label="Weekly summary"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            Preferred channels:
            <GlowBadge variant="outline" size="sm">
              Email
            </GlowBadge>
            <GlowBadge variant="outline" size="sm">
              In-app
            </GlowBadge>
          </div>
        </GlowCardContent>
      </GlowCard>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-primary" />
          <span>Changes auto-save on submit. Your data stays in this workspace.</span>
        </div>
        <div className="flex items-center gap-2">
          <GlowButton type="button" variant="ghost" onClick={() => setFormState(mockProfileSettings)}>
            Cancel
          </GlowButton>
          <GlowButton type="submit" glow="subtle" leftIcon={<CheckCircle2 className="h-4 w-4" />}>
            Save changes
          </GlowButton>
          {saved && <GlowBadge variant="success" size="sm">Saved</GlowBadge>}
        </div>
      </div>

      <GlowCard variant="interactive">
        <GlowCardHeader>
          <GlowCardTitle className="text-destructive">Danger zone</GlowCardTitle>
          <GlowCardDescription>Delete your account permanently.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent>
          <ConfirmDialog
            title="Delete account"
            description="This will remove your profile and access. This action cannot be undone."
            triggerLabel="Delete account"
            onConfirm={() => console.log('deleted')}
          />
        </GlowCardContent>
      </GlowCard>
    </form>
  );
}
