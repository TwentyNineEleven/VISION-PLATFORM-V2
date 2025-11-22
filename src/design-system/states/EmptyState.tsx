import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, spacing } from '../theme';
import { Button } from '../components/Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  style?: CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing['8xl'],
        textAlign: 'center',
        ...style,
      }}
    >
      {icon && (
        <div style={{ marginBottom: spacing['3xl'], color: semanticColors.textTertiary }}>
          {icon}
        </div>
      )}
      <h3
        style={{
          fontFamily: 'var(--font-family-heading)',
          fontWeight: 'var(--font-weight-bold)',
          fontSize: 'var(--font-size-xl)',
          color: semanticColors.textPrimary,
          marginBottom: spacing.md,
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-md)',
            color: semanticColors.textSecondary,
            marginBottom: action ? spacing['3xl'] : 0,
            maxWidth: '400px',
          }}
        >
          {description}
        </p>
      )}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

