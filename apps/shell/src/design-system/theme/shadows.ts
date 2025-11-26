/**
 * Shadow/Elevation System
 * 
 * Based on Glow UI elevation patterns
 */

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

/**
 * Semantic shadow tokens for common use cases
 */
export const elevation = {
  card: shadows.sm,
  dropdown: shadows.md,
  modal: shadows.xl,
  tooltip: shadows.md,
  popover: shadows.lg,
} as const;

/**
 * Focus shadow tokens for accessibility - Bold Color System
 */
export const focusShadow = {
  default: '0 0 0 2px #FFFFFF, 0 0 0 4px #0047AB', // White + Bold Royal Blue
  subtle: '0 0 0 3px rgba(0, 71, 171, 0.1)', // Subtle focus for inputs (Bold Royal Blue)
  error: '0 0 0 3px rgba(185, 28, 28, 0.2)', // Error focus (Electric Scarlet)
  success: '0 0 0 3px rgba(4, 120, 87, 0.2)', // Success focus (Vivid Forest Green)
  warning: '0 0 0 3px rgba(194, 65, 12, 0.2)', // Warning focus (Vivid Tangerine)
  premium: '0 0 0 3px rgba(109, 40, 217, 0.2)', // Premium focus (Rich Purple)
} as const;

export type ShadowToken = typeof shadows;
export type ElevationToken = typeof elevation;
export type FocusShadowToken = typeof focusShadow;

