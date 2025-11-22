'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowInput, GlowButton, GlowBadge } from '@/components/glow-ui';
import { LogoUpload } from '@/components/settings/LogoUpload';
import { ConfirmDialog } from '@/components/settings/ConfirmDialog';
import {
  mockOrganizationSettings,
  mockOrganizationTypes,
  mockCountries,
} from '@/lib/mock-data';
import { Building2, Globe, MapPin, Flag, CheckCircle2 } from 'lucide-react';

export default function OrganizationSettingsPage() {
  const [state, setState] = React.useState(mockOrganizationSettings);
  const [saved, setSaved] = React.useState(false);

  const handleChange = (key: keyof typeof state, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <GlowCard variant="elevated">
        <GlowCardHeader className="space-y-1">
          <GlowCardTitle>Organization profile</GlowCardTitle>
          <GlowCardDescription>Update your org identity, contact info, and address.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent className="space-y-6">
          <LogoUpload
            value={state.logo}
            onChange={(val) => handleChange('logo', val)}
            helperText="Displayed on dashboards, documents, and outbound emails."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <GlowInput
              label="Organization name"
              value={state.name}
              onChange={(e) => handleChange('name', e.target.value)}
              leftIcon={<Building2 className="h-4 w-4" />}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization type</label>
              <select
                value={state.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
              >
                {mockOrganizationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <GlowInput
              label="EIN / Tax ID"
              value={state.ein}
              onChange={(e) => handleChange('ein', e.target.value)}
            />
            <GlowInput
              label="Website"
              value={state.website}
              onChange={(e) => handleChange('website', e.target.value)}
              leftIcon={<Globe className="h-4 w-4" />}
            />
          </div>

          <div className="space-y-3 rounded-lg border border-dashed border-border p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Address
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <GlowInput
                label="Street address"
                value={state.address.street}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, address: { ...prev.address, street: e.target.value } }))
                }
              />
              <GlowInput
                label="City"
                value={state.address.city}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, address: { ...prev.address, city: e.target.value } }))
                }
              />
              <GlowInput
                label="State / Province"
                value={state.address.state}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, address: { ...prev.address, state: e.target.value } }))
                }
              />
              <GlowInput
                label="ZIP / Postal code"
                value={state.address.postalCode}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    address: { ...prev.address, postalCode: e.target.value },
                  }))
                }
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <select
                  value={state.address.country}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, address: { ...prev.address, country: e.target.value } }))
                  }
                  className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
                >
                  {mockCountries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </GlowCardContent>
      </GlowCard>

      <GlowCard variant="elevated">
        <GlowCardHeader>
          <GlowCardTitle>Additional details</GlowCardTitle>
          <GlowCardDescription>Help apps tailor recommendations and compliance outputs.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Mission statement</label>
            <textarea
              value={state.mission}
              onChange={(e) => handleChange('mission', e.target.value)}
              className="mt-2 w-full rounded-md border border-input bg-transparent p-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/50"
              rows={3}
            />
          </div>
          <GlowInput
            label="Founded year"
            value={state.foundedYear || ''}
            onChange={(e) => handleChange('foundedYear', Number(e.target.value))}
          />
          <GlowInput
            label="Staff count"
            value={state.staffCount || ''}
            onChange={(e) => handleChange('staffCount', Number(e.target.value))}
          />
          <GlowInput
            label="Annual budget"
            value={state.annualBudget}
            onChange={(e) => handleChange('annualBudget', e.target.value)}
          />
          <GlowInput
            label="Focus areas"
            value={state.focusAreas?.join(', ') || ''}
            onChange={(e) => handleChange('focusAreas', e.target.value.split(',').map((s) => s.trim()))}
          />
        </GlowCardContent>
      </GlowCard>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Flag className="h-4 w-4 text-primary" />
          <span>Keep org details current for reporting accuracy.</span>
        </div>
        <div className="flex items-center gap-2">
          <GlowButton type="button" variant="ghost" onClick={() => setState(mockOrganizationSettings)}>
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
          <GlowCardDescription>Delete this organization and all workspace data.</GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent>
          <ConfirmDialog
            title="Delete organization"
            description="All data for this organization will be permanently removed."
            triggerLabel="Delete organization"
            onConfirm={() => console.log('delete org')}
          />
        </GlowCardContent>
      </GlowCard>
    </form>
  );
}
