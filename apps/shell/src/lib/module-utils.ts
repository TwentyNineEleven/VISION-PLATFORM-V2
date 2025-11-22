import type { AppModuleKey } from '@/lib/vision-apps';
import { modulePalette } from '@/lib/vision-theme';

/**
 * Short labels for the six transformation modules.
 * Keeps UI labels consistent everywhere we reference a module.
 */
export const moduleShortLabel: Record<AppModuleKey, string> = {
  voice: 'Voice',
  inspire: 'Inspire',
  strategize: 'Strategize',
  initiate: 'Initiate',
  operate: 'Operate',
  narrate: 'Narrate',
};

/**
 * Helper to safely obtain the palette for a module.
 * Falls back to the Voice palette if an unknown key is provided.
 */
export function getModuleTheme(moduleKey?: AppModuleKey) {
  if (moduleKey && modulePalette[moduleKey]) {
    return modulePalette[moduleKey];
  }

  return modulePalette.voice;
}


