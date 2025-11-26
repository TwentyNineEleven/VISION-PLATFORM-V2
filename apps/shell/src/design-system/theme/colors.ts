/**
 * VISION Platform Bold Color System
 * Version 3.0 - Bold Edition
 *
 * ⚠️ DEPRECATED: This file is maintained for backwards compatibility only.
 *
 * Please import from visionTheme.ts instead:
 * import { visionColors, visionSemantic, boldTheme } from './visionTheme';
 *
 * These colors are mapped to the new Bold Color System.
 */

import { visionColors, visionScales, visionSemantic } from './visionTheme';

// Legacy color mappings to new Bold Color System
export const colors = {
  // Core Brand Colors (mapped to Bold palette)
  deepBlue: visionColors.blue,           // #002C55 → #0047AB (Bold Royal Blue)
  emeraldGreen: visionColors.green,      // #2BAE66 → #047857 (Vivid Forest Green)
  vibrantOrange: visionColors.orange,    // #F7931E → #C2410C (Vivid Tangerine)
  warmGray: visionColors.gray[700],      // #6E7781 → #64748B (Steel Gray)
  lightGray: visionColors.gray[300],     // #E6E8EB → #CBD5E1 (Silver)
  white: visionColors.gray[0],           // #FFFFFF

  // Extended Blue Shades
  blue: {
    light: visionScales.blue[100],       // #EAF3FA → #DBEAFE (Sky Light)
    mid: visionScales.blue[700],         // #0071BC → #2563EB (Electric Blue)
    dark: visionScales.blue[950],        // #002C55 → #0047AB (Bold Royal Blue)
  },

  // Extended Green Shades
  green: {
    light: visionScales.green[100],      // #D9F2E4 → #CCFBF1 (Mint Light)
    mid: visionScales.green[700],        // #2BAE66 → #059669 (Bold Emerald)
    dark: visionScales.green[900],       // #1C7346 → #047857 (Vivid Forest Green)
  },

  // Extended Orange Shades
  orange: {
    light: visionScales.orange[100],     // #FFE9D6 → #FFEDD5 (Peach Light)
    mid: visionScales.orange[600],       // #F7931E → #EA580C (Bright Orange)
    dark: visionScales.orange[900],      // #C46C00 → #C2410C (Vivid Tangerine)
  },

  // Extended Gray Shades
  gray: {
    light: visionColors.gray[100],       // #F5F6F8 → #F1F5F9 (Smoke)
    mid: visionColors.gray[700],         // #6E7781 → #64748B (Steel Gray)
    dark: visionColors.gray[950],        // #2C2F33 → #1F2937 (Slate Gray)
  },
} as const;

/**
 * Semantic color tokens - NOW USING BOLD COLOR SYSTEM
 * ⚠️ DEPRECATED: Import visionSemantic from visionTheme.ts instead
 */
export const semanticColors = {
  // Text Colors
  textPrimary: visionSemantic.text.primary,      // #1F2937 (Slate Gray)
  textSecondary: visionSemantic.text.secondary,  // #64748B (Steel Gray)
  textTertiary: visionSemantic.text.tertiary,    // #94A3B8 (Cool Gray)
  textInverse: visionSemantic.text.inverse,      // #FFFFFF
  textBrand: visionSemantic.text.brand,          // #0047AB (Bold Royal Blue)
  textSuccess: visionSemantic.success,           // #047857 (Vivid Forest Green)
  textWarning: visionSemantic.warning,           // #C2410C (Vivid Tangerine)
  textError: visionSemantic.error,               // #B91C1C (Electric Scarlet)
  textDanger: visionSemantic.error,              // #B91C1C (Electric Scarlet)

  // Background Colors
  backgroundPage: visionSemantic.bg.secondary,          // #F8FAFC (Mist)
  backgroundSurface: visionSemantic.bg.primary,         // #FFFFFF
  backgroundSurfaceSecondary: visionSemantic.bg.secondary,  // #F8FAFC
  backgroundSurfaceTertiary: visionSemantic.bg.tertiary,    // #F1F5F9 (Smoke)
  backgroundOverlay: visionSemantic.bg.overlay,         // rgba(31, 41, 55, 0.5)

  // State Backgrounds
  backgroundHover: 'rgba(0, 71, 171, 0.04)',            // Bold Royal Blue 4% opacity
  backgroundActive: 'rgba(0, 71, 171, 0.08)',           // Bold Royal Blue 8% opacity
  backgroundErrorLight: visionSemantic.states.error.bg,     // #FEE2E2
  backgroundWarningLight: visionSemantic.states.warning.bg, // #FFEDD5
  backgroundSuccessLight: visionSemantic.states.success.bg, // #CCFBF1
  backgroundInfoLight: visionSemantic.states.info.bg,       // #DBEAFE

  // Fill Colors (for buttons, badges, etc.)
  fillPrimary: visionSemantic.primary,      // #0047AB (Bold Royal Blue)
  fillAccent: visionSemantic.warning,       // #C2410C (Vivid Tangerine)
  fillSuccess: visionSemantic.success,      // #047857 (Vivid Forest Green)
  fillWarning: visionSemantic.warning,      // #C2410C (Vivid Tangerine)
  fillError: visionSemantic.error,          // #B91C1C (Electric Scarlet)
  fillNeutral: visionColors.gray[700],      // #64748B (Steel Gray)
  fillNeutralLight: visionColors.gray[300], // #CBD5E1 (Silver)

  // Border Colors
  borderPrimary: visionSemantic.border.primary,      // #CBD5E1 (Silver)
  borderSecondary: visionSemantic.border.secondary,  // #D7DBDF
  borderTertiary: visionSemantic.border.tertiary,    // #EBEDEF
  borderSubtle: visionSemantic.border.subtle,        // #F0F1F3
  borderStrong: visionSemantic.border.strong,        // #64748B (Steel Gray)
  borderBrand: visionSemantic.border.brand,          // #0047AB (Bold Royal Blue)
  borderBrandLight: visionScales.blue[100],          // #DBEAFE (Sky Light)
  borderFocus: visionSemantic.border.focus,          // #0047AB (Bold Royal Blue)
  borderError: visionSemantic.states.error.border,   // #EF4444

  // Focus Ring
  focusRing: visionSemantic.primary,                 // #0047AB (Bold Royal Blue)
} as const;

/**
 * Gradient definitions - NOW USING BOLD MONOCHROMATIC GRADIENTS
 * ⚠️ DEPRECATED: Import visionGradients from visionTheme.ts instead
 */
export const gradients = {
  primary: visionSemantic.primary,        // Use solid color or import visionGradients.primary
  secondary: visionSemantic.success,      // Use solid color or import visionGradients.success
  blueToGreen: visionSemantic.primary,    // Use visionGradients.bluePrimary instead
  greenToOrange: visionSemantic.success,  // Use visionGradients.greenPrimary instead
} as const;

export type ColorToken = typeof colors;
export type SemanticColorToken = typeof semanticColors;
export type GradientToken = typeof gradients;

