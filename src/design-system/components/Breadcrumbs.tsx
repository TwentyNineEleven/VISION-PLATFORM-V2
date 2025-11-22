import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, spacing } from '../theme';
import { Icon } from '../icons/Icon';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator,
  className = '',
  style,
}) => {
  const defaultSeparator = <Icon name="chevronRight" size={16} color={semanticColors.textTertiary} />;

  const breadcrumbStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-sm)',
    ...style,
  };

  return (
    <nav className={className} style={breadcrumbStyle} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const content = item.href ? (
          <a
            href={item.href}
            onClick={item.onClick}
            style={{
              color: semanticColors.textBrand,
              textDecoration: 'none',
            }}
          >
            {item.label}
          </a>
        ) : item.onClick ? (
          <button
            onClick={item.onClick}
            style={{
              background: 'none',
              border: 'none',
              color: semanticColors.textBrand,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
          >
            {item.label}
          </button>
        ) : (
          <span style={{ color: semanticColors.textPrimary, fontWeight: isLast ? 'var(--font-weight-semibold)' : 'normal' }}>
            {item.label}
          </span>
        );

        return (
          <React.Fragment key={index}>
            {content}
            {!isLast && <span>{separator || defaultSeparator}</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

