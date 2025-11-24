const APP_SETTINGS_KEY = 'vision_app_settings';

export interface AppSettings {
  [appId: string]: boolean;
}

export const appSettingsService = {
  async getAppSettings(): Promise<AppSettings> {
    if (typeof window === 'undefined') return {};

    const settings = localStorage.getItem(APP_SETTINGS_KEY);
    return settings ? JSON.parse(settings) : {};
  },

  async toggleApp(appId: string, enabled: boolean): Promise<void> {
    if (typeof window === 'undefined') throw new Error('Cannot toggle app on server');

    const settings = await this.getAppSettings();
    settings[appId] = enabled;
    localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
  },

  async initializeAppSettings(initialSettings: AppSettings): Promise<void> {
    if (typeof window === 'undefined') return;

    const existingSettings = await this.getAppSettings();
    if (Object.keys(existingSettings).length === 0) {
      localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(initialSettings));
    }
  },
};
