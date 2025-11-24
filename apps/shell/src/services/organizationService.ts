'use client';

import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/types/supabase';
import type { Organization, OrganizationBrandColors } from '@/types/organization';

type DbOrganization = Tables<'organizations'>;
type DbOrganizationMember = Tables<'organization_members'>;

export const ORGANIZATION_STORAGE_KEY = 'vision.platform.organization';

/**
 * Convert database organization record to app Organization type
 */
function dbToOrganization(dbOrg: DbOrganization): Organization {
  return {
    id: dbOrg.id,
    name: dbOrg.name,
    type: dbOrg.type || undefined,
    website: dbOrg.website || undefined,
    industry: dbOrg.industry || undefined,
    ein: dbOrg.ein || undefined,
    logo: dbOrg.logo_url || undefined,
    mission: dbOrg.mission || undefined,
    foundedYear: dbOrg.founded_year || undefined,
    staffCount: dbOrg.staff_count || undefined,
    annualBudget: dbOrg.annual_budget || undefined,
    focusAreas: dbOrg.focus_areas || undefined,
    address: {
      street: dbOrg.address_street || undefined,
      city: dbOrg.address_city || undefined,
      state: dbOrg.address_state || undefined,
      postalCode: dbOrg.address_postal_code || undefined,
      country: dbOrg.address_country || undefined,
    },
    brandColors: {
      primary: dbOrg.brand_primary_color,
      secondary: dbOrg.brand_secondary_color,
    },
    updatedAt: dbOrg.updated_at,
  };
}

/**
 * Convert app Organization type to database insert/update format
 */
function organizationToDb(org: Partial<Organization>, ownerId?: string): Partial<DbOrganization> {
  const dbOrg: Partial<DbOrganization> = {};

  if (org.name !== undefined) dbOrg.name = org.name;
  if (org.type !== undefined) dbOrg.type = org.type;
  if (org.website !== undefined) dbOrg.website = org.website;
  if (org.industry !== undefined) dbOrg.industry = org.industry;
  if (org.ein !== undefined) dbOrg.ein = org.ein;
  if (org.logo !== undefined) dbOrg.logo_url = org.logo;
  if (org.mission !== undefined) dbOrg.mission = org.mission;
  if (org.foundedYear !== undefined) dbOrg.founded_year = org.foundedYear;
  if (org.staffCount !== undefined) dbOrg.staff_count = org.staffCount;
  if (org.annualBudget !== undefined) dbOrg.annual_budget = org.annualBudget;
  if (org.focusAreas !== undefined) dbOrg.focus_areas = org.focusAreas;
  
  if (org.address) {
    if (org.address.street !== undefined) dbOrg.address_street = org.address.street;
    if (org.address.city !== undefined) dbOrg.address_city = org.address.city;
    if (org.address.state !== undefined) dbOrg.address_state = org.address.state;
    if (org.address.postalCode !== undefined) dbOrg.address_postal_code = org.address.postalCode;
    if (org.address.country !== undefined) dbOrg.address_country = org.address.country;
  }
  
  if (org.brandColors) {
    if (org.brandColors.primary) dbOrg.brand_primary_color = org.brandColors.primary;
    if (org.brandColors.secondary) dbOrg.brand_secondary_color = org.brandColors.secondary;
  }

  if (ownerId) {
    dbOrg.owner_id = ownerId;
  }

  return dbOrg;
}

export const organizationService = {
  /**
   * Get organization by ID
   */
  async getOrganization(organizationId: string): Promise<Organization | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .is('deleted_at', null)
      .single();

    if (error || !data) {
      return null;
    }

    return dbToOrganization(data);
  },

  /**
   * Get all organizations for the current user
   */
  async getUserOrganizations(): Promise<Array<Organization & { role: string; lastAccessed?: string }>> {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    // Get organizations where user is a member
    const { data: memberships, error } = await supabase
      .from('organization_members')
      .select(`
        role,
        last_accessed_at,
        organizations (*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('last_accessed_at', { ascending: false, nullsFirst: false });

    if (error || !memberships) {
      console.error('Error fetching user organizations:', error);
      return [];
    }

    return memberships
      .filter(m => m.organizations && !Array.isArray(m.organizations))
      .map(m => {
        const org = m.organizations as unknown as DbOrganization;
        return {
          ...dbToOrganization(org),
          role: m.role,
          lastAccessed: m.last_accessed_at || undefined,
        };
      });
  },

  /**
   * Get active organization from user preferences
   */
  async getActiveOrganization(): Promise<Organization | null> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }

    // Get user's active organization from preferences
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('active_organization_id')
      .eq('user_id', user.id)
      .single();

    if (!prefs?.active_organization_id) {
      // No active org set, try to get first org
      const orgs = await this.getUserOrganizations();
      if (orgs.length > 0) {
        // Set first org as active
        await this.setActiveOrganization(orgs[0].id);
        return orgs[0];
      }
      return null;
    }

    return this.getOrganization(prefs.active_organization_id);
  },

  /**
   * Set active organization for current user
   */
  async setActiveOrganization(organizationId: string): Promise<void> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Update user preferences
    const { error: prefsError } = await supabase
      .from('user_preferences')
      .update({ active_organization_id: organizationId })
      .eq('user_id', user.id);

    if (prefsError) {
      throw new Error(`Failed to set active organization: ${prefsError.message}`);
    }

    // Update last_accessed_at for the membership
    const { error: memberError } = await supabase
      .from('organization_members')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('organization_id', organizationId);

    if (memberError) {
      console.warn('Failed to update last access time:', memberError);
    }
  },

  /**
   * Create a new organization (user becomes owner)
   */
  async createOrganization(data: Partial<Organization>): Promise<Organization> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Validate required fields
    if (!data.name) {
      throw new Error('Organization name is required');
    }

    const dbData = organizationToDb(data, user.id);

    const { data: newOrg, error } = await supabase
      .from('organizations')
      .insert(dbData)
      .select()
      .single();

    if (error || !newOrg) {
      throw new Error(`Failed to create organization: ${error?.message || 'Unknown error'}`);
    }

    // Set as active organization
    await this.setActiveOrganization(newOrg.id);

    return dbToOrganization(newOrg);
  },

  /**
   * Update organization
   */
  async updateOrganization(organizationId: string, data: Partial<Organization>): Promise<Organization> {
    const supabase = createClient();

    const dbData = organizationToDb(data);

    const { data: updated, error } = await supabase
      .from('organizations')
      .update(dbData)
      .eq('id', organizationId)
      .is('deleted_at', null)
      .select()
      .single();

    if (error || !updated) {
      throw new Error(`Failed to update organization: ${error?.message || 'Unknown error'}`);
    }

    return dbToOrganization(updated);
  },

  /**
   * Delete organization (soft delete)
   */
  async deleteOrganization(organizationId: string): Promise<void> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('organizations')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
      })
      .eq('id', organizationId)
      .eq('owner_id', user.id); // Only owner can delete

    if (error) {
      throw new Error(`Failed to delete organization: ${error.message}`);
    }

    // If this was the active org, clear it
    const activeOrg = await this.getActiveOrganization();
    if (activeOrg?.id === organizationId) {
      const orgs = await this.getUserOrganizations();
      if (orgs.length > 0) {
        await this.setActiveOrganization(orgs[0].id);
      }
    }
  },

  /**
   * Get user's role in organization
   */
  async getUserRole(organizationId: string): Promise<string | null> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }

    const { data } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    return data?.role || null;
  },

  /**
   * Check if user has permission (Owner or Admin)
   */
  async canManageOrganization(organizationId: string): Promise<boolean> {
    const role = await this.getUserRole(organizationId);
    return role === 'Owner' || role === 'Admin';
  },

  /**
   * Validate organization data
   */
  validateOrganization(data: Partial<Organization>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Organization name is required';
    }

    if (data.type && data.type.trim().length === 0) {
      errors.type = 'Select an organization type';
    }

    if (data.industry && data.industry.trim().length === 0) {
      errors.industry = 'Industry is required';
    }

    if (data.website && !/^https?:\/\/.+/i.test(data.website)) {
      errors.website = 'Please enter a valid URL (https://example.org)';
    }

    if (data.address?.country && !data.address?.country.trim()) {
      errors.country = 'Select a country';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

export type OrganizationValidationResult = ReturnType<typeof organizationService.validateOrganization>;
