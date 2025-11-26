/**
 * App Installation Service
 *
 * Manages app installations for organizations including:
 * - Installing/uninstalling apps
 * - Getting installed apps
 * - Managing app settings
 * - Tracking app usage
 * - Managing user favorites
 *
 * NOTE: This service requires app_installations and app_favorites tables
 * which are planned but not yet created. All methods return stub data
 * until the database tables are implemented.
 */

'use client';

// ============================================================================
// TYPES
// ============================================================================

export interface AppInstallation {
  id: string;
  organizationId: string;
  appId: string;
  appName: string;
  status: 'active' | 'paused' | 'disabled' | 'trial';
  installedAt: string;
  installedBy: string | null;
  trialEndsAt: string | null;
  subscriptionTier: string | null;
  settings: Record<string, unknown>;
  featureFlags: Record<string, boolean>;
  lastAccessedAt: string | null;
  accessCount: number;
  metadata: Record<string, unknown>;
  updatedAt: string;
  updatedBy: string | null;
  uninstalledAt: string | null;
  uninstalledBy: string | null;
}

export interface AppFavorite {
  id: string;
  userId: string;
  appId: string;
  displayOrder: number;
  createdAt: string;
}

export interface InstallAppRequest {
  organizationId: string;
  appId: string;
  appName: string;
  settings?: Record<string, unknown>;
  featureFlags?: Record<string, boolean>;
}

export interface UpdateAppSettingsRequest {
  settings?: Record<string, unknown>;
  featureFlags?: Record<string, boolean>;
  status?: 'active' | 'paused' | 'disabled';
}

// ============================================================================
// STUB SERVICE (Tables not yet created)
// ============================================================================

export const appInstallationService = {
  /**
   * Get all installed apps for an organization
   * STUB: Returns empty array - database tables not yet created
   */
  async getInstalledApps(_organizationId: string): Promise<AppInstallation[]> {
    console.warn('appInstallationService.getInstalledApps: Tables not yet created');
    return [];
  },

  /**
   * Get a specific app installation
   * STUB: Returns null - database tables not yet created
   */
  async getInstallation(_organizationId: string, _appId: string): Promise<AppInstallation | null> {
    console.warn('appInstallationService.getInstallation: Tables not yet created');
    return null;
  },

  /**
   * Check if an app is installed
   * STUB: Returns false - database tables not yet created
   */
  async isAppInstalled(_organizationId: string, _appId: string): Promise<boolean> {
    return false;
  },

  /**
   * Install an app for an organization
   * STUB: Throws error - database tables not yet created
   */
  async installApp(_request: InstallAppRequest): Promise<AppInstallation> {
    throw new Error('App installation feature not yet available - database tables pending');
  },

  /**
   * Uninstall an app
   * STUB: No-op - database tables not yet created
   */
  async uninstallApp(_organizationId: string, _appId: string): Promise<void> {
    console.warn('appInstallationService.uninstallApp: Tables not yet created');
  },

  /**
   * Update app installation settings
   * STUB: Throws error - database tables not yet created
   */
  async updateInstallation(
    _organizationId: string,
    _appId: string,
    _request: UpdateAppSettingsRequest
  ): Promise<AppInstallation> {
    throw new Error('App settings feature not yet available - database tables pending');
  },

  /**
   * Record app access (for analytics)
   * STUB: No-op - database tables not yet created
   */
  async recordAccess(_organizationId: string, _appId: string): Promise<void> {
    // No-op until tables are created
  },

  /**
   * Get user's favorite apps
   * STUB: Returns empty array - database tables not yet created
   */
  async getFavorites(): Promise<AppFavorite[]> {
    return [];
  },

  /**
   * Add an app to favorites
   * STUB: Throws error - database tables not yet created
   */
  async addFavorite(_appId: string): Promise<AppFavorite> {
    throw new Error('Favorites feature not yet available - database tables pending');
  },

  /**
   * Remove an app from favorites
   * STUB: No-op - database tables not yet created
   */
  async removeFavorite(_appId: string): Promise<void> {
    console.warn('appInstallationService.removeFavorite: Tables not yet created');
  },

  /**
   * Check if an app is favorited
   * STUB: Returns false - database tables not yet created
   */
  async isFavorite(_appId: string): Promise<boolean> {
    return false;
  },

  /**
   * Reorder favorites
   * STUB: No-op - database tables not yet created
   */
  async reorderFavorites(_appIds: string[]): Promise<void> {
    console.warn('appInstallationService.reorderFavorites: Tables not yet created');
  },

  /**
   * Get recently accessed apps
   * STUB: Returns empty array - database tables not yet created
   */
  async getRecentlyAccessed(_organizationId: string, _limit: number = 5): Promise<AppInstallation[]> {
    return [];
  },

  /**
   * Get most used apps
   * STUB: Returns empty array - database tables not yet created
   */
  async getMostUsed(_organizationId: string, _limit: number = 5): Promise<AppInstallation[]> {
    return [];
  },
};

export default appInstallationService;
