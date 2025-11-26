import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, spacing } from '../theme';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { HStack } from '../primitives/Stack';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className = '',
  style,
}) => {
  return (
    <div className={className} style={{ marginBottom: spacing['6xl'], ...style }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div style={{ marginBottom: spacing.md }}>
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}
      <HStack justify="space-between" align="start" style={{ marginBottom: subtitle ? spacing.md : 0 }}>
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: 'var(--font-family-heading)',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: 'var(--font-size-3xl)',
              lineHeight: 'var(--line-height-3xl)',
              color: semanticColors.textPrimary,
              margin: 0,
              marginBottom: subtitle ? spacing.sm : 0,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--font-size-md)',
                lineHeight: 'var(--line-height-md)',
                color: semanticColors.textSecondary,
                margin: 0,
              }}
            >
              {subtitle}
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

