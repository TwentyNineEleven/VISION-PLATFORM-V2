'use client';

import { createClient } from '@/lib/supabase/client';
import type { UserProfile, ProfileFormData } from '@/types/profile';

export const profileService = {
  /**
   * Get current user profile from Supabase
   */
  async getProfile(): Promise<UserProfile | null> {
    try {
      const supabase = createClient();

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return null;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*, user_preferences(*)')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Failed to fetch profile:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        displayName: data.name,
        avatar: data.avatar_url,
        preferences: data.user_preferences?.[0] || null,
        updatedAt: data.updated_at,
      } as UserProfile;
    } catch (err) {
      console.error('Failed to get profile from Supabase:', err);
      return null;
    }
  },

  /**
   * Update user profile in Supabase
   */
  async updateProfile(data: ProfileFormData): Promise<UserProfile> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        name: data.displayName,
        avatar_url: data.avatar,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to save profile to Supabase:', error);
      throw new Error('Failed to save profile');
    }

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      displayName: updatedUser.name,
      avatar: updatedUser.avatar_url,
      updatedAt: updatedUser.updated_at,
    } as UserProfile;
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
   * Update user preferences in Supabase
   */
  async updatePreferences(prefs: any): Promise<any> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        ...prefs,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  /**
   * Upload avatar to Supabase Storage
   */
  async uploadAvatar(file: File): Promise<string> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update user profile with new avatar URL
    await this.updateProfile({ avatar: data.publicUrl } as ProfileFormData);

    return data.publicUrl;
  },

  /**
   * Clear profile (sign out)
   */
  async clearProfile(): Promise<void> {
    // Profile is cleared automatically when user signs out via auth
    // This method is kept for API compatibility
  },
};
