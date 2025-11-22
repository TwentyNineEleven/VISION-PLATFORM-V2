'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  GlowBadge,
  GlowButton,
  GlowCard,
  GlowCardContent,
  GlowModal,
  GlowModalClose,
  Grid,
} from '@/components/glow-ui';
import { CheckSquare, Grid3x3, Layers, Lock, Sparkles } from 'lucide-react';
import { mockApps } from '@/lib/mock-data';
import type { OnboardingFormValues } from './types';
import { cn } from '@/lib/utils';
import { AppCard } from '@/components/AppCard';
import { mapAppToCardProps } from '@/lib/app-card';

const planOptions = [
  {
    id: 'free',
    name: 'Starter',
    price: '$0',
    description: 'Core tools for small teams getting started.',
    perks: ['Up to 3 apps', 'Community support', 'Basic analytics'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    description: 'Unlock collaboration, automation, and AI co-pilots.',
    perks: ['Unlimited apps', 'AI drafting', 'Shared workspaces'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'Compliance, governance, and enterprise rollout.',
    perks: ['SSO & SCIM', 'Dedicated success', 'Data residency'],
  },
] as const;

export function AppSelectionStep() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OnboardingFormValues>();

  const [compareOpen, setCompareOpen] = React.useState(false);
  const selectedApps = watch('selectedApps');
  const selectedPlan = watch('plan');

  const toggleApp = (appId: string) => {
    const nextSelection = selectedApps?.includes(appId)
      ? selectedApps.filter((id) => id !== appId)
      : [...(selectedApps || []), appId];
    setValue('selectedApps', nextSelection, { shouldDirty: true, shouldValidate: false });
  };

  const handleSelectAll = () => {
    const activeAppIds = mockApps.filter((app) => app.status === 'active').map((a) => a.id);
    setValue('selectedApps', activeAppIds, { shouldDirty: true, shouldValidate: false });
  };

  const handleDeselectAll = () => {
    setValue('selectedApps', [], { shouldDirty: true, shouldValidate: false });
  };

  const badgeVariantToTone: Record<string, 'success' | 'warning' | 'info'> = {
    Popular: 'success',
    New: 'info',
    Essential: 'warning',
    Beta: 'info',
    Planned: 'warning',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">Choose your starting apps</p>
          <p className="text-sm text-muted-foreground">
            You can add or remove apps anytime. We preselect the most popular choices.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <GlowButton variant="outline" size="sm" onClick={handleSelectAll} leftIcon={<CheckSquare className="h-4 w-4" />}>
            Select all
          </GlowButton>
          <GlowButton variant="ghost" size="sm" onClick={handleDeselectAll}>
            Deselect all
          </GlowButton>
        </div>
      </div>

      <Grid columns={3} gap="lg">
        {mockApps.map((app) => {
          const isSelected = selectedApps?.includes(app.id);
          const isDisabled = app.status !== 'active';
          const badgeTone = badgeVariantToTone[app.badge || ''] || 'info';
          const cardProps = mapAppToCardProps(app);

          return (
            <div key={app.id} className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={!!isSelected}
                onChange={() => toggleApp(app.id)}
                disabled={isDisabled}
              />
              {app.badge && (
                <GlowBadge variant={badgeTone} size="sm" className="absolute left-4 top-4 z-10">
                  {app.badge}
                </GlowBadge>
              )}
              {isSelected && (
                <GlowBadge variant="success" size="sm" className="absolute right-4 top-4 z-10">
                  Selected
                </GlowBadge>
              )}
              <div
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => !isDisabled && toggleApp(app.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    if (!isDisabled) toggleApp(app.id);
                  }
                }}
                className={cn(
                  'focus-visible:outline-none',
                  isDisabled && 'pointer-events-none opacity-60'
                )}
              >
                <AppCard
                  {...cardProps}
                  onLaunch={() => {}}
                  className={cn(
                    'cursor-pointer',
                    isSelected && 'ring-2 ring-primary ring-offset-2'
                  )}
                />
              </div>
              {isDisabled && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  {app.status === 'coming-soon' ? 'Coming soon' : 'Restricted'}
                </div>
              )}
            </div>
          );
        })}
      </Grid>

      <div className="space-y-3 rounded-lg border border-border p-4 shadow-ambient-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Plan selection</p>
              <p className="text-sm text-muted-foreground">Choose the plan that fits your rollout.</p>
            </div>
          </div>
          <GlowButton variant="outline" size="sm" onClick={() => setCompareOpen(true)} leftIcon={<Layers className="h-4 w-4" />}>
            Compare plans
          </GlowButton>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {planOptions.map((plan) => (
            <label
              key={plan.id}
              className={cn(
                'flex cursor-pointer flex-col rounded-lg border p-4 transition-all',
                selectedPlan === plan.id
                  ? 'border-secondary shadow-glow-success-lg bg-secondary/5'
                  : 'border-border hover:border-secondary/60 hover:shadow-ambient-card'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-foreground">{plan.name}</p>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <input
                  type="radio"
                  value={plan.id}
                  checked={selectedPlan === plan.id}
                  onChange={() => setValue('plan', plan.id as OnboardingFormValues['plan'], { shouldDirty: true })}
                  className="h-4 w-4 accent-secondary"
                />
              </div>
              <p className="mt-3 text-2xl font-semibold text-foreground">{plan.price}</p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <CheckSquare className="h-3.5 w-3.5 text-secondary" />
                    {perk}
                  </li>
                ))}
              </ul>
            </label>
          ))}
        </div>

        {errors.plan && <p className="text-sm text-destructive">{errors.plan.message}</p>}
      </div>

      <GlowModal
        open={compareOpen}
        onOpenChange={setCompareOpen}
        title="Plan comparison"
        description="See what is included in each plan."
        size="xl"
        footer={
          <GlowModalClose asChild>
            <GlowButton variant="default">Close</GlowButton>
          </GlowModalClose>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {planOptions.map((plan) => (
            <GlowCard key={plan.id} padding="md" variant="flat" className="space-y-3">
              <GlowCardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold">{plan.name}</p>
                  <GlowBadge variant="info" size="sm">
                    {plan.price}
                  </GlowBadge>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="space-y-1">
                  {plan.perks.map((perk) => (
                    <div key={perk} className="flex items-center gap-2 text-sm text-foreground">
                      <Grid3x3 className="h-3.5 w-3.5 text-primary" />
                      {perk}
                    </div>
                  ))}
                </div>
              </GlowCardContent>
            </GlowCard>
          ))}
        </div>
      </GlowModal>
    </div>
  );
}
