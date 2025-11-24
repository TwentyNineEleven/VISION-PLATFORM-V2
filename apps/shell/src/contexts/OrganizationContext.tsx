'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { organizationService } from '@/services/organizationService';
import type { Organization } from '@/types/organization';
import type { TeamRole } from '@/types/team';

interface OrganizationContextType {
  // Current state
  activeOrganization: Organization | null;
  userOrganizations: Array<Organization & { role: string; lastAccessed?: string }>;
  currentRole: TeamRole | null;
  
  // Actions
  switchOrganization: (orgId: string) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
  createOrganization: (data: Partial<Organization>) => Promise<Organization>;
  updateOrganization: (orgId: string, data: Partial<Organization>) => Promise<Organization>;
  
  // Permission helpers
  canManageMembers: boolean;
  canEditOrganization: boolean;
  canInviteMembers: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  
  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [activeOrganization, setActiveOrganization] = useState<Organization | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<Array<Organization & { role: string; lastAccessed?: string }>>([]);
  const [currentRole, setCurrentRole] = useState<TeamRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load organizations on mount
  const loadOrganizations = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Load user's organizations
      const orgs = await organizationService.getUserOrganizations();
      setUserOrganizations(orgs);

      // Load active organization
      const active = await organizationService.getActiveOrganization();
      setActiveOrganization(active);

      // Get user's role in active organization
      if (active) {
        const role = await organizationService.getUserRole(active.id);
        setCurrentRole(role as TeamRole);
      } else {
        setCurrentRole(null);
      }
    } catch (err) {
      console.error('Error loading organizations:', err);
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to load organizations'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  // Switch to a different organization
  const switchOrganization = useCallback(async (orgId: string) => {
    try {
      await organizationService.setActiveOrganization(orgId);
      await loadOrganizations(); // Reload to get updated data
    } catch (err) {
      console.error('Error switching organization:', err);
      throw err;
    }
  }, [loadOrganizations]);

  // Refresh organizations list
  const refreshOrganizations = useCallback(async () => {
    await loadOrganizations();
  }, [loadOrganizations]);

  // Create a new organization
  const createOrganization = useCallback(async (data: Partial<Organization>) => {
    try {
      const newOrg = await organizationService.createOrganization(data);
      await loadOrganizations(); // Reload to include new org
      return newOrg;
    } catch (err) {
      console.error('Error creating organization:', err);
      throw err;
    }
  }, [loadOrganizations]);

  // Update organization
  const updateOrganization = useCallback(async (orgId: string, data: Partial<Organization>) => {
    try {
      const updated = await organizationService.updateOrganization(orgId, data);
      await loadOrganizations(); // Reload to get updated data
      return updated;
    } catch (err) {
      console.error('Error updating organization:', err);
      throw err;
    }
  }, [loadOrganizations]);

  // Permission helpers
  const isOwner = currentRole === 'Owner';
  const isAdmin = currentRole === 'Admin';
  const canManageMembers = isOwner || isAdmin;
  const canEditOrganization = isOwner || isAdmin;
  const canInviteMembers = isOwner || isAdmin;

  const value: OrganizationContextType = {
    // State
    activeOrganization,
    userOrganizations,
    currentRole,
    
    // Actions
    switchOrganization,
    refreshOrganizations,
    createOrganization,
    updateOrganization,
    
    // Permissions
    canManageMembers,
    canEditOrganization,
    canInviteMembers,
    isOwner,
    isAdmin,
    
    // Loading
    isLoading,
    isError,
    error,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

/**
 * Hook to use the OrganizationContext
 * Must be used within an OrganizationProvider
 */
export function useOrganization() {
  const context = useContext(OrganizationContext);
  
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  
  return context;
}

/**
 * HOC to wrap a component with OrganizationProvider
 */
export function withOrganization<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithOrganizationComponent(props: P) {
    return (
      <OrganizationProvider>
        <Component {...props} />
      </OrganizationProvider>
    );
  };
}
