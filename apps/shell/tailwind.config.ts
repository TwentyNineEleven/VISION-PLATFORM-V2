import type { Config } from 'tailwindcss';

const config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // @ts-expect-error - safelist is supported in Tailwind but not in v4 alpha types yet
  safelist: [
    // Bold Color System - Phase Colors (used by getPhaseTokenClasses())
    // Background colors
    'bg-vision-green-50', 'bg-vision-green-500', 'bg-vision-green-600', 'bg-vision-green-700',
    'bg-vision-orange-50', 'bg-vision-orange-800', 'bg-vision-orange-900',
    'bg-vision-blue-50', 'bg-vision-blue-700', 'bg-vision-blue-950',
    'bg-vision-purple-50', 'bg-vision-purple-600', 'bg-vision-purple-700', 'bg-vision-purple-900',
    'bg-vision-gray-50', 'bg-vision-gray-100', 'bg-vision-gray-700', 'bg-vision-gray-950',
    'bg-vision-red-50', 'bg-vision-red-900',

    // Text colors
    'text-vision-green-500', 'text-vision-green-600', 'text-vision-green-700', 'text-vision-green-900',
    'text-vision-orange-900',
    'text-vision-blue-700', 'text-vision-blue-950',
    'text-vision-purple-600', 'text-vision-purple-700', 'text-vision-purple-900',
    'text-vision-gray-0', 'text-vision-gray-700', 'text-vision-gray-950',
    'text-vision-red-700', 'text-vision-red-900',

    // Hover colors
    'hover:bg-vision-green-700',
    'hover:bg-vision-orange-800',
    'hover:bg-vision-blue-700', 'hover:bg-vision-blue-950',
    'hover:bg-vision-purple-700', 'hover:bg-vision-purple-900',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // VISION Platform Bold Color System v3.0 - Complete Scales
        'vision-blue': {
          DEFAULT: '#0047AB',  // Bold Royal Blue
          50: '#EFF6FF',       // Ice Blue
          100: '#DBEAFE',      // Sky Light
          500: '#3B82F6',      // Bright Cobalt
          700: '#2563EB',      // Electric Blue
          900: '#1E3A8A',      // Deep Navy
          950: '#0047AB',      // Bold Royal Blue
        },
        'vision-green': {
          DEFAULT: '#047857',  // Vivid Forest Green
          50: '#F0FDFA',       // Ice Mint
          100: '#CCFBF1',      // Mint Light
          500: '#14B8A6',      // Bright Jade
          600: '#0F766E',      // Vibrant Teal
          700: '#059669',      // Bold Emerald
          900: '#047857',      // Vivid Forest Green
          950: '#065F46',      // Darker Forest
        },
        'vision-orange': {
          DEFAULT: '#C2410C',  // Vivid Tangerine
          50: '#FFF7ED',       // Cream
          100: '#FFEDD5',      // Peach Light
          500: '#F97316',      // Electric Amber
          600: '#EA580C',      // Bright Orange
          800: '#9A3412',      // Deep Pumpkin
          900: '#C2410C',      // Vivid Tangerine
        },
        'vision-purple': {
          DEFAULT: '#6D28D9',  // Rich Purple
          50: '#F5F3FF',       // Lilac Mist
          100: '#EDE9FE',      // Lavender Light
          600: '#8B5CF6',      // Bright Amethyst
          700: '#7C3AED',      // Bold Violet
          800: '#5B21B6',      // Deep Orchid
          900: '#6D28D9',      // Rich Purple
        },
        'vision-red': {
          DEFAULT: '#B91C1C',  // Electric Scarlet
          50: '#FEF2F2',       // Blush
          100: '#FEE2E2',      // Rose Light
          600: '#EF4444',      // Vibrant Red
          700: '#DC2626',      // Bold Crimson
          800: '#991B1B',      // Deep Ruby
          900: '#B91C1C',      // Electric Scarlet
        },
        'vision-gray': {
          DEFAULT: '#64748B',  // Steel Gray
          0: '#FFFFFF',        // Pure White
          50: '#F8FAFC',       // Mist
          100: '#F1F5F9',      // Smoke
          300: '#CBD5E1',      // Silver
          500: '#94A3B8',      // Cool Gray
          700: '#64748B',      // Steel Gray
          950: '#1F2937',      // Slate Gray
        },

        // Semantic color shortcuts
        'success': '#047857',      // Vivid Forest Green
        'warning': '#C2410C',      // Vivid Tangerine
        'error': '#B91C1C',        // Electric Scarlet
        'info': '#2563EB',         // Electric Blue
        'premium': '#6D28D9',      // Rich Purple
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        // Glow effects - Bold Color System
        'glow-primary-sm': '0 0 8px 1px rgba(0, 71, 171, 0.15)',      // Bold Royal Blue
        'glow-primary': '0 0 16px 2px rgba(0, 71, 171, 0.25)',
        'glow-primary-lg': '0 0 24px 3px rgba(0, 71, 171, 0.35)',
        'glow-success-sm': '0 0 8px 1px rgba(4, 120, 87, 0.15)',      // Vivid Forest Green
        'glow-success': '0 0 16px 2px rgba(4, 120, 87, 0.25)',
        'glow-success-lg': '0 0 24px 3px rgba(4, 120, 87, 0.35)',
        'glow-accent-sm': '0 0 8px 1px rgba(194, 65, 12, 0.15)',      // Vivid Tangerine
        'glow-accent': '0 0 16px 2px rgba(194, 65, 12, 0.25)',
        'glow-accent-lg': '0 0 24px 3px rgba(194, 65, 12, 0.35)',
        'glow-error-sm': '0 0 8px 1px rgba(185, 28, 28, 0.15)',       // Electric Scarlet
        'glow-error': '0 0 16px 2px rgba(185, 28, 28, 0.25)',
        'glow-error-lg': '0 0 24px 3px rgba(185, 28, 28, 0.35)',
        'glow-premium-sm': '0 0 8px 1px rgba(109, 40, 217, 0.15)',    // Rich Purple
        'glow-premium': '0 0 16px 2px rgba(109, 40, 217, 0.25)',
        'glow-premium-lg': '0 0 24px 3px rgba(109, 40, 217, 0.35)',

        // Ambient card effects - Bold Royal Blue
        'ambient-card': '0 2px 4px rgba(0, 0, 0, 0.04), 0 0 12px rgba(0, 71, 171, 0.06)',
        'ambient-card-hover': '0 4px 8px rgba(0, 0, 0, 0.06), 0 0 20px rgba(0, 71, 171, 0.15), 0 0 40px rgba(0, 71, 171, 0.08)',
        'ambient-elevated': '0 12px 24px rgba(0, 0, 0, 0.12), 0 0 32px rgba(0, 71, 171, 0.15)',

        // Interactive shadows - Bold Royal Blue
        'interactive': '0 2px 4px rgba(0, 0, 0, 0.04), 0 0 8px rgba(0, 71, 171, 0.06)',
        'interactive-hover': '0 4px 8px rgba(0, 0, 0, 0.06), 0 0 20px rgba(0, 71, 171, 0.15)',
        'interactive-active': '0 2px 4px rgba(0, 0, 0, 0.08), 0 0 12px rgba(0, 71, 171, 0.25)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 16px 2px rgba(0, 71, 171, 0.25)',  // Bold Royal Blue
          },
          '50%': {
            boxShadow: '0 0 24px 3px rgba(0, 71, 171, 0.45)',
          },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
