import type { UserProfile, ProfileFormData } from '@/types/profile';

const PROFILE_STORAGE_KEY = 'vision_user_profile';

export const profileService = {
  /**
   * Get current user profile from localStorage
   */
  async getProfile(): Promise<UserProfile | null> {
    try {
      const profile = localStorage.getItem(PROFILE_STORAGE_KEY);
      return profile ? JSON.parse(profile) : null;
    } catch (err) {
      console.error('Failed to get profile from localStorage:', err);
      return null;
    }
  },

  /**
   * Update user profile in localStorage
   */
  async updateProfile(data: ProfileFormData): Promise<UserProfile> {
    const existingProfile = await this.getProfile();

    const updatedProfile: UserProfile = {
      id: existingProfile?.id || 'user_1',
      ...existingProfile,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      return updatedProfile;
    } catch (err) {
      console.error('Failed to save profile to localStorage:', err);
      throw new Error('Failed to save profile');
    }
  },

  /**
   * Validate profile data
   */
  validateProfile(data: ProfileFormData): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Display name validation
    if (!data.displayName || data.displayName.trim().length === 0) {
      errors.displayName = 'Display name is required';
    } else if (data.displayName.length < 2) {
      errors.displayName = 'Display name must be at least 2 characters';
    } else if (data.displayName.length > 100) {
      errors.displayName = 'Display name must be less than 100 characters';
    }

    // Email validation
    if (!data.email || data.email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional)
    if (data.phone && data.phone.trim().length > 0) {
      // Basic phone validation - allows various formats
      const phoneRegex = /^[\d\s\-+()]+$/;
      if (!phoneRegex.test(data.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }
    }

    // Title validation (optional)
    if (data.title && data.title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Clear profile from localStorage
   */
  async clearProfile(): Promise<void> {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear profile from localStorage:', err);
    }
  },
};
