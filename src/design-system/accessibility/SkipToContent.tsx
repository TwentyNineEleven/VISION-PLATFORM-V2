import React, { CSSProperties } from 'react';
import { semanticColors, radius, spacing } from '../theme';

export interface SkipToContentProps {
  href?: string;
  className?: string;
  style?: CSSProperties;
}

export const SkipToContent: React.FC<SkipToContentProps> = ({
  href = '#main-content',
  className = '',
  style,
}) => {
  const linkStyle: CSSProperties = {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    zIndex: 10000,
    padding: `${spacing.md} ${spacing.lg}`,
    backgroundColor: semanticColors.fillPrimary,
    color: semanticColors.textInverse,
    borderRadius: radius.sm,
    fontFamily: 'var(--font-family-body)',
    fontWeight: 'var(--font-weight-medium)',
    fontSize: 'var(--font-size-sm)',
    textDecoration: 'none',
    transform: 'translateY(-100%)',
    transition: 'transform 0.2s ease',
    ...style,
  };

  return (
    <a
      href={href}
      className={className}
      style={linkStyle}
      onFocus={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = 'translateY(-100%)';
      }}
    >
      Skip to main content
    </a>
  );
};

