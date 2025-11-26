import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, spacing } from '../theme';
import { Icon } from '../icons/Icon';

export interface InlineErrorProps {
  message: string;
  className?: string;
  style?: CSSProperties;
}

export const InlineError: React.FC<InlineErrorProps> = ({
  message,
  className = '',
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xs,
        color: semanticColors.textError,
        fontFamily: 'var(--font-family-body)',
        fontSize: 'var(--font-size-sm)',
        lineHeight: 'var(--line-height-sm)',
        ...style,
      }}
      role="alert"
    >
      <Icon name="alert" size={16} color={semanticColors.textError} />
      <span>{message}</span>
    </div>
  );
};

