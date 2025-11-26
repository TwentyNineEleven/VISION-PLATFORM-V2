import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, spacing } from '../theme';

export interface DescriptionListItem {
  term: string;
  description: ReactNode;
}

export interface DescriptionListProps {
  items: DescriptionListItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: CSSProperties;
}

export const DescriptionList: React.FC<DescriptionListProps> = ({
  items,
  orientation = 'horizontal',
  className = '',
  style,
}) => {
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
    gap: orientation === 'horizontal' ? spacing['6xl'] : spacing.md,
    ...style,
  };

  const itemStyle: CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    gap: orientation === 'vertical' ? spacing.xs : spacing.md,
    flex: orientation === 'horizontal' ? '1 1 0' : 'none',
    minWidth: orientation === 'horizontal' ? '200px' : 'auto',
  };

  const termStyle: CSSProperties = {
    fontFamily: 'var(--font-family-body)',
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: 'var(--font-size-sm)',
    color: semanticColors.textPrimary,
    flexShrink: 0,
    width: orientation === 'horizontal' ? '150px' : 'auto',
  };

  const descriptionStyle: CSSProperties = {
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-md)',
    color: semanticColors.textSecondary,
    flex: 1,
  };

  return (
    <dl className={className} style={containerStyle}>
      {items.map((item, index) => (
        <div key={index} style={itemStyle}>
          <dt style={termStyle}>{item.term}</dt>
          <dd style={descriptionStyle}>{item.description}</dd>
        </div>
      ))}
    </dl>
  );
};

