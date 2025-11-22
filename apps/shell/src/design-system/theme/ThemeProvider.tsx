import React, { createContext, useContext, ReactNode } from 'react';
import { colors, semanticColors, gradients } from './colors';
import { typography, fontFamilies, fontSizes, fontWeights, lineHeights } from './typography';
import { spacing, spacingPatterns } from './spacing';
import { radius } from './radius';
import { shadows, elevation } from './shadows';
import { breakpoints, mediaQueries } from './breakpoints';
import { zIndex } from './zIndex';

const theme = {
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

const ThemeContext = createContext<Theme>(theme);

export interface ThemeProviderProps {
  children: ReactNode;
  customTheme?: Partial<Theme>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  customTheme 
}) => {
  const mergedTheme = customTheme 
    ? { ...theme, ...customTheme } as Theme
    : theme;

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

