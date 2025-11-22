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

export const phaseColorMap: Record<Phase, string> = {
  VOICE: '#0F766E',       // teal (Vibrant Teal)
  INSPIRE: '#C2410C',     // orange (Vivid Tangerine)
  STRATEGIZE: '#16A34A',  // green (Bold Emerald)
  INITIATE: '#2563EB',    // blue (Electric Blue)
  OPERATE: '#7C3AED',     // purple (Bold Violet)
  NARRATE: '#DB2777',     // magenta (Vibrant Pink)
  FUNDER: '#6D28D9',      // purple (Rich Purple)
};

/**
 * Soft color (light tint) for each phase used for icon backgrounds and tags.
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
 * Get hover color (slightly darker) for a phase color
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
 * Returns a soft tint (semi-transparent) for buttons, tags, icons.
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
