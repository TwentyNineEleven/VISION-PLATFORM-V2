/**
 * Spacing System
 * 
 * Based on Glow UI spacing scale: 4/8/12/16/24/32/48/64
 * Extended with intermediate values found in Glow UI components
 */

export const spacing = {
  none: '0px',
  xxs: '2px',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '10px',
  xl: '12px',
  xxl: '14px',
  '2xl': '16px',
  '3xl': '16px', // Alias for consistency
  '4xl': '18px',
  '5xl': '20px',
  '6xl': '24px',
  '7xl': '28px',
  '8xl': '32px',
  '9xl': '40px',
  '10xl': '40px', // Alias
  '12xl': '48px',
  '16xl': '64px',
} as const;

/**
 * Common spacing patterns
 */
export const spacingPatterns = {
  // Component internal padding
  inputPaddingX: spacing['3xl'], // 16px
  inputPaddingY: spacing.xxl, // 14px
  buttonPaddingX: spacing.xxl, // 14px
  buttonPaddingY: spacing.xl, // 12px
  cardPadding: spacing['3xl'], // 16px
  navItemHeight: '40px',
  navItemPaddingX: '10px',
  navItemPaddingY: '0px',
} as const;

export type SpacingToken = typeof spacing;

