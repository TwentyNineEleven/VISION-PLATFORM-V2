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
import { Grid, Stack, spacing, semanticColors } from '@/design-system';

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
    <form onSubmit={handleSubmit}>
      <Stack gap="6xl">
        <GlowCard variant="elevated">
          <GlowCardHeader className="space-y-1">
            <GlowCardTitle>Organization profile</GlowCardTitle>
            <GlowCardDescription>Update your org identity, contact info, and address.</GlowCardDescription>
          </GlowCardHeader>
          <GlowCardContent>
            <Stack gap="xl">
              <LogoUpload
                value={state.logo}
                onChange={(val) => handleChange('logo', val)}
                helperText="Displayed on dashboards, documents, and outbound emails."
              />
              <Grid columns={2} gap="lg">
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
                  label="Industry"
                  value={state.industry || ''}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  leftIcon={<Flag className="h-4 w-4" />}
                />
                <GlowInput
                  label="Website"
                  value={state.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  leftIcon={<Globe className="h-4 w-4" />}
                />
              </Grid>
              <Stack
                gap="sm"
                style={{
                  borderRadius: spacing['3xl'],
                  border: `1px dashed ${semanticColors.borderSecondary}`,
                  padding: spacing['3xl'],
                }}
              >
                <Stack direction="row" gap="sm" align="center">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Address</p>
                </Stack>
                <Grid columns={2} gap="lg">
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
                </Grid>
              </Stack>
            </Stack>
          </GlowCardContent>
        </GlowCard>

        <GlowCard variant="elevated">
          <GlowCardHeader>
            <GlowCardTitle>Branding</GlowCardTitle>
            <GlowCardDescription>Set the colors that appear across communications.</GlowCardDescription>
          </GlowCardHeader>
          <GlowCardContent>
            <Grid columns={2} gap="xl">
              {(['primary', 'secondary'] as const).map((colorKey) => (
                <label
                  key={colorKey}
                  className="flex items-center gap-4 rounded-lg border border-border px-4 py-3"
                  style={{ borderColor: colorKey === 'primary' ? 'var(--border-border)' : 'var(--border-border)' }}
                >
                  <div
                    className="w-12 h-12 rounded-full border border-border"
                    style={{
                      backgroundColor: state.brandColors?.[colorKey] || (colorKey === 'primary' ? '#2563eb' : '#9333ea'),
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{colorKey === 'primary' ? 'Primary color' : 'Secondary color'}</p>
                    <input
                      type="color"
                      value={state.brandColors?.[colorKey] || (colorKey === 'primary' ? '#2563eb' : '#9333ea')}
                      onChange={(e) =>
                        handleChange('brandColors', { ...state.brandColors, [colorKey]: e.target.value })
                      }
                      className="mt-2 h-10 w-full rounded-md border border-input bg-transparent px-3"
                    />
                  </div>
                </label>
              ))}
            </Grid>
          </GlowCardContent>
        </GlowCard>

        <GlowCard variant="elevated">
          <GlowCardHeader>
            <GlowCardTitle>Additional details</GlowCardTitle>
            <GlowCardDescription>Help apps tailor recommendations and compliance outputs.</GlowCardDescription>
          </GlowCardHeader>
          <GlowCardContent>
            <Grid columns={2} gap="lg">
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
            </Grid>
          </GlowCardContent>
        </GlowCard>

        <Stack direction="row" justify="space-between" align="center">
          <Stack direction="row" gap="sm" align="center">
            <Flag className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Keep org details current for reporting accuracy.</span>
          </Stack>
          <Stack direction="row" gap="sm">
            <GlowButton type="button" variant="ghost" onClick={() => setState(mockOrganizationSettings)}>
              Cancel
            </GlowButton>
            <GlowButton type="submit" glow="subtle" leftIcon={<CheckCircle2 className="h-4 w-4" />}>
              Save changes
            </GlowButton>
            {saved && <GlowBadge variant="success" size="sm">Saved</GlowBadge>}
          </Stack>
        </Stack>

        <GlowCard variant="interactive">
          <GlowCardHeader>
            <GlowCardTitle className="text-destructive">Danger zone</GlowCardTitle>
            <GlowCardDescription>Delete this organization and all workspace data.</GlowCardDescription>
          </GlowCardHeader>
          <GlowCardContent>
            <Stack direction="row" gap="md" wrap>
              <ConfirmDialog
                title="Transfer workspace ownership"
                description="Select a new owner to transfer billing, apps, and security responsibilities."
                triggerLabel="Transfer ownership"
                triggerVariant="outline"
                onConfirm={() => console.log('transfer org')}
              />
              <ConfirmDialog
                title="Delete organization"
                description="All data for this organization will be permanently removed."
                triggerLabel="Delete organization"
                onConfirm={() => console.log('delete org')}
              />
            </Stack>
          </GlowCardContent>
        </GlowCard>
      </Stack>
    </form>
  );
}
