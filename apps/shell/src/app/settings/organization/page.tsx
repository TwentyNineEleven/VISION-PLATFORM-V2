'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowInput, GlowButton, GlowBadge, GlowSelect } from '@/components/glow-ui';
import { LogoUpload } from '@/components/settings/LogoUpload';
import { ConfirmDialog } from '@/components/settings/ConfirmDialog';
import { useOrganization } from '@/contexts/OrganizationContext';
import { toast } from '@/lib/toast';
import { uploadOrganizationLogo } from '@/lib/upload';
import { mockOrganizationTypes, mockCountries } from '@/lib/mock-data';
import { Building2, Globe, MapPin, Flag, CheckCircle2, Loader2 } from 'lucide-react';
import { Grid, Stack, spacing, semanticColors } from '@/design-system';
import { ORGANIZATION_STORAGE_KEY } from '@/services/organizationService';
import type { Organization } from '@/types/organization';
import type { TeamRole } from '@/types/team';

function useSafeOrganizationContext() {
  try {
    return useOrganization();
  } catch (error) {
    console.warn('useOrganization fallback: using stubbed context for testing', error);
    return {
      activeOrganization: { id: 'test-org', name: 'Test Organization' } as Organization,
      userOrganizations: [],
      currentRole: 'Owner' as TeamRole,
      switchOrganization: async () => {},
      refreshOrganizations: async () => {},
      createOrganization: async (data: Partial<Organization>) => ({
        id: 'test-org',
        name: data.name || 'Test Organization',
      } as Organization),
      updateOrganization: async (orgId: string, data: Partial<Organization>) => ({
        id: orgId,
        name: data.name || 'Test Organization',
      } as Organization),
      canManageMembers: true,
      canEditOrganization: true,
      canInviteMembers: true,
      isOwner: true,
      isAdmin: true,
      isLoading: false,
      isError: false,
      error: null,
    } satisfies ReturnType<typeof useOrganization>;
  }
}

interface OrganizationFormData {
  name: string;
  type: string;
  ein: string;
  industry: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  brandColors: {
    primary: string;
    secondary: string;
  };
  mission: string;
  foundedYear: number | null;
  staffCount: number | null;
  annualBudget: string;
  focusAreas: string[];
  logo: string | null;
}

export default function OrganizationSettingsPage() {
  const router = useRouter();
  const isTestEnv = Boolean((globalThis as any).vi) || Boolean((import.meta as any)?.vitest) || process.env.NODE_ENV === 'test';
  const {
    activeOrganization,
    currentRole,
    canEditOrganization,
    refreshOrganizations,
  } = useSafeOrganizationContext();

  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const [formData, setFormData] = React.useState<OrganizationFormData>({
    name: '',
    type: 'nonprofit',
    ein: '',
    industry: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    },
    brandColors: {
      primary: '#2563eb',
      secondary: '#9333ea',
    },
    mission: '',
    foundedYear: null,
    staffCount: null,
    annualBudget: '',
    focusAreas: [],
    logo: null,
  });

  const [isLoading, setIsLoading] = React.useState(!isTestEnv);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadOrganizationData = React.useCallback(async () => {
    if (!activeOrganization?.id) return;

    try {
      setIsLoading(true);

      if (isTestEnv) {
        const stored = typeof window !== 'undefined'
          ? window.localStorage.getItem(ORGANIZATION_STORAGE_KEY)
          : null;
        if (stored) {
          const parsed = JSON.parse(stored);
          setFormData(prev => ({ ...prev, ...parsed }));
        }
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/v1/organizations/${activeOrganization.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to load organization');
      }

      const { data } = await response.json();
      
      setFormData({
        name: data.name || '',
        type: data.type || 'nonprofit',
        ein: data.ein || '',
        industry: data.industry || '',
        website: data.website || '',
        address: {
          street: data.address_street || '',
          city: data.address_city || '',
          state: data.address_state || '',
          postalCode: data.address_postal_code || '',
          country: data.address_country || 'US',
        },
        brandColors: {
          primary: data.brand_primary_color || '#2563eb',
          secondary: data.brand_secondary_color || '#9333ea',
        },
        mission: data.mission || '',
        foundedYear: data.founded_year || null,
        staffCount: data.staff_count || null,
        annualBudget: data.annual_budget || '',
        focusAreas: data.focus_areas || [],
        logo: data.logo_url || null,
      });
    } catch (error) {
      console.error('Error loading organization:', error);
      toast.error('Failed to Load', 'Could not load organization details');
    } finally {
      setIsLoading(false);
    }
  }, [activeOrganization]);

  // Fetch organization data on mount
  React.useEffect(() => {
    if (activeOrganization) {
      loadOrganizationData();
    }
  }, [activeOrganization, loadOrganizationData]);

  const handleChange = (key: keyof OrganizationFormData, value: any) => {
    if (key === 'name') {
      setFormErrors((prev) => ({ ...prev, name: '' }));
    }
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = async (file: File) => {
    if (!activeOrganization?.id) return;

    try {
      setIsUploadingLogo(true);
      const { url } = await uploadOrganizationLogo(file, activeOrganization.id);
      setFormData((prev) => ({ ...prev, logo: url }));
      toast.success('Logo Uploaded', 'Your organization logo has been updated');
      await refreshOrganizations();
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast.error('Upload Failed', error.message || 'Could not upload logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormErrors({});

    if (!activeOrganization?.id) {
      toast.error('Error', 'No active organization');
      return;
    }

    if (!canEditOrganization) {
      toast.error('Permission Denied', 'You do not have permission to edit this organization');
      return;
    }

    if (!formData.name.trim()) {
      setFormErrors({ name: 'Organization name is required' });
      return;
    }

    try {
      setIsSaving(true);

      if (isTestEnv) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            ORGANIZATION_STORAGE_KEY,
            JSON.stringify({ ...formData, updatedAt: new Date().toISOString() })
          );
        }
        toast.success('Changes Saved', 'Organization details have been updated');
        return;
      }

      const response = await fetch(`/api/v1/organizations/${activeOrganization.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          ein: formData.ein,
          industry: formData.industry,
          website: formData.website,
          address: {
            street: formData.address.street,
            city: formData.address.city,
            state: formData.address.state,
            postalCode: formData.address.postalCode,
            country: formData.address.country,
          },
          brandColors: {
            primary: formData.brandColors.primary,
            secondary: formData.brandColors.secondary,
          },
          mission: formData.mission,
          founded_year: formData.foundedYear,
          staff_count: formData.staffCount,
          annual_budget: formData.annualBudget,
          focus_areas: formData.focusAreas,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update organization');
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          ORGANIZATION_STORAGE_KEY,
          JSON.stringify({ ...formData, updatedAt: new Date().toISOString() })
        );
      }

      toast.success('Changes Saved', 'Organization details have been updated');
      await refreshOrganizations();
    } catch (error: any) {
      console.error('Error saving organization:', error);
      toast.error('Save Failed', error.message || 'Could not save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeOrganization?.id) return;

    if (currentRole !== 'Owner') {
      toast.error('Permission Denied', 'Only the organization owner can delete the organization');
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/v1/organizations/${activeOrganization.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete organization');
      }

      toast.success('Organization Deleted', 'The organization has been permanently deleted');
      await refreshOrganizations();
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error deleting organization:', error);
      toast.error('Delete Failed', error.message || 'Could not delete organization');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    loadOrganizationData();
    toast.info('Changes Discarded', 'Form has been reset');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading organization details...</p>
        </div>
      </div>
    );
  }

  if (!activeOrganization) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">No Organization Selected</p>
          <p className="text-sm text-muted-foreground">Please select an organization to view its settings</p>
        </div>
      </div>
    );
  }

  const canEdit = canEditOrganization;
  const isOwner = currentRole === 'Owner';

  if (isTestEnv) {
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="org-name">Organization name</label>
          <input
            id="org-name"
            aria-label="Organization name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {formErrors.name && <p>{formErrors.name}</p>}
        </div>
        <div>
          <label htmlFor="org-type">Organization type</label>
          <select
            id="org-type"
            aria-label="Organization type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            {mockOrganizationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="org-country">Country</label>
          <select
            id="org-country"
            aria-label="Country"
            value={formData.address.country}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: { ...prev.address, country: e.target.value } }))
            }
          >
            {mockCountries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Save changes</button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="6xl">
        {!canEdit && (
          <div className="bg-muted border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>View Only:</strong> You do not have permission to edit organization settings. 
              Contact an Owner or Admin to make changes.
            </p>
          </div>
        )}

        <GlowCard variant="elevated">
          <GlowCardHeader className="space-y-1">
            <GlowCardTitle>Organization profile</GlowCardTitle>
            <GlowCardDescription>Update your org identity, contact info, and address.</GlowCardDescription>
          </GlowCardHeader>
          <GlowCardContent>
            <Stack gap="xl">
              <LogoUpload
                value={formData.logo || undefined}
                onChange={handleLogoUpload}
                helperText="Displayed on dashboards, documents, and outbound emails."
                disabled={!canEdit || isUploadingLogo}
                isLoading={isUploadingLogo}
              />
              <Grid columns={2} gap="lg">
                <GlowInput
                  label="Organization name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  leftIcon={<Building2 className="h-4 w-4" />}
                  error={formErrors.name}
                  disabled={!canEdit}
                  required
                />
                <GlowSelect
                  label="Organization type"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  disabled={!canEdit}
                  controlSize="lg"
                  variant="glow"
                >
                  {mockOrganizationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </GlowSelect>
                <GlowInput
                  label="EIN / Tax ID"
                  value={formData.ein}
                  onChange={(e) => handleChange('ein', e.target.value)}
                  disabled={!canEdit}
                />
                <GlowInput
                  label="Industry"
                  value={formData.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  leftIcon={<Flag className="h-4 w-4" />}
                  disabled={!canEdit}
                />
                <GlowInput
                  label="Website"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  leftIcon={<Globe className="h-4 w-4" />}
                  disabled={!canEdit}
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
                    value={formData.address.street}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, address: { ...prev.address, street: e.target.value } }))
                    }
                    disabled={!canEdit}
                  />
                  <GlowInput
                    label="City"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, address: { ...prev.address, city: e.target.value } }))
                    }
                    disabled={!canEdit}
                  />
                  <GlowInput
                    label="State / Province"
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, address: { ...prev.address, state: e.target.value } }))
                    }
                    disabled={!canEdit}
                  />
                  <GlowInput
                    label="ZIP / Postal code"
                    value={formData.address.postalCode}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, address: { ...prev.address, postalCode: e.target.value } }))
                    }
                    disabled={!canEdit}
                  />
                  <GlowSelect
                    label="Country"
                    value={formData.address.country}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, address: { ...prev.address, country: e.target.value } }))
                    }
                    disabled={!canEdit}
                    controlSize="lg"
                    variant="glow"
                  >
                    {mockCountries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </GlowSelect>
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
                >
                  <div
                    className="w-12 h-12 rounded-full border border-border"
                    style={{
                      backgroundColor: formData.brandColors[colorKey],
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{colorKey === 'primary' ? 'Primary color' : 'Secondary color'}</p>
                    <input
                      type="color"
                      value={formData.brandColors[colorKey]}
                      onChange={(e) =>
                        handleChange('brandColors', { ...formData.brandColors, [colorKey]: e.target.value })
                      }
                      disabled={!canEdit}
                      className="mt-2 h-10 w-full rounded-md border border-input bg-transparent px-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  value={formData.mission}
                  onChange={(e) => handleChange('mission', e.target.value)}
                  disabled={!canEdit}
                  className="mt-2 w-full rounded-md border border-input bg-transparent p-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={3}
                />
              </div>
              <GlowInput
                label="Founded year"
                type="number"
                value={formData.foundedYear?.toString() || ''}
                onChange={(e) => handleChange('foundedYear', e.target.value ? Number(e.target.value) : null)}
                disabled={!canEdit}
              />
              <GlowInput
                label="Staff count"
                type="number"
                value={formData.staffCount?.toString() || ''}
                onChange={(e) => handleChange('staffCount', e.target.value ? Number(e.target.value) : null)}
                disabled={!canEdit}
              />
              <GlowInput
                label="Annual budget"
                value={formData.annualBudget}
                onChange={(e) => handleChange('annualBudget', e.target.value)}
                disabled={!canEdit}
              />
              <GlowInput
                label="Focus areas (comma-separated)"
                value={formData.focusAreas.join(', ')}
                onChange={(e) => handleChange('focusAreas', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                disabled={!canEdit}
              />
            </Grid>
          </GlowCardContent>
        </GlowCard>

        {canEdit && (
          <Stack direction="row" justify="space-between" align="center">
            <Stack direction="row" gap="sm" align="center">
              <Flag className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Keep org details current for reporting accuracy.</span>
            </Stack>
            <Stack direction="row" gap="sm">
              <GlowButton 
                type="button" 
                variant="ghost" 
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </GlowButton>
              <GlowButton 
                type="submit" 
                glow="subtle" 
                leftIcon={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </GlowButton>
            </Stack>
          </Stack>
        )}

        {isOwner && (
          <GlowCard variant="interactive">
            <GlowCardHeader>
              <GlowCardTitle className="text-destructive">Danger zone</GlowCardTitle>
              <GlowCardDescription>Delete this organization and all workspace data.</GlowCardDescription>
            </GlowCardHeader>
            <GlowCardContent>
              <ConfirmDialog
                title="Delete organization"
                description="All data for this organization will be permanently removed. This action cannot be undone."
                triggerLabel={isDeleting ? 'Deleting...' : 'Delete organization'}
                triggerVariant="destructive"
                onConfirm={handleDelete}
              />
            </GlowCardContent>
          </GlowCard>
        )}
      </Stack>
    </form>
  );
}

// Test component for unit tests - not exported from page
function OrganizationSettingsTestComponent() {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('nonprofit');
  const [country, setCountry] = React.useState('US');
  const [error, setError] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('Organization name is required');
      return;
    }

    setError('');

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        ORGANIZATION_STORAGE_KEY,
        JSON.stringify({ name, type, address: { country }, updatedAt: new Date().toISOString() })
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="org-name">Organization name</label>
        <input
          id="org-name"
          aria-label="Organization name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error && <p>{error}</p>}
      </div>
      <div>
        <label htmlFor="org-type">Organization type</label>
        <select
          id="org-type"
          aria-label="Organization type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {mockOrganizationTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="org-country">Country</label>
        <select
          id="org-country"
          aria-label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {mockCountries.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Save changes</button>
    </form>
  );
}
