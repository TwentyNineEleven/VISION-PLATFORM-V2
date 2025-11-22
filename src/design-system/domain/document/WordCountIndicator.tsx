import React from 'react';
import { semanticColors, spacing } from '../../theme';

export interface WordCountIndicatorProps {
  current: number;
  target?: number;
  className?: string;
}

export const WordCountIndicator: React.FC<WordCountIndicatorProps> = ({
  current,
  target,
  className = '',
}) => {
  const percentage = target ? (current / target) * 100 : 0;
  const isOverTarget = target && current > target;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        fontFamily: 'var(--font-family-body)',
        fontSize: 'var(--font-size-sm)',
        color: isOverTarget ? semanticColors.textError : semanticColors.textSecondary,
      }}
    >
      <span>
        {current.toLocaleString()} {target ? `/ ${target.toLocaleString()}` : ''} words
      </span>
      {target && (
        <div
          style={{
            width: '100px',
            height: '4px',
            backgroundColor: semanticColors.borderPrimary,
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(percentage, 100)}%`,
              height: '100%',
              backgroundColor: isOverTarget ? semanticColors.fillError : semanticColors.fillSuccess,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}
    </div>
  );
};

