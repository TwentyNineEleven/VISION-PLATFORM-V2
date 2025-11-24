'use client';

import type { Organization, OrganizationBrandColors } from '@/types/organization';
import { mockOrganizationSettings } from '@/lib/mock-data';

export const ORGANIZATION_STORAGE_KEY = 'vision.platform.organization';
const STORAGE_KEY = ORGANIZATION_STORAGE_KEY;
const DEFAULT_BRAND_COLORS: OrganizationBrandColors = {
  primary: mockOrganizationSettings.brandColors?.primary ?? '#2563eb',
  secondary: mockOrganizationSettings.brandColors?.secondary ?? '#9333ea',
};

const hasBrowserStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const sanitizeOrganization = (data: Partial<Organization>): Organization => {
  const fallback = mockOrganizationSettings;
  const fallbackBrandColors = fallback.brandColors ?? DEFAULT_BRAND_COLORS;
  const sourceBrandColors = data.brandColors ?? fallbackBrandColors;

  return {
    ...fallback,
    ...data,
    id: data.id || 'org_default',
    address: {
      ...fallback.address,
      ...data.address,
    },
    brandColors: {
      primary: sourceBrandColors.primary ?? fallbackBrandColors.primary,
      secondary: sourceBrandColors.secondary ?? fallbackBrandColors.secondary,
    },
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
};

export const organizationService = {
  async getOrganization(): Promise<Organization | null> {
    if (!hasBrowserStorage()) {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as Organization;
      return sanitizeOrganization(parsed);
    } catch (error) {
      console.warn('organizationService.getOrganization: failed to parse saved data', error);
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  async updateOrganization(data: Partial<Organization>): Promise<Organization> {
    const existing = (await this.getOrganization()) ?? mockOrganizationSettings;
    const mergedBrandColors: OrganizationBrandColors = {
      primary: data.brandColors?.primary ?? existing.brandColors?.primary ?? DEFAULT_BRAND_COLORS.primary,
      secondary: data.brandColors?.secondary ?? existing.brandColors?.secondary ?? DEFAULT_BRAND_COLORS.secondary,
    };

    const updated = sanitizeOrganization({
      ...existing,
      ...data,
      address: {
        ...existing.address,
        ...data.address,
      },
      brandColors: mergedBrandColors,
      updatedAt: new Date().toISOString(),
    });

    if (hasBrowserStorage()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    return updated;
  },

  validateOrganization(data: Partial<Organization>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Organization name is required';
    }

    if (!data.type || data.type.trim().length === 0) {
      errors.type = 'Select an organization type';
    }

    if (!data.industry || data.industry.trim().length === 0) {
      errors.industry = 'Industry is required';
    }

    if (data.website && !/^https?:\/\/.+/i.test(data.website)) {
      errors.website = 'Please enter a valid URL (https://example.org)';
    }

    if (!data.address?.country) {
      errors.country = 'Select a country';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

export type OrganizationValidationResult = ReturnType<typeof organizationService.validateOrganization>;

