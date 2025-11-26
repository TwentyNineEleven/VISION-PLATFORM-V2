import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, radius, spacing } from '../theme';

export type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

export interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
  size?: 'sm' | 'md' | 'lg';
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
}

const variantStyles: Record<TagVariant, { bg: string; color: string; border: string }> = {
  default: {
    bg: semanticColors.backgroundSurfaceSecondary,
    color: semanticColors.textPrimary,
    border: semanticColors.borderPrimary,
  },
  primary: {
    bg: semanticColors.fillPrimary,
    color: semanticColors.textInverse,
    border: semanticColors.fillPrimary,
  },
  success: {
    bg: semanticColors.fillSuccess,
    color: semanticColors.textInverse,
    border: semanticColors.fillSuccess,
  },
  warning: {
    bg: semanticColors.fillWarning,
    color: semanticColors.textInverse,
    border: semanticColors.fillWarning,
  },
  error: {
    bg: semanticColors.fillError,
    color: semanticColors.textInverse,
    border: semanticColors.fillError,
  },
};

const sizeStyles = {
  sm: { padding: `${spacing.xs} ${spacing.sm}`, fontSize: 'var(--font-size-xs)' },
  md: { padding: `${spacing.sm} ${spacing.md}`, fontSize: 'var(--font-size-sm)' },
  lg: { padding: `${spacing.md} ${spacing.lg}`, fontSize: 'var(--font-size-md)' },
};

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  size = 'md',
  onClose,
  className = '',
  style,
}) => {
  const variantStyle = variantStyles[variant];

  const tagStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: variantStyle.bg,
    color: variantStyle.color,
    border: `1px solid ${variantStyle.border}`,
    borderRadius: radius.full,
    fontFamily: 'var(--font-family-body)',
    fontWeight: 'var(--font-weight-medium)',
    ...sizeStyles[size],
    ...style,
  };

  return (
    <span className={className} style={tagStyle}>
      {children}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginLeft: spacing.xs,
            display: 'flex',
            alignItems: 'center',
            color: 'inherit',
          }}
          aria-label="Remove tag"
        >
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

export const Badge = Tag;

