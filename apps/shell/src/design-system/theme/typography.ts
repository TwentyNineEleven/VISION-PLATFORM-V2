/**
 * Typography System
 * 
 * Based on Glow UI typography scale, using 2911 brand fonts:
 * - Headings: Poppins (Bold / SemiBold)
 * - Body: Open Sans (Regular)
 */

export const fontFamilies = {
  heading: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'Fira Code', 'Courier New', monospace",
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const fontSizes = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
} as const;

export const lineHeights = {
  xs: '18px',
  sm: '20px',
  md: '24px',
  lg: '28px',
  xl: '32px',
  '2xl': '36px',
  '3xl': '40px',
  '4xl': '48px',
  '5xl': '56px',
} as const;

export const letterSpacing = {
  normal: '0px',
  tight: '-0.5px',
  wide: '0.5px',
} as const;

/**
 * Typography scale tokens matching Glow UI patterns
 */
export const typography = {
  h1: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes['3xl'],
    lineHeight: lineHeights['3xl'],
    letterSpacing: letterSpacing.normal,
    color: 'var(--color-text-primary)',
  },
  h2: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights['2xl'],
    letterSpacing: letterSpacing.normal,
    color: 'var(--color-text-primary)',
  },
  h3: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    letterSpacing: letterSpacing.normal,
    color: 'var(--color-text-primary)',
  },
  h4: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    letterSpacing: letterSpacing.normal,
    color: 'var(--color-text-primary)',
  },
  body: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    letterSpacing: letterSpacing.normal,
    color: 'var(--color-text-primary)',
  },
  bodySm: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    letterSpacing: letterSpacing.normal,
    color: 'var(--color-text-primary)',
  },
  label: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    letterSpacing: letterSpacing.normal,
    color: 'var(--color-text-secondary)',
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    letterSpacing: letterSpacing.normal,
    color: 'var(--color-text-tertiary)',
  },
} as const;

export type TypographyToken = typeof typography;

