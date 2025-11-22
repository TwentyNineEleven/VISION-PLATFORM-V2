/**
 * Theme System
 * 
 * Central export for all design tokens
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radius';
export * from './shadows';
export * from './breakpoints';
export * from './zIndex';
export * from './ThemeProvider';
export * from './tokens';
export * from './visionTheme';

/**
 * Complete theme object
 */
import { colors, semanticColors, gradients } from './colors';
import { typography, fontFamilies, fontSizes, fontWeights, lineHeights } from './typography';
import { spacing, spacingPatterns } from './spacing';
import { radius } from './radius';
import { shadows, elevation } from './shadows';
import { breakpoints, mediaQueries } from './breakpoints';
import { zIndex } from './zIndex';
import { moduleColors, moduleSoftColors, moduleGradients, modulePalette, supportingColors } from './tokens';

export const theme = {
  colors,
  semanticColors,
  gradients,
  moduleColors,
  moduleSoftColors,
  moduleGradients,
  modulePalette,
  supportingColors,
  typography,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  spacing,
  spacingPatterns,
  radius,
  shadows,
  elevation,
  breakpoints,
  mediaQueries,
  zIndex,
} as const;

export type Theme = typeof theme;
