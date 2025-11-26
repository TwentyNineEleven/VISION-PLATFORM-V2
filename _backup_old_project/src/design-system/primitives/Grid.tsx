import React, { CSSProperties, ReactNode } from 'react';
import { spacing } from '../theme';

export interface GridProps {
  children: ReactNode;
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: keyof typeof spacing;
  className?: string;
  style?: CSSProperties;
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 12,
  gap = 'md',
  className = '',
  style,
}) => {
  const getGridTemplateColumns = (): string => {
    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }
    // Responsive columns - default to 12 for now, can be enhanced with CSS Grid
    return `repeat(12, 1fr)`;
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: getGridTemplateColumns(),
    gap: spacing[gap],
    ...style,
  };

  return (
    <div className={className} style={gridStyle}>
      {children}
    </div>
  );
};

export interface GridItemProps {
  children: ReactNode;
  colSpan?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  className?: string;
  style?: CSSProperties;
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  colSpan = 1,
  className = '',
  style,
}) => {
  const getGridColumn = (): string => {
    if (typeof colSpan === 'number') {
      return `span ${colSpan}`;
    }
    return 'span 1';
  };

  const itemStyle: CSSProperties = {
    gridColumn: getGridColumn(),
    ...style,
  };

  return (
    <div className={className} style={itemStyle}>
      {children}
    </div>
  );
};

