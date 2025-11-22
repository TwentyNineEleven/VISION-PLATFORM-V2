/**
 * Glow UI Effect System - Bold Color System v3.0
 *
 * Defines glow effects, shadows, and lighting for the VISION Platform
 * Updated to use Bold & Dynamic Color System
 */

import { visionColors } from './visionTheme';

/**
 * Glow intensity levels
 */
export const glowIntensity = {
  subtle: {
    blur: '8px',
    spread: '1px',
    opacity: 0.15,
  },
  medium: {
    blur: '16px',
    spread: '2px',
    opacity: 0.25,
  },
  strong: {
    blur: '24px',
    spread: '3px',
    opacity: 0.35,
  },
  intense: {
    blur: '32px',
    spread: '4px',
    opacity: 0.45,
  },
} as const;

/**
 * Glow effect presets for different UI elements
 * Format: box-shadow values for Tailwind CSS
 */
export const glowEffects = {
  // Primary brand glow (Bold Royal Blue - #0047AB)
  primary: {
    subtle: `0 0 ${glowIntensity.subtle.blur} ${glowIntensity.subtle.spread} rgba(0, 71, 171, ${glowIntensity.subtle.opacity})`,
    medium: `0 0 ${glowIntensity.medium.blur} ${glowIntensity.medium.spread} rgba(0, 71, 171, ${glowIntensity.medium.opacity})`,
    strong: `0 0 ${glowIntensity.strong.blur} ${glowIntensity.strong.spread} rgba(0, 71, 171, ${glowIntensity.strong.opacity})`,
    intense: `0 0 ${glowIntensity.intense.blur} ${glowIntensity.intense.spread} rgba(0, 71, 171, ${glowIntensity.intense.opacity})`,
  },

  // Success glow (Vivid Forest Green - #047857)
  success: {
    subtle: `0 0 ${glowIntensity.subtle.blur} ${glowIntensity.subtle.spread} rgba(4, 120, 87, ${glowIntensity.subtle.opacity})`,
    medium: `0 0 ${glowIntensity.medium.blur} ${glowIntensity.medium.spread} rgba(4, 120, 87, ${glowIntensity.medium.opacity})`,
    strong: `0 0 ${glowIntensity.strong.blur} ${glowIntensity.strong.spread} rgba(4, 120, 87, ${glowIntensity.strong.opacity})`,
    intense: `0 0 ${glowIntensity.intense.blur} ${glowIntensity.intense.spread} rgba(4, 120, 87, ${glowIntensity.intense.opacity})`,
  },

  // Warning/Accent glow (Vivid Tangerine - #C2410C)
  accent: {
    subtle: `0 0 ${glowIntensity.subtle.blur} ${glowIntensity.subtle.spread} rgba(194, 65, 12, ${glowIntensity.subtle.opacity})`,
    medium: `0 0 ${glowIntensity.medium.blur} ${glowIntensity.medium.spread} rgba(194, 65, 12, ${glowIntensity.medium.opacity})`,
    strong: `0 0 ${glowIntensity.strong.blur} ${glowIntensity.strong.spread} rgba(194, 65, 12, ${glowIntensity.strong.opacity})`,
    intense: `0 0 ${glowIntensity.intense.blur} ${glowIntensity.intense.spread} rgba(194, 65, 12, ${glowIntensity.intense.opacity})`,
  },

  // Error/Danger glow (Electric Scarlet - #B91C1C)
  error: {
    subtle: `0 0 ${glowIntensity.subtle.blur} ${glowIntensity.subtle.spread} rgba(185, 28, 28, ${glowIntensity.subtle.opacity})`,
    medium: `0 0 ${glowIntensity.medium.blur} ${glowIntensity.medium.spread} rgba(185, 28, 28, ${glowIntensity.medium.opacity})`,
    strong: `0 0 ${glowIntensity.strong.blur} ${glowIntensity.strong.spread} rgba(185, 28, 28, ${glowIntensity.strong.opacity})`,
    intense: `0 0 ${glowIntensity.intense.blur} ${glowIntensity.intense.spread} rgba(185, 28, 28, ${glowIntensity.intense.opacity})`,
  },

  // Premium glow (Rich Purple - #6D28D9)
  premium: {
    subtle: `0 0 ${glowIntensity.subtle.blur} ${glowIntensity.subtle.spread} rgba(109, 40, 217, ${glowIntensity.subtle.opacity})`,
    medium: `0 0 ${glowIntensity.medium.blur} ${glowIntensity.medium.spread} rgba(109, 40, 217, ${glowIntensity.medium.opacity})`,
    strong: `0 0 ${glowIntensity.strong.blur} ${glowIntensity.strong.spread} rgba(109, 40, 217, ${glowIntensity.strong.opacity})`,
    intense: `0 0 ${glowIntensity.intense.blur} ${glowIntensity.intense.spread} rgba(109, 40, 217, ${glowIntensity.intense.opacity})`,
  },

  // Neutral glow (Steel Gray - #64748B)
  neutral: {
    subtle: `0 0 ${glowIntensity.subtle.blur} ${glowIntensity.subtle.spread} rgba(100, 116, 139, ${glowIntensity.subtle.opacity})`,
    medium: `0 0 ${glowIntensity.medium.blur} ${glowIntensity.medium.spread} rgba(100, 116, 139, ${glowIntensity.medium.opacity})`,
    strong: `0 0 ${glowIntensity.strong.blur} ${glowIntensity.strong.spread} rgba(100, 116, 139, ${glowIntensity.strong.opacity})`,
  },

  // White glow (for dark backgrounds)
  white: {
    subtle: `0 0 ${glowIntensity.subtle.blur} ${glowIntensity.subtle.spread} rgba(255, 255, 255, ${glowIntensity.subtle.opacity})`,
    medium: `0 0 ${glowIntensity.medium.blur} ${glowIntensity.medium.spread} rgba(255, 255, 255, ${glowIntensity.medium.opacity})`,
    strong: `0 0 ${glowIntensity.strong.blur} ${glowIntensity.strong.spread} rgba(255, 255, 255, ${glowIntensity.strong.opacity})`,
  },
} as const;

/**
 * Ambient card lighting effects - Bold Color System
 * Combines shadow depth with subtle glow
 */
export const ambientEffects = {
  card: {
    light: `
      0 2px 4px rgba(0, 0, 0, 0.04),
      0 0 12px rgba(0, 71, 171, 0.06)
    `,
    medium: `
      0 4px 8px rgba(0, 0, 0, 0.06),
      0 0 16px rgba(0, 71, 171, 0.08)
    `,
    strong: `
      0 8px 16px rgba(0, 0, 0, 0.08),
      0 0 24px rgba(0, 71, 171, 0.12)
    `,
    elevated: `
      0 12px 24px rgba(0, 0, 0, 0.12),
      0 0 32px rgba(0, 71, 171, 0.15)
    `,
  },

  interactive: {
    default: `
      0 2px 4px rgba(0, 0, 0, 0.04),
      0 0 8px rgba(0, 71, 171, 0.06)
    `,
    hover: `
      0 4px 8px rgba(0, 0, 0, 0.06),
      0 0 20px rgba(0, 71, 171, 0.15),
      0 0 40px rgba(0, 71, 171, 0.08)
    `,
    active: `
      0 2px 4px rgba(0, 0, 0, 0.08),
      0 0 12px rgba(0, 71, 171, 0.25)
    `,
    focus: `
      0 0 0 3px rgba(0, 71, 171, 0.12),
      0 0 16px rgba(0, 71, 171, 0.20)
    `,
  },

  panel: {
    default: `
      0 0 1px rgba(0, 0, 0, 0.04),
      0 0 20px rgba(0, 71, 171, 0.04)
    `,
    hover: `
      0 0 1px rgba(0, 0, 0, 0.06),
      0 0 24px rgba(0, 71, 171, 0.08)
    `,
  },
} as const;

/**
 * Gradient glows for special effects - Bold Color System (Monochromatic)
 */
export const gradientGlows = {
  primary: `
    linear-gradient(145deg, rgba(30, 58, 138, 0.9), rgba(0, 71, 171, 0.9)),
    0 0 40px rgba(0, 71, 171, 0.3)
  `,
  success: `
    linear-gradient(145deg, rgba(6, 95, 70, 0.9), rgba(4, 120, 87, 0.9)),
    0 0 40px rgba(4, 120, 87, 0.3)
  `,
  warning: `
    linear-gradient(145deg, rgba(154, 52, 18, 0.9), rgba(194, 65, 12, 0.9)),
    0 0 40px rgba(194, 65, 12, 0.3)
  `,
  premium: `
    linear-gradient(145deg, rgba(91, 33, 182, 0.9), rgba(109, 40, 217, 0.9)),
    0 0 40px rgba(109, 40, 217, 0.3)
  `,
} as const;

/**
 * Focus ring configurations - Bold Color System
 */
export const focusRings = {
  default: {
    width: '2px',
    color: visionColors.blue,  // #0047AB - Bold Royal Blue
    offset: '2px',
    glow: glowEffects.primary.subtle,
  },
  strong: {
    width: '3px',
    color: visionColors.blue,  // #0047AB - Bold Royal Blue
    offset: '3px',
    glow: glowEffects.primary.medium,
  },
  error: {
    width: '2px',
    color: visionColors.red,  // #B91C1C - Electric Scarlet
    offset: '2px',
    glow: glowEffects.error.subtle,
  },
  success: {
    width: '2px',
    color: visionColors.green,  // #047857 - Vivid Forest Green
    offset: '2px',
    glow: glowEffects.success.subtle,
  },
  premium: {
    width: '2px',
    color: visionColors.purple,  // #6D28D9 - Rich Purple
    offset: '2px',
    glow: glowEffects.premium.subtle,
  },
} as const;

/**
 * CSS custom properties for glow effects - Bold Color System
 * Use these in your components for dynamic glow control
 */
export const glowCSSVariables = {
  '--glow-primary': glowEffects.primary.medium,
  '--glow-success': glowEffects.success.medium,
  '--glow-accent': glowEffects.accent.medium,
  '--glow-error': glowEffects.error.medium,
  '--glow-premium': glowEffects.premium.medium,
  '--glow-neutral': glowEffects.neutral.medium,
  '--ambient-card': ambientEffects.card.medium,
  '--ambient-interactive': ambientEffects.interactive.default,
  '--ambient-interactive-hover': ambientEffects.interactive.hover,
  '--focus-ring': focusRings.default.glow,
} as const;

/**
 * Type exports
 */
export type GlowIntensity = keyof typeof glowIntensity;
export type GlowEffect = typeof glowEffects;
export type AmbientEffect = typeof ambientEffects;
export type FocusRing = typeof focusRings;
