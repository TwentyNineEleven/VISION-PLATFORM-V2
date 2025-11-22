'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { GlowInput, GlowBadge } from '@/components/glow-ui';
import { Building, Inbox, Info, MapPin } from 'lucide-react';
import { mockOrganizationTypes, mockCountries } from '@/lib/mock-data';
import type { OnboardingFormValues } from './types';
import { cn } from '@/lib/utils';

export function OrganizationStep() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<OnboardingFormValues>();

  const choice = watch('organizationChoice');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            value: 'create',
            title: 'Create Organization',
            description: 'Set up a workspace for your team with full admin controls.',
            badge: 'Recommended',
          },
          {
            value: 'join',
            title: 'Join Organization',
            description: 'Use an invite code from your admin to join an existing workspace.',
          },
        ].map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all',
              choice === option.value
                ? 'border-primary shadow-glow-primary-sm bg-primary/5'
                : 'border-border hover:border-primary/50 hover:shadow-ambient-card'
            )}
          >
            <input
              type="radio"
              value={option.value}
              {...register('organizationChoice')}
              className="mt-1 h-4 w-4 accent-primary"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-foreground">{option.title}</p>
                {option.badge && (
                  <GlowBadge variant="success" size="sm">
                    {option.badge}
                  </GlowBadge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </label>
        ))}
      </div>

      {choice === 'create' ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <GlowInput
              {...register('organizationName')}
              label="Organization name"
              placeholder="Hope Community Foundation"
              variant={errors.organizationName ? 'error' : 'glow'}
              error={errors.organizationName?.message}
              leftIcon={<Building className="h-4 w-4" />}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Organization type</label>
              <select
                {...register('organizationType')}
                className={cn(
                  'h-11 w-full rounded-md border bg-transparent px-3 text-sm shadow-sm transition-colors',
                  errors.organizationType
                    ? 'border-destructive focus:border-destructive focus:ring-destructive'
                    : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/50'
                )}
                defaultValue=""
              >
                <option value="" disabled>
                  Select type
                </option>
                {mockOrganizationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.organizationType && (
                <p className="text-sm text-destructive">{errors.organizationType.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <GlowInput
              {...register('ein')}
              label="EIN / Tax ID"
              placeholder="12-3456789"
              helperText="Optional"
            />
            <GlowInput
              {...register('website')}
              label="Website URL"
              placeholder="https://example.org"
              variant={errors.website ? 'error' : 'glow'}
              error={errors.website?.message}
            />
          </div>

          <div className="space-y-3 rounded-lg border border-dashed border-border p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-primary" />
              Mailing address
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <GlowInput {...register('address.street')} label="Street address" placeholder="123 Main St" />
              <GlowInput {...register('address.city')} label="City" placeholder="New York" />
              <GlowInput {...register('address.state')} label="State / Province" placeholder="NY" />
              <GlowInput {...register('address.postalCode')} label="ZIP / Postal code" placeholder="10001" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <select
                {...register('address.country')}
                className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
                defaultValue=""
              >
                <option value="" disabled>
                  Select country
                </option>
                {mockCountries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <GlowInput
            {...register('inviteCode')}
            label="Invite code"
            placeholder="e.g. TEAM-42-ACCESS"
            variant={errors.inviteCode ? 'error' : 'glow'}
            error={errors.inviteCode?.message}
            leftIcon={<Inbox className="h-4 w-4" />}
          />
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            <Info className="h-4 w-4 text-primary" />
            <p>Ask your organization admin for an invite code to join their workspace.</p>
          </div>
        </div>
      )}
    </div>
  );
}
