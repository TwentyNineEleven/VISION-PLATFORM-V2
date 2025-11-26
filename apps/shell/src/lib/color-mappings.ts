/**
 * Color Mapping Utility for Bold Color System v3.0 Migration
 * 
 * This utility provides mappings from legacy hex codes and Tailwind classes
 * to the Bold Color System v3.0 vision-* tokens and semantic CSS variables.
 * 
 * @see documentation/platform/COLOR_REMEDIATION_COMPLETE_GUIDE.md
 */

export const COLOR_MAPPINGS = {
  // Brand Colors
  primary: {
    legacy: ['#0047AB', '#2563EB', 'bg-blue-600', 'text-blue-600'],
    token: 'primary',
    bgClass: 'bg-primary',
    textClass: 'text-primary',
    borderClass: 'border-primary'
  },
  secondary: {
    legacy: ['#047857', '#059669', 'bg-emerald-600', 'text-emerald-600', 'bg-green-600'],
    token: 'secondary',
    bgClass: 'bg-secondary',
    textClass: 'text-secondary',
    borderClass: 'border-secondary'
  },
  accent: {
    legacy: ['#C2410C', '#EA580C', 'bg-orange-600', 'text-orange-600'],
    token: 'accent',
    bgClass: 'bg-accent',
    textClass: 'text-accent',
    borderClass: 'border-accent'
  },
  destructive: {
    legacy: ['#B91C1C', '#DC2626', '#EF4444', 'bg-red-600', 'text-red-600'],
    token: 'destructive',
    bgClass: 'bg-destructive',
    textClass: 'text-destructive',
    borderClass: 'border-destructive'
  },
  
  // Vision Color System - Blues (INITIATE)
  visionBlue: {
    legacy: ['#0047AB', '#2563EB', '#3B82F6'],
    token: 'vision-blue',
    shades: {
      50: 'vision-blue-50',
      700: 'vision-blue-700',
      950: 'vision-blue-950'
    }
  },
  
  // Vision Color System - Greens (VOICE)
  visionGreen: {
    legacy: ['#047857', '#059669', '#10B981'],
    token: 'vision-green',
    shades: {
      50: 'vision-green-50',
      500: 'vision-green-500',
      600: 'vision-green-600',
      700: 'vision-green-700',
      900: 'vision-green-900'
    }
  },
  
  // Vision Color System - Oranges (INSPIRE)
  visionOrange: {
    legacy: ['#C2410C', '#EA580C', '#F97316'],
    token: 'vision-orange',
    shades: {
      50: 'vision-orange-50',
      800: 'vision-orange-800',
      900: 'vision-orange-900'
    }
  },
  
  // Vision Color System - Purples (NARRATE)
  visionPurple: {
    legacy: ['#6D28D9', '#7C3AED', '#8B5CF6'],
    token: 'vision-purple',
    shades: {
      50: 'vision-purple-50',
      600: 'vision-purple-600',
      700: 'vision-purple-700',
      900: 'vision-purple-900'
    }
  },
  
  // Vision Color System - Reds (Errors)
  visionRed: {
    legacy: ['#B91C1C', '#DC2626', '#EF4444'],
    token: 'vision-red',
    shades: {
      50: 'vision-red-50',
      700: 'vision-red-700',
      900: 'vision-red-900'
    }
  },
  
  // Neutral Colors - Grays
  visionGray: {
    legacy: ['#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B', '#475569', '#334155', '#1E293B', '#0F172A'],
    token: 'vision-gray',
    shades: {
      0: 'vision-gray-0',      // #FFFFFF
      50: 'vision-gray-50',    // #F8FAFC
      100: 'vision-gray-100',  // #F1F5F9
      700: 'vision-gray-700',  // #334155
      950: 'vision-gray-950'   // #0A0F1E
    }
  },
  
  // Semantic Tokens
  foreground: {
    legacy: ['#1F2937', '#111827', 'text-gray-900', 'text-gray-800'],
    token: 'foreground',
    bgClass: 'bg-foreground',
    textClass: 'text-foreground'
  },
  muted: {
    legacy: ['#64748B', '#6B7280', 'text-gray-500', 'text-gray-600', '#94A3B8', 'text-gray-400'],
    token: 'muted-foreground',
    bgClass: 'bg-muted',
    textClass: 'text-muted-foreground'
  },
  border: {
    legacy: ['#E2E8F0', '#D1D5DB', 'border-gray-200', 'border-gray-300', '#CBD5E1'],
    token: 'border',
    borderClass: 'border-border'
  },
  background: {
    legacy: ['#F8FAFC', '#F9FAFB', 'bg-gray-50'],
    token: 'background',
    bgClass: 'bg-background'
  },
  card: {
    legacy: ['#FFFFFF', 'bg-white'],
    token: 'card',
    bgClass: 'bg-card'
  }
} as const;

/**
 * Get the Bold Color System token name for a legacy hex color
 * @param hex - The hex color code (e.g., "#0047AB" or "#2563EB")
 * @returns The token category name or 'unknown'
 */
export const getLegacyColorName = (hex: string): string => {
  const normalizedHex = hex.toUpperCase();
  const entry = Object.entries(COLOR_MAPPINGS).find(([_, value]) => 
    value.legacy && value.legacy.some(legacy => 
      legacy.toUpperCase() === normalizedHex
    )
  );
  return entry ? entry[0] : 'unknown';
};

/**
 * Get the recommended replacement class for a legacy class name
 * @param legacyClass - The legacy Tailwind class (e.g., "text-gray-600")
 * @returns The recommended Bold Color System class or null
 */
export const getReplacementClass = (legacyClass: string): string | null => {
  for (const [_, value] of Object.entries(COLOR_MAPPINGS)) {
    if (value.legacy && value.legacy.includes(legacyClass as never)) {
      // Determine if it's a text, bg, or border class
      if (legacyClass.startsWith('text-') && 'textClass' in value) {
        return value.textClass || null;
      } else if (legacyClass.startsWith('bg-') && 'bgClass' in value) {
        return value.bgClass || null;
      } else if (legacyClass.startsWith('border-') && 'borderClass' in value) {
        return value.borderClass || null;
      }
    }
  }
  return null;
};

/**
 * Phase-specific color getters
 */
export const getPhaseColors = (phase: 'VOICE' | 'INSPIRE' | 'INITIATE' | 'NARRATE') => {
  const phaseMap = {
    VOICE: { bg: 'bg-vision-green-50', text: 'text-vision-green-700' },
    INSPIRE: { bg: 'bg-vision-orange-50', text: 'text-vision-orange-900' },
    INITIATE: { bg: 'bg-vision-blue-50', text: 'text-vision-blue-700' },
    NARRATE: { bg: 'bg-vision-purple-50', text: 'text-vision-purple-900' }
  };
  return phaseMap[phase];
};
