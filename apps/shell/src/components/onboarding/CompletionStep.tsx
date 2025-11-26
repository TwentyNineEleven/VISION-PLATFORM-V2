'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { CheckCircle2, ArrowRight, Mail, Compass } from 'lucide-react';
import { GlowButton, GlowCard, GlowBadge } from '@/components/glow-ui';
import type { OnboardingFormValues } from './types';
import { useRouter } from 'next/navigation';

export function CompletionStep() {
  const { watch, setValue } = useFormContext<OnboardingFormValues>();
  const router = useRouter();

  const displayName = watch('displayName') || 'there';
  const organizationName = watch('organizationName') || 'your organization';
  const selectedApps = watch('selectedApps') || [];

  const handleToggle = (field: 'skipTour' | 'enableEmailNotifications') => {
    setValue(field, !watch(field), { shouldDirty: true });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <GlowCard padding="lg" variant="interactive" className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary shadow-glow-success-sm">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-xl font-semibold text-foreground">
              Welcome, {displayName}!
            </p>
            <p className="text-sm text-muted-foreground">
              {organizationName} is ready to explore the VISION Platform. Your preferences are saved —
              jump into the dashboard or start with a product tour.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedApps.slice(0, 4).map((appId) => (
            <GlowBadge key={appId} variant="outline" size="sm">
              {appId}
            </GlowBadge>
          ))}
          {selectedApps.length > 4 && (
            <GlowBadge variant="info" size="sm">
              +{selectedApps.length - 4} more
            </GlowBadge>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <GlowButton
            glow="subtle"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </GlowButton>
          <GlowButton
            variant="outline"
            onClick={() => router.push('/applications')}
            rightIcon={<Compass className="h-4 w-4" />}
          >
            Explore apps
          </GlowButton>
        </div>
      </GlowCard>

      <GlowCard padding="lg" variant="flat" className="space-y-4">
        <p className="text-sm font-semibold text-foreground">Final preferences</p>
        <div className="space-y-3">
          <label className="flex items-start gap-3 rounded-lg border border-border p-3">
            <input
              type="checkbox"
              checked={!!watch('skipTour')}
              onChange={() => handleToggle('skipTour')}
              className="mt-1 h-4 w-4 accent-primary"
            />
            <div>
              <p className="text-sm font-medium text-foreground">Skip product tour</p>
              <p className="text-xs text-muted-foreground">Jump straight into the dashboard experience.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-border p-3">
            <input
              type="checkbox"
              checked={!!watch('enableEmailNotifications')}
              onChange={() => handleToggle('enableEmailNotifications')}
              className="mt-1 h-4 w-4 accent-primary"
            />
            <div>
              <p className="text-sm font-medium text-foreground">Enable email notifications</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-primary" />
                Receive important updates and weekly summaries.
              </p>
            </div>
          </label>
        </div>
      </GlowCard>
    </div>
  );
}
