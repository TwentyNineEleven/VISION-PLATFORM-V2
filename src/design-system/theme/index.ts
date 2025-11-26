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

export const theme = {
  colors,
  semanticColors,
  gradients,
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

