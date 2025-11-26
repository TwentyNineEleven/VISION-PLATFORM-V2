import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, colors, radius, spacing } from '../theme';
import { Icon, IconName } from '../icons/Icon';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; icon: IconName; iconColor: string }> = {
  info: {
    bg: colors.blue.light,
    border: colors.blue.light,
    icon: 'info',
    iconColor: colors.blue.mid,
  },
  success: {
    bg: colors.green.light,
    border: colors.green.light,
    icon: 'check',
    iconColor: colors.emeraldGreen,
  },
  warning: {
    bg: colors.orange.light,
    border: colors.orange.light,
    icon: 'alert',
    iconColor: colors.vibrantOrange,
  },
  error: {
    bg: semanticColors.backgroundErrorLight,
    border: semanticColors.fillError,
    icon: 'alert',
    iconColor: semanticColors.fillError,
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
  style,
}) => {
  const variantStyle = variantStyles[variant];

  const alertStyle: CSSProperties = {
    backgroundColor: variantStyle.bg,
    border: `1px solid ${variantStyle.border}`,
    borderRadius: radius.md,
    padding: spacing['3xl'],
    display: 'flex',
    gap: spacing.md,
    ...style,
  };

  return (
    <div className={className} style={alertStyle} role="alert">
      <Icon name={variantStyle.icon} size={20} color={variantStyle.iconColor} />
      <div style={{ flex: 1 }}>
        {title && (
          <div
            style={{
              fontFamily: 'var(--font-family-body)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-sm)',
              marginBottom: spacing.xs,
              color: semanticColors.textPrimary,
            }}
          >
            {title}
          </div>
        )}
        <div
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-sm)',
            color: semanticColors.textPrimary,
          }}
        >
          {children}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: spacing.xs,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close alert"
        >
          <Icon name="close" size={16} color={semanticColors.textSecondary} />
        </button>
      )}
    </div>
  );
};

