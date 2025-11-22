import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, spacing } from '../theme';
import { HStack } from '../primitives/Stack';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actions,
  className = '',
  style,
}) => {
  return (
    <div className={className} style={{ marginBottom: spacing['3xl'], ...style }}>
      <HStack justify="space-between" align="start">
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontFamily: 'var(--font-family-heading)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-xl)',
              lineHeight: 'var(--line-height-xl)',
              color: semanticColors.textPrimary,
              margin: 0,
              marginBottom: description ? spacing.xs : 0,
            }}
          >
            {title}
          </h2>
          {description && (
            <p
              style={{
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--font-size-sm)',
                lineHeight: 'var(--line-height-sm)',
                color: semanticColors.textSecondary,
                margin: 0,
              }}
            >
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
            {actions}
          </div>
        )}
      </HStack>
    </div>
  );
};

