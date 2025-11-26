import React, { CSSProperties } from 'react';
import { semanticColors, radius, spacing } from '../theme';

export interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
  style?: CSSProperties;
}

const sizeMap = {
  sm: { height: '4px', fontSize: 'var(--font-size-xs)' },
  md: { height: '8px', fontSize: 'var(--font-size-sm)' },
  lg: { height: '12px', fontSize: 'var(--font-size-md)' },
};

const variantMap = {
  primary: semanticColors.fillPrimary,
  success: semanticColors.fillSuccess,
  warning: semanticColors.fillWarning,
  error: semanticColors.fillError,
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className = '',
  style,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const sizeStyle = sizeMap[size];

  const containerStyle: CSSProperties = {
    width: '100%',
    ...style,
  };

  const trackStyle: CSSProperties = {
    width: '100%',
    height: sizeStyle.height,
    backgroundColor: semanticColors.backgroundSurfaceSecondary,
    borderRadius: radius.full,
    overflow: 'hidden',
    position: 'relative',
  };

  const fillStyle: CSSProperties = {
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: variantMap[variant],
    borderRadius: radius.full,
    transition: 'width 0.3s ease',
  };

  return (
    <div className={className} style={containerStyle}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: spacing.xs,
            fontSize: sizeStyle.fontSize,
            color: semanticColors.textSecondary,
          }}
        >
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div style={trackStyle}>
        <div style={fillStyle} />
      </div>
    </div>
  );
};

export const Spinner: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = semanticColors.fillPrimary,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="32"
        opacity="0.3"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="24"
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
};

