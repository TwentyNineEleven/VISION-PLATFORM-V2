/**
 * Border Radius System
 * 
 * Based on Glow UI radius values
 */

export const radius = {
  none: '0px',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '999px', // Pill shape
  round: '50%', // Circle
} as const;

export type RadiusToken = typeof radius;

