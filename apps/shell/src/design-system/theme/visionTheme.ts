/**
 * VISION Platform Design System - Bold & Dynamic Color System
 * Version 3.0 - Bold Edition
 *
 * ✅ WCAG 2.1 AA Compliant
 *
 * This is the SINGLE SOURCE OF TRUTH for all colors in the VISION Platform.
 * All components, CSS variables, and Tailwind config derive from these tokens.
 */

import { moduleColors, moduleGradients, moduleLabels, modulePalette, moduleSoftColors, type ModuleKey } from './tokens';

// ============================================================================
// BRAND COLORS - Bold Palette
// ============================================================================

export const visionColors = {
  // Primary Brand Colors (Enhanced Vibrancy)
  blue: '#0047AB',      // Bold Royal Blue (8.44:1 contrast)
  green: '#047857',     // Vivid Forest Green (5.48:1 contrast)
  orange: '#C2410C',    // Vivid Tangerine (5.18:1 contrast)
  purple: '#6D28D9',    // Rich Purple (7.10:1 contrast)
  red: '#B91C1C',       // Electric Scarlet (6.47:1 contrast)

  // Gray Scale (Neutrals, Structure)
  gray: {
    0: '#FFFFFF',       // Pure White
    50: '#F8FAFC',      // Mist - page backgrounds
    100: '#F1F5F9',     // Smoke - card backgrounds
    300: '#CBD5E1',     // Silver - borders, dividers
    500: '#94A3B8',     // Cool Gray - disabled text
    700: '#64748B',     // Steel Gray - body text, secondary (4.78:1)
    950: '#1F2937',     // Slate Gray - primary text, headings (15.79:1)
  },
} as const;

// ============================================================================
// COLOR SCALES - Complete Palettes
// ============================================================================

export const visionScales = {
  // Blue Scale (Trust, Technology)
  blue: {
    50: '#EFF6FF',      // Ice Blue - subtle backgrounds
    100: '#DBEAFE',     // Sky Light - light backgrounds
    500: '#3B82F6',     // Bright Cobalt - backgrounds only
    700: '#2563EB',     // Electric Blue - links, interactive (4.91:1)
    900: '#1E3A8A',     // Deep Navy - dark headers, navigation (11.68:1)
    950: '#0047AB',     // Bold Royal Blue - PRIMARY (8.44:1)
  },

  // Green Scale (Growth, Success)
  green: {
    50: '#F0FDFA',      // Ice Mint - subtle success states
    100: '#CCFBF1',     // Mint Light - success backgrounds
    500: '#14B8A6',     // Bright Jade - backgrounds only
    600: '#0F766E',     // Vibrant Teal - borders, accents (5.47:1)
    700: '#059669',     // Bold Emerald - backgrounds, large text
    900: '#047857',     // Vivid Forest Green - SUCCESS (5.48:1)
    950: '#065F46',     // Darker Forest - hover states
  },

  // Orange Scale (Energy, Action)
  orange: {
    50: '#FFF7ED',      // Cream - subtle warning states
    100: '#FFEDD5',     // Peach Light - warning backgrounds
    500: '#F97316',     // Electric Amber - backgrounds only
    600: '#EA580C',     // Bright Orange - backgrounds, large text
    800: '#9A3412',     // Deep Pumpkin - dark warning text (7.83:1)
    900: '#C2410C',     // Vivid Tangerine - WARNING (5.18:1)
  },

  // Purple Scale (Innovation, Premium)
  purple: {
    50: '#F5F3FF',      // Lilac Mist - subtle accents
    100: '#EDE9FE',     // Lavender Light - light backgrounds
    600: '#8B5CF6',     // Bright Amethyst - large text only
    700: '#7C3AED',     // Bold Violet - interactive purple (5.70:1)
    800: '#5B21B6',     // Deep Orchid - dark purple text (8.98:1)
    900: '#6D28D9',     // Rich Purple - PREMIUM (7.10:1)
  },

  // Red Scale (Urgency, Errors)
  red: {
    50: '#FEF2F2',      // Blush - subtle error states
    100: '#FEE2E2',     // Rose Light - error backgrounds
    600: '#EF4444',     // Vibrant Red - large text only
    700: '#DC2626',     // Bold Crimson - interactive red (4.83:1)
    800: '#991B1B',     // Deep Ruby - dark error text (8.31:1)
    900: '#B91C1C',     // Electric Scarlet - ERROR (6.47:1)
  },
} as const;

// ============================================================================
// SEMANTIC TOKENS - Meaningful Color Assignments
// ============================================================================

export const visionSemantic = {
  // Primary Semantic Colors
  primary: visionColors.blue,           // #0047AB - Bold Royal Blue
  success: visionColors.green,          // #047857 - Vivid Forest Green
  warning: visionColors.orange,         // #C2410C - Vivid Tangerine
  error: visionColors.red,              // #B91C1C - Electric Scarlet
  info: visionScales.blue[700],         // #2563EB - Electric Blue
  premium: visionColors.purple,         // #6D28D9 - Rich Purple

  // Text Colors (High Contrast)
  text: {
    primary: visionColors.gray[950],    // #1F2937 - Slate Gray (15.79:1)
    secondary: visionColors.gray[700],  // #64748B - Steel Gray (4.78:1)
    tertiary: visionColors.gray[500],   // #94A3B8 - Cool Gray (2.94:1)
    inverse: visionColors.gray[0],      // #FFFFFF - White
    brand: visionColors.blue,           // #0047AB - Bold Royal Blue
  },

  // Background Colors
  bg: {
    primary: visionColors.gray[0],      // #FFFFFF - Pure White
    secondary: visionColors.gray[50],   // #F8FAFC - Mist
    tertiary: visionColors.gray[100],   // #F1F5F9 - Smoke
    overlay: 'rgba(31, 41, 55, 0.5)',   // Slate Gray with opacity
  },

  // Border Colors
  border: {
    primary: visionColors.gray[300],    // #CBD5E1 - Silver
    secondary: '#D7DBDF',               // Subtle border
    tertiary: '#EBEDEF',                // Very subtle border
    subtle: '#F0F1F3',                  // Very light borders
    strong: visionColors.gray[700],     // #64748B - Steel Gray
    brand: visionColors.blue,           // #0047AB - Bold Royal Blue
    focus: visionColors.blue,           // #0047AB - Bold Royal Blue
  },

  // State Colors with Backgrounds and Borders
  states: {
    success: {
      text: visionColors.green,         // #047857
      bg: visionScales.green[100],      // #CCFBF1 - Mint Light
      border: visionScales.green[500],  // #14B8A6 - Bright Jade
    },
    warning: {
      text: visionColors.orange,        // #C2410C
      bg: visionScales.orange[100],     // #FFEDD5 - Peach Light
      border: visionScales.orange[600], // #EA580C - Bright Orange
    },
    error: {
      text: visionColors.red,           // #B91C1C
      bg: visionScales.red[100],        // #FEE2E2 - Rose Light
      border: visionScales.red[600],    // #EF4444 - Vibrant Red
    },
    info: {
      text: visionScales.blue[700],     // #2563EB
      bg: visionScales.blue[100],       // #DBEAFE - Sky Light
      border: visionScales.blue[500],   // #3B82F6 - Bright Cobalt
    },
  },

  // Interactive States (Hover/Focus)
  hover: {
    blue: visionScales.blue[900],       // #1E3A8A - Deep Navy
    green: visionScales.green[950],     // #065F46 - Darker Forest
    orange: visionScales.orange[800],   // #9A3412 - Deep Pumpkin
    red: visionScales.red[800],         // #991B1B - Deep Ruby
    purple: visionScales.purple[800],   // #5B21B6 - Deep Orchid
  },
} as const;

// ============================================================================
// GRADIENTS - Monochromatic (Single Color, Dark to Light or Light to Dark)
// ============================================================================

export const visionGradients = {
  // Blue Gradients (Trust, Technology) - Dark to Light
  bluePrimary: 'linear-gradient(135deg, #1E3A8A 0%, #0047AB 50%, #2563EB 100%)',     // Deep Navy → Bold Royal → Electric Blue
  blueSubtle: 'linear-gradient(135deg, #0047AB 0%, #2563EB 50%, #3B82F6 100%)',      // Bold Royal → Electric → Bright Cobalt
  blueLight: 'linear-gradient(135deg, #3B82F6 0%, #DBEAFE 50%, #EFF6FF 100%)',       // Bright Cobalt → Sky Light → Ice Blue
  blueReverse: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #2563EB 100%)',     // Ice Blue → Sky Light → Electric Blue

  // Green Gradients (Growth, Success) - Dark to Light
  greenPrimary: 'linear-gradient(135deg, #065F46 0%, #047857 50%, #059669 100%)',    // Darker Forest → Vivid Forest → Bold Emerald
  greenSubtle: 'linear-gradient(135deg, #047857 0%, #0F766E 50%, #14B8A6 100%)',     // Vivid Forest → Vibrant Teal → Bright Jade
  greenLight: 'linear-gradient(135deg, #14B8A6 0%, #CCFBF1 50%, #F0FDFA 100%)',      // Bright Jade → Mint Light → Ice Mint
  greenReverse: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 50%, #14B8A6 100%)',    // Ice Mint → Mint Light → Bright Jade

  // Orange Gradients (Energy, Action) - Dark to Light
  orangePrimary: 'linear-gradient(135deg, #9A3412 0%, #C2410C 50%, #EA580C 100%)',   // Deep Pumpkin → Vivid Tangerine → Bright Orange
  orangeSubtle: 'linear-gradient(135deg, #C2410C 0%, #EA580C 50%, #F97316 100%)',    // Vivid Tangerine → Bright Orange → Electric Amber
  orangeLight: 'linear-gradient(135deg, #F97316 0%, #FFEDD5 50%, #FFF7ED 100%)',     // Electric Amber → Peach Light → Cream
  orangeReverse: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #EA580C 100%)',   // Cream → Peach Light → Bright Orange

  // Purple Gradients (Innovation, Premium) - Dark to Light
  purplePrimary: 'linear-gradient(135deg, #5B21B6 0%, #6D28D9 50%, #7C3AED 100%)',   // Deep Orchid → Rich Purple → Bold Violet
  purpleSubtle: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #8B5CF6 100%)',    // Rich Purple → Bold Violet → Bright Amethyst
  purpleLight: 'linear-gradient(135deg, #8B5CF6 0%, #EDE9FE 50%, #F5F3FF 100%)',     // Bright Amethyst → Lavender Light → Lilac Mist
  purpleReverse: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #7C3AED 100%)',   // Lilac Mist → Lavender Light → Bold Violet

  // Red Gradients (Urgency, Errors) - Dark to Light
  redPrimary: 'linear-gradient(135deg, #991B1B 0%, #B91C1C 50%, #DC2626 100%)',      // Deep Ruby → Electric Scarlet → Bold Crimson
  redSubtle: 'linear-gradient(135deg, #B91C1C 0%, #DC2626 50%, #EF4444 100%)',       // Electric Scarlet → Bold Crimson → Vibrant Red
  redLight: 'linear-gradient(135deg, #EF4444 0%, #FEE2E2 50%, #FEF2F2 100%)',        // Vibrant Red → Rose Light → Blush
  redReverse: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 50%, #DC2626 100%)',      // Blush → Rose Light → Bold Crimson

  // Gray Gradients (Neutral, Structure) - Dark to Light
  grayPrimary: 'linear-gradient(135deg, #1F2937 0%, #64748B 50%, #94A3B8 100%)',     // Slate Gray → Steel Gray → Cool Gray
  graySubtle: 'linear-gradient(135deg, #64748B 0%, #94A3B8 50%, #CBD5E1 100%)',      // Steel Gray → Cool Gray → Silver
  grayLight: 'linear-gradient(135deg, #CBD5E1 0%, #F1F5F9 50%, #F8FAFC 100%)',       // Silver → Smoke → Mist
  grayReverse: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #CBD5E1 100%)',     // Mist → Smoke → Silver

  // Semantic Shortcuts (most commonly used)
  primary: 'linear-gradient(135deg, #1E3A8A 0%, #0047AB 50%, #2563EB 100%)',         // Blue: Deep Navy → Bold Royal → Electric
  success: 'linear-gradient(135deg, #065F46 0%, #047857 50%, #059669 100%)',         // Green: Darker Forest → Vivid Forest → Bold Emerald
  warning: 'linear-gradient(135deg, #9A3412 0%, #C2410C 50%, #EA580C 100%)',         // Orange: Deep Pumpkin → Vivid Tangerine → Bright Orange
  error: 'linear-gradient(135deg, #991B1B 0%, #B91C1C 50%, #DC2626 100%)',           // Red: Deep Ruby → Electric Scarlet → Bold Crimson
  premium: 'linear-gradient(135deg, #5B21B6 0%, #6D28D9 50%, #7C3AED 100%)',         // Purple: Deep Orchid → Rich Purple → Bold Violet
} as const;

// ============================================================================
// BUTTON STYLES - Bold & Accessible
// ============================================================================

export const visionButtonStyles = {
  primary: {
    bg: visionColors.blue,              // #0047AB
    bgHover: visionScales.blue[900],    // #1E3A8A
    text: visionColors.gray[0],         // #FFFFFF
    contrast: '8.44:1',
  },
  success: {
    bg: visionColors.green,             // #047857
    bgHover: visionScales.green[950],   // #065F46
    text: visionColors.gray[0],         // #FFFFFF
    contrast: '5.48:1',
  },
  warning: {
    bg: visionColors.orange,            // #C2410C
    bgHover: visionScales.orange[800],  // #9A3412
    text: visionColors.gray[0],         // #FFFFFF
    contrast: '5.18:1',
  },
  error: {
    bg: visionColors.red,               // #B91C1C
    bgHover: visionScales.red[800],     // #991B1B
    text: visionColors.gray[0],         // #FFFFFF
    contrast: '6.47:1',
  },
  premium: {
    bg: visionColors.purple,            // #6D28D9
    bgHover: visionScales.purple[800],  // #5B21B6
    text: visionColors.gray[0],         // #FFFFFF
    contrast: '7.10:1',
  },
} as const;

// ============================================================================
// EXPORTS - Theme Object
// ============================================================================

export const boldTheme = {
  colors: visionColors,
  scales: visionScales,
  semantic: visionSemantic,
  gradients: visionGradients,
  buttons: visionButtonStyles,

  // Metadata
  version: '3.0',
  edition: 'Bold',
  wcagCompliance: 'AA',
} as const;

// Type exports
export type VisionColors = typeof visionColors;
export type VisionScales = typeof visionScales;
export type VisionSemantic = typeof visionSemantic;
export type VisionGradients = typeof visionGradients;
export type BoldTheme = typeof boldTheme;

// Module tokens (authoritative VISION Bold color system)
export { moduleColors, moduleSoftColors, moduleGradients, modulePalette, moduleLabels, type ModuleKey } from './tokens';
