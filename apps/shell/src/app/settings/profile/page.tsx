'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowInput, GlowButton, GlowSwitch, GlowBadge, GlowSelect } from '@/components/glow-ui';
import { AvatarUpload } from '@/components/settings/AvatarUpload';
import { ConfirmDialog } from '@/components/settings/ConfirmDialog';
import {
  mockProfileSettings,
  mockTimezones,
} from '@/lib/mock-data';
import { CheckCircle2, Shield, Bell, AlertCircle } from 'lucide-react';
import { Grid, Stack, spacing } from '@/design-system';
import { profileService } from '@/services/profileService';
import type { ProfileFormData, ProfileFormErrors } from '@/types/profile';

export default function ProfileSettingsPage() {
  const [formState, setFormState] = React.useState(mockProfileSettings);
  const [passwords, setPasswords] = React.useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [errors, setErrors] = React.useState<ProfileFormErrors>({});
  const [saved, setSaved] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [initialFormState, setInitialFormState] = React.useState(mockProfileSettings);

  // Load profile from localStorage on mount
  React.useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await profileService.getProfile();
      if (profile) {
        const profileData = {
          displayName: profile.displayName,
          email: profile.email,
          phone: profile.phone,
          title: profile.title,
          timezone: profile.timezone,
          avatar: profile.avatar,
          notificationPreferences: {
            ...mockProfileSettings.notificationPreferences,
            ...(profile.notificationPreferences || {}),
          },
        };
        setFormState(profileData);
        setInitialFormState(profileData);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Validate
      const validation = profileService.validateProfile(formState);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }

      // Save to localStorage
      await profileService.updateProfile(formState);

      setSaved(true);
      setHasChanges(false);
      setInitialFormState(formState);

      // Hide success message after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setErrors({
        _form: 'Failed to save profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
    setSaved(false);

    // Clear field error when user types
    if (errors[key as keyof ProfileFormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleCancel = () => {
    setFormState(initialFormState);
    setErrors({});
    setHasChanges(false);
    setSaved(false);
  };

  const toggleNotification = (key: keyof typeof formState.notificationPreferences) => {
    setFormState((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key],
      },
    }));
    setHasChanges(true);
    setSaved(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="6xl">
        {errors._form && (
          <GlowCard variant="elevated">
            <GlowCardContent>
              <Stack direction="row" gap="sm" align="center">
                <AlertCircle className="h-5 w-5 text-vision-red-600" />
                <span className="text-sm text-vision-red-900">{errors._form}</span>
              </Stack>
            </GlowCardContent>
          </GlowCard>
        )}

        <GlowCard variant="elevated">
          <GlowCardHeader className="space-y-1.5">
            <GlowCardTitle>Profile</GlowCardTitle>
            <GlowCardDescription>Update your personal information and avatar.</GlowCardDescription>
          </GlowCardHeader>
          <GlowCardContent>
            <Stack gap="xl">
              <AvatarUpload
                value={formState.avatar}
                onChange={(val) => handleInputChange('avatar', val)}
                helperText="Used across teams and documents."
              />
              <Grid columns={2} gap="lg">
                <GlowInput
                  label="Display name"
                  value={formState.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  variant={errors.displayName ? 'error' : 'glow'}
                  error={errors.displayName}
                  required
                  disabled={isLoading}
                />
                <GlowInput
                  label="Email"
                  value={formState.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  variant={errors.email ? 'error' : 'default'}
                  error={errors.email}
                  required
                  disabled={isLoading}
                  helperText="Email is managed by your workspace admin."
                />
                <GlowInput
                  label="Phone"
                  placeholder="+1 (555) 123-4567"
                  value={formState.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  variant={errors.phone ? 'error' : 'default'}
                  error={errors.phone}
                  disabled={isLoading}
                />
                <GlowInput
                  label="Title / Role"
                  value={formState.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  variant={errors.title ? 'error' : 'default'}
                  error={errors.title}
                  disabled={isLoading}
                />
                <GlowSelect
                  label="Timezone"
                  value={formState.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  variant="glow"
                  disabled={isLoading}
                >
                  {mockTimezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label} ({tz.offset})
                    </option>
                  ))}
                </GlowSelect>
              </Grid>
            </Stack>
          </GlowCardContent>
        </GlowCard>

        <GlowCard variant="elevated">
          <GlowCardHeader className="space-y-1.5">
            <GlowCardTitle>Security</GlowCardTitle>
            <GlowCardDescription>Keep your account secure with a strong password.</GlowCardDescription>
          </GlowCardHeader>
          <GlowCardContent>
            <Grid columns={3} gap="lg">
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
            </Grid>
          </GlowCardContent>
        </GlowCard>

        <GlowCard variant="elevated">
          <GlowCardHeader className="space-y-1.5">
            <GlowCardTitle>Notifications</GlowCardTitle>
            <GlowCardDescription>Choose what updates you want to receive.</GlowCardDescription>
          </GlowCardHeader>
          <GlowCardContent>
            <Grid columns={2} gap="xl">
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
            </Grid>
            <Stack direction="row" gap="sm" style={{ flexWrap: 'wrap', marginTop: spacing['3xl'] }}>
              <span className="text-xs text-vision-gray-500">Preferred channels:</span>
              <GlowBadge variant="outline" size="sm">
                Email
              </GlowBadge>
              <GlowBadge variant="outline" size="sm">
                In-app
              </GlowBadge>
            </Stack>
          </GlowCardContent>
        </GlowCard>

        <Stack direction="row" justify="space-between" align="center">
          <Stack direction="row" gap="sm" align="center">
            <Shield className="h-4 w-4 text-vision-blue-950" />
            <span className="text-sm text-vision-gray-500">Changes auto-save on submit. Your data stays in this workspace.</span>
          </Stack>
          <Stack direction="row" gap="sm" align="center">
            <GlowButton
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isLoading || !hasChanges}
            >
              Cancel
            </GlowButton>
            <GlowButton
              type="submit"
              glow="subtle"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              disabled={isLoading || !hasChanges}
            >
              {isLoading ? 'Saving...' : 'Save changes'}
            </GlowButton>
            {saved && <GlowBadge variant="success" size="sm">Saved</GlowBadge>}
          </Stack>
        </Stack>

        <GlowCard variant="interactive">
          <GlowCardHeader>
            <GlowCardTitle className="text-vision-red-900">Danger zone</GlowCardTitle>
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
      </Stack>
    </form>
  );
}
