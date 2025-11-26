/**
 * Phase Color Map
 * 
 * Central mapping from transformation phase to accent color.
 * Used consistently for:
 * - Phase tag background/text
 * - Icon circle background
 * - Launch button background
 * 
 * Uses 2911 Bold Color System colors.
 */

export type Phase =
  | 'VOICE'
  | 'INSPIRE'
  | 'STRATEGIZE'
  | 'INITIATE'
  | 'OPERATE'
  | 'NARRATE'
  | 'FUNDER';

/**
 * @deprecated Use getPhaseTokenClasses() instead.
 * Legacy hex color map kept for backwards compatibility ONLY.
 * All NEW components should use Bold Color System tokens via getPhaseTokenClasses().
 */
export const phaseColorMap: Record<Phase, string> = {
  VOICE: '#0F766E',       // DEPRECATED: Use vision-green-600
  INSPIRE: '#C2410C',     // DEPRECATED: Use vision-orange-900
  STRATEGIZE: '#16A34A',  // DEPRECATED: Use vision-green-500
  INITIATE: '#2563EB',    // DEPRECATED: Use vision-blue-700
  OPERATE: '#7C3AED',     // DEPRECATED: Use vision-purple-700
  NARRATE: '#DB2777',     // DEPRECATED: Use vision-purple-600
  FUNDER: '#6D28D9',      // DEPRECATED: Use vision-purple-900
};

/**
 * @deprecated Use getPhaseTokenClasses() instead.
 * Soft color (light tint) for each phase - backwards compatibility ONLY.
 */
export const phaseSoftColorMap: Record<Phase, string> = {
  VOICE: 'rgba(15, 118, 110, 0.12)',
  INSPIRE: 'rgba(194, 65, 12, 0.14)',
  STRATEGIZE: 'rgba(22, 163, 74, 0.12)',
  INITIATE: 'rgba(37, 99, 235, 0.14)',
  OPERATE: 'rgba(124, 58, 237, 0.12)',
  NARRATE: 'rgba(219, 39, 119, 0.14)',
  FUNDER: 'rgba(109, 40, 217, 0.14)',
};

/**
 * @deprecated Use getPhaseTokenClasses() instead.
 * Get hover color (slightly darker) - backwards compatibility ONLY.
 */
export function getPhaseHoverColor(phase: Phase): string {
  const hoverMap: Record<Phase, string> = {
    VOICE: '#0D5D56',
    INSPIRE: '#9A3412',
    STRATEGIZE: '#15803D',
    INITIATE: '#1E3A8A',
    OPERATE: '#6D28D9',
    NARRATE: '#BE185D',
    FUNDER: '#5B21B6',
  };
  return hoverMap[phase];
}

/**
 * @deprecated Use getPhaseTokenClasses() instead.
 * Returns a soft tint (semi-transparent) - backwards compatibility ONLY.
 */
export function getPhaseSoftColor(phase: Phase): string {
  return phaseSoftColorMap[phase];
}

/**
 * Get phase label for display
 */
export const phaseLabels: Record<Phase, string> = {
  VOICE: 'Voice of the Community',
  INSPIRE: 'Inspire Bold Ideas',
  STRATEGIZE: 'Strategize the Model',
  INITIATE: 'Initiate Action',
  OPERATE: 'Operate Systems',
  NARRATE: 'Narrate Impact',
  FUNDER: 'Tools for Grantmakers',
};

export interface PhaseTokenClasses {
  badgeBackground: string;
  badgeText: string;
  iconBackground: string;
  iconText: string;
  buttonBackground: string;
  buttonHover: string;
}

const phaseTokenClassMap: Record<Phase, PhaseTokenClasses> = {
  VOICE: {
    badgeBackground: 'bg-vision-green-50',
    badgeText: 'text-vision-green-600',
    iconBackground: 'bg-vision-green-50',
    iconText: 'text-vision-green-600',
    buttonBackground: 'bg-vision-green-600',
    buttonHover: 'hover:bg-vision-green-700',
  },
  INSPIRE: {
    badgeBackground: 'bg-vision-orange-50',
    badgeText: 'text-vision-orange-900',
    iconBackground: 'bg-vision-orange-50',
    iconText: 'text-vision-orange-900',
    buttonBackground: 'bg-vision-orange-900',
    buttonHover: 'hover:bg-vision-orange-800',
  },
  STRATEGIZE: {
    badgeBackground: 'bg-vision-green-50',
    badgeText: 'text-vision-green-500',
    iconBackground: 'bg-vision-green-50',
    iconText: 'text-vision-green-500',
    buttonBackground: 'bg-vision-green-500',
    buttonHover: 'hover:bg-vision-green-700',
  },
  INITIATE: {
    badgeBackground: 'bg-vision-blue-50',
    badgeText: 'text-vision-blue-700',
    iconBackground: 'bg-vision-blue-50',
    iconText: 'text-vision-blue-700',
    buttonBackground: 'bg-vision-blue-700',
    buttonHover: 'hover:bg-vision-blue-950',
  },
  OPERATE: {
    badgeBackground: 'bg-vision-purple-50',
    badgeText: 'text-vision-purple-700',
    iconBackground: 'bg-vision-purple-50',
    iconText: 'text-vision-purple-700',
    buttonBackground: 'bg-vision-purple-700',
    buttonHover: 'hover:bg-vision-purple-900',
  },
  NARRATE: {
    badgeBackground: 'bg-vision-purple-50',
    badgeText: 'text-vision-purple-600',
    iconBackground: 'bg-vision-purple-50',
    iconText: 'text-vision-purple-600',
    buttonBackground: 'bg-vision-purple-600',
    buttonHover: 'hover:bg-vision-purple-900',
  },
  FUNDER: {
    badgeBackground: 'bg-vision-purple-50',
    badgeText: 'text-vision-purple-900',
    iconBackground: 'bg-vision-purple-50',
    iconText: 'text-vision-purple-900',
    buttonBackground: 'bg-vision-purple-900',
    buttonHover: 'hover:bg-vision-purple-700',
  },
};

export function getPhaseTokenClasses(phase: Phase): PhaseTokenClasses {
  return phaseTokenClassMap[phase];
}

