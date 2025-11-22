/**
 * VISION Bold Color System - Module Tokens
 *
 * Authoritative brand colors for the six transformation modules.
 * Import these anywhere you need semantic module colors:
 *
 * import { moduleColors, modulePalette, ModuleKey } from '@/design-system/theme/tokens';
 */

export type ModuleKey = 'voice' | 'inspire' | 'strategize' | 'initiate' | 'operate' | 'narrate';

export const moduleLabels: Record<ModuleKey, string> = {
  voice: 'Voice of the Community',
  inspire: 'Inspire Bold Ideas',
  strategize: 'Strategize the Model',
  initiate: 'Initiate Action',
  operate: 'Operate Systems',
  narrate: 'Narrate Impact',
};

export const moduleColors: Record<ModuleKey, `#${string}`> = {
  voice: '#173B5C', // Deep Blue
  inspire: '#F7931E', // Orange
  strategize: '#00966C', // Strategy Green
  initiate: '#2BAAE1', // Teal
  operate: '#6A1B9A', // Purple
  narrate: '#E63946', // Impact Red
} as const;

export const moduleSoftColors: Record<ModuleKey, string> = {
  voice: 'rgba(23, 59, 92, 0.12)',
  inspire: 'rgba(247, 147, 30, 0.14)',
  strategize: 'rgba(0, 150, 108, 0.12)',
  initiate: 'rgba(43, 170, 225, 0.14)',
  operate: 'rgba(106, 27, 154, 0.12)',
  narrate: 'rgba(230, 57, 70, 0.14)',
};

export const moduleGradients: Record<ModuleKey, string> = {
  voice: 'linear-gradient(135deg, #173B5C 0%, #1F4D78 50%, #0E2437 100%)',
  inspire: 'linear-gradient(135deg, #F7931E 0%, #F2631E 50%, #F9B13D 100%)',
  strategize: 'linear-gradient(135deg, #00966C 0%, #0CA77A 45%, #4BC59D 100%)',
  initiate: 'linear-gradient(135deg, #2BAAE1 0%, #1988C5 45%, #6CC6F0 100%)',
  operate: 'linear-gradient(135deg, #6A1B9A 0%, #7E39AF 45%, #9B6BC7 100%)',
  narrate: 'linear-gradient(135deg, #E63946 0%, #C62834 45%, #F17A83 100%)',
};

export const modulePalette: Record<
  ModuleKey,
  { label: string; solid: string; soft: string; gradient: string }
> = {
  voice: { label: moduleLabels.voice, solid: moduleColors.voice, soft: moduleSoftColors.voice, gradient: moduleGradients.voice },
  inspire: { label: moduleLabels.inspire, solid: moduleColors.inspire, soft: moduleSoftColors.inspire, gradient: moduleGradients.inspire },
  strategize: { label: moduleLabels.strategize, solid: moduleColors.strategize, soft: moduleSoftColors.strategize, gradient: moduleGradients.strategize },
  initiate: { label: moduleLabels.initiate, solid: moduleColors.initiate, soft: moduleSoftColors.initiate, gradient: moduleGradients.initiate },
  operate: { label: moduleLabels.operate, solid: moduleColors.operate, soft: moduleSoftColors.operate, gradient: moduleGradients.operate },
  narrate: { label: moduleLabels.narrate, solid: moduleColors.narrate, soft: moduleSoftColors.narrate, gradient: moduleGradients.narrate },
};

export const supportingColors = {
  forest: '#00563F',
  white: '#FFFFFF',
  charcoal: '#2D2D2D',
  darkGray: '#4A4A4A',
} as const;
