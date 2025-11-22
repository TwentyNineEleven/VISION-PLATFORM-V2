/**
 * 2911 Brand Color System
 * 
 * These colors are the ONLY source of truth for colors in the design system.
 * All components must use these tokens - no hard-coded hex values.
 */

export const colors = {
  // Core Brand Colors
  deepBlue: '#002C55',
  emeraldGreen: '#2BAE66',
  vibrantOrange: '#F7931E',
  warmGray: '#6E7781',
  lightGray: '#E6E8EB',
  white: '#FFFFFF',

  // Extended Blue Shades
  blue: {
    light: '#EAF3FA',
    mid: '#0071BC',
    dark: '#002C55',
  },

  // Extended Green Shades
  green: {
    light: '#D9F2E4',
    mid: '#2BAE66',
    dark: '#1C7346',
  },

  // Extended Orange Shades
  orange: {
    light: '#FFE9D6',
    mid: '#F7931E',
    dark: '#C46C00',
  },

  // Extended Gray Shades
  gray: {
    light: '#F5F6F8',
    mid: '#6E7781',
    dark: '#2C2F33',
  },
} as const;

/**
 * Semantic color tokens mapped to 2911 brand colors
 * These provide semantic meaning while using brand colors
 */
export const semanticColors = {
  // Text Colors
  textPrimary: colors.deepBlue,
  textSecondary: colors.warmGray,
  textTertiary: colors.gray.mid,
  textInverse: colors.white,
  textBrand: colors.deepBlue,
  textSuccess: colors.emeraldGreen,
  textWarning: colors.vibrantOrange,
  textError: '#E54D2E', // Error red (derived from Glow UI pattern, but could be adjusted)
  textDanger: '#E54D2E',

  // Background Colors
  backgroundPage: colors.gray.light,
  backgroundSurface: colors.white,
  backgroundSurfaceSecondary: '#F9FAFB', // Subtle surface variant
  backgroundSurfaceTertiary: '#FAFBFC', // Even more subtle variant
  backgroundOverlay: 'rgba(0, 44, 85, 0.5)', // Deep Blue with opacity

  // State Backgrounds
  backgroundHover: 'rgba(0, 44, 85, 0.04)', // Brand color 4% opacity
  backgroundActive: 'rgba(0, 44, 85, 0.08)', // Brand color 8% opacity
  backgroundErrorLight: '#FEE2E2', // Error background (Glow UI pattern)
  backgroundWarningLight: colors.orange.light,
  backgroundSuccessLight: colors.green.light,
  backgroundInfoLight: colors.blue.light,

  // Fill Colors (for buttons, badges, etc.)
  fillPrimary: colors.deepBlue,
  fillAccent: colors.vibrantOrange,
  fillSuccess: colors.emeraldGreen,
  fillWarning: colors.vibrantOrange,
  fillError: '#E54D2E',
  fillNeutral: colors.warmGray,
  fillNeutralLight: colors.lightGray,

  // Border Colors
  borderPrimary: colors.lightGray,
  borderSecondary: '#D7DBDF', // Subtle border (from Glow UI)
  borderTertiary: '#EBEDEF', // Very subtle border
  borderSubtle: '#F0F1F3', // Very light borders
  borderStrong: colors.gray.mid, // Emphasized borders
  borderBrand: colors.deepBlue,
  borderBrandLight: '#ADBFF5', // Light brand border (from Glow UI)
  borderFocus: colors.deepBlue,
  borderError: '#E54D2E',

  // Focus Ring
  focusRing: colors.deepBlue,
} as const;

/**
 * Gradient definitions using 2911 brand colors
 */
export const gradients = {
  primary: 'linear-gradient(135deg, #002C55 0%, #2BAE66 50%, #F7931E 100%)',
  secondary: 'linear-gradient(180deg, #002C55 0%, #F7931E 100%)',
  blueToGreen: 'linear-gradient(135deg, #002C55 0%, #2BAE66 100%)',
  greenToOrange: 'linear-gradient(135deg, #2BAE66 0%, #F7931E 100%)',
} as const;

export type ColorToken = typeof colors;
export type SemanticColorToken = typeof semanticColors;
export type GradientToken = typeof gradients;

