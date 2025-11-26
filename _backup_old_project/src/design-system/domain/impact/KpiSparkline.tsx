import React, { CSSProperties } from 'react';
import { semanticColors, spacing } from '../../theme';

export interface KpiSparklineProps {
  data: number[];
  label?: string;
  value?: number | string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  style?: CSSProperties;
}

export const KpiSparkline: React.FC<KpiSparklineProps> = ({
  data,
  label,
  value,
  trend,
  className = '',
  style,
}) => {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const pathD = `M ${points}`;

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, ...style }}>
      {label && (
        <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
          {label}
        </div>
      )}
      {value !== undefined && (
        <div style={{ fontFamily: 'var(--font-family-body)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-xl)', color: 'var(--color-text-primary)' }}>
          {value}
        </div>
      )}
      <div style={{ width: '100%', height: '40px', position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
          <polyline
            points={points}
            fill="none"
            stroke={trend === 'up' ? semanticColors.fillSuccess : trend === 'down' ? semanticColors.fillError : semanticColors.fillPrimary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

