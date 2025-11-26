'use client';

import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/types/supabase';
import type { Organization, OrganizationBrandColors } from '@/types/organization';

type DbOrganization = Tables<'organizations'>;
type DbOrganizationMember = Tables<'organization_members'>;
type MemberRole = DbOrganizationMember['role'];

const MEMBER_ROLES: MemberRole[] = ['owner', 'admin', 'editor', 'viewer'];

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
      primary: dbOrg.brand_primary_color ?? '',
      secondary: dbOrg.brand_secondary_color ?? '',
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
    // First get the memberships
    const { data: memberships, error: memberError } = await supabase
      .from('organization_members')
      .select('organization_id, role, last_accessed_at')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('last_accessed_at', { ascending: false, nullsFirst: false });

    if (memberError || !memberships || memberships.length === 0) {
      console.error('Error fetching memberships:', {
        error: memberError,
        message: memberError?.message,
        details: memberError?.details,
        hint: memberError?.hint,
        code: memberError?.code
      });
      return [];
    }

    // Then get the organizations
    const orgIds = memberships.map(m => m.organization_id);
    const { data: orgs, error } = await supabase
      .from('organizations')
      .select('*')
      .in('id', orgIds)
      .is('deleted_at', null);

    if (error || !orgs) {
      console.error('Error fetching organizations:', {
        error,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      return [];
    }

    // Combine memberships with organizations
    return orgs.map(org => {
      const membership = memberships.find(m => m.organization_id === org.id);
      return {
        ...dbToOrganization(org),
        role: membership?.role || 'Member',
        lastAccessed: membership?.last_accessed_at || undefined,
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
      .insert(dbData as any)
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
      .update(dbData as any)
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
  async getUserRole(organizationId: string, userId?: string): Promise<string | null> {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const targetUserId = userId ?? user?.id;
    if (!targetUserId) {
      return null;
    }

    const { data, error } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', targetUserId)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn('Failed to resolve user role', error);
    }

    return data?.role || null;
  },

  /**
   * Check if user has permission (Owner or Admin)
   */
  async canManageOrganization(organizationId: string): Promise<boolean> {
    const role = await this.getUserRole(organizationId);
    const normalized = role?.toLowerCase();
    return normalized === 'owner' || normalized === 'admin';
  },

  /**
   * Add a member to an organization
   */
  async addMember(
    organizationId: string,
    userId: string,
    role: MemberRole = 'viewer'
  ): Promise<void> {
    const supabase = createClient();

    if (!MEMBER_ROLES.includes(role)) {
      throw new Error('Invalid role value');
    }

    const { error } = await supabase.from('organization_members').insert({
      organization_id: organizationId,
      user_id: userId,
      role,
    });

    if (error) {
      const message = error.code === '23505' ? 'Member already exists' : error.message;
      throw new Error(message || 'Failed to add member');
    }
  },

  /**
   * Remove a member from an organization
   */
  async removeMember(organizationId: string, userId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('organization_id', organizationId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message || 'Failed to remove member');
    }
  },

  /**
   * Update an existing member role
   */
  async updateMemberRole(organizationId: string, userId: string, role: MemberRole): Promise<void> {
    const supabase = createClient();

    if (!MEMBER_ROLES.includes(role)) {
      throw new Error('Invalid role value');
    }

    const { error } = await supabase
      .from('organization_members')
      .update({ role })
      .eq('organization_id', organizationId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message || 'Failed to update member role');
    }
  },

  /**
   * Determine if a user is the owner of an organization
   */
  async isOwner(organizationId: string, userId?: string): Promise<boolean> {
    const role = await this.getUserRole(organizationId, userId);
    return role?.toLowerCase() === 'owner';
  },

  /**
   * Determine if a user has admin (or owner) privileges
   */
  async isAdmin(organizationId: string, userId?: string): Promise<boolean> {
    const role = await this.getUserRole(organizationId, userId);
    const normalized = role?.toLowerCase();
    return normalized === 'owner' || normalized === 'admin';
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
