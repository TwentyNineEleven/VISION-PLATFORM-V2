export interface PlatformSettings {
  branding: {
    tagline: string;
    accentColor: string;
    links: {
      website?: string;
      support?: string;
      documentation?: string;
    };
  };
  security: {
    require2FA: boolean;
    passwordPolicy: string;
    sessionTimeoutMinutes: number;
    deviceApprovals: boolean;
  };
  notifications: Array<{
    id: string;
    label: string;
    description: string;
    roles: string[];
    emailEnabled: boolean;
    inAppEnabled: boolean;
  }>;
  guardrails: {
    allowAIDrafts: boolean;
    autoRedactPII: boolean;
    retentionWindowDays: number;
    limitExternalSharing: boolean;
  };
}

const PLATFORM_SETTINGS_KEY = 'platform_settings';

export const platformSettingsService = {
  async getSettings(): Promise<PlatformSettings | null> {
    if (typeof window === 'undefined') return null;

    const settings = localStorage.getItem(PLATFORM_SETTINGS_KEY);
    if (!settings) return null;

    return JSON.parse(settings);
  },

  async saveSettings(settings: PlatformSettings): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot save settings on server');

    // Validate settings
    this.validateSettings(settings);

    localStorage.setItem(PLATFORM_SETTINGS_KEY, JSON.stringify(settings));
  },

  validateSettings(settings: PlatformSettings): void {
    // Validate session timeout
    if (settings.security.sessionTimeoutMinutes < 5) {
      throw new Error('Session timeout must be at least 5 minutes');
    }

    // Validate retention window
    if (settings.guardrails.retentionWindowDays < 30) {
      throw new Error('Data retention window must be at least 30 days');
    }

    // Validate accent color (basic hex validation)
    if (settings.branding.accentColor && !/^#[0-9A-Fa-f]{6}$/.test(settings.branding.accentColor)) {
      throw new Error('Accent color must be a valid hex color (e.g., #FF5733)');
    }

    // Validate URLs
    const urls = Object.values(settings.branding.links).filter((url): url is string => !!url);
    urls.forEach((url) => {
      try {
        new URL(url);
      } catch {
        throw new Error(`Invalid URL: ${url}`);
      }
    });
  },
};
