import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, radius, shadows, spacing } from '../theme';

export interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  padding?: boolean;
  elevation?: keyof typeof shadows;
  className?: string;
  style?: CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  padding = true,
  elevation = 'sm',
  className = '',
  style,
}) => {
  const cardStyle: CSSProperties = {
    backgroundColor: semanticColors.backgroundSurface,
    borderRadius: radius.md,
    boxShadow: shadows[elevation],
    overflow: 'hidden',
    ...style,
  };

  return (
    <div className={className} style={cardStyle}>
      {header && (
        <div
          style={{
            padding: padding ? spacing['3xl'] : 0,
            borderBottom: `1px solid ${semanticColors.borderPrimary}`,
          }}
        >
          {header}
        </div>
      )}
      <div style={{ padding: padding ? spacing['3xl'] : 0 }}>{children}</div>
      {footer && (
        <div
          style={{
            padding: padding ? spacing['3xl'] : 0,
            borderTop: `1px solid ${semanticColors.borderPrimary}`,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export interface StatCardProps {
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  sparkline?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  sparkline,
  className = '',
  style,
}) => {
  return (
    <Card className={className} style={style}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
          }}
        >
          {value}
        </div>
        {trend && (
          <div
            style={{
              fontSize: 'var(--font-size-sm)',
              color: trend.isPositive ? 'var(--color-text-success)' : 'var(--color-text-error)',
            }}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
        {sparkline && <div>{sparkline}</div>}
      </div>
    </Card>
  );
};

