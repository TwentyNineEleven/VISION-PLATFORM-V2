import React, { CSSProperties, ReactNode } from 'react';
import { spacing } from '../theme';

export interface StackProps {
  children: ReactNode;
  direction?: 'row' | 'column';
  gap?: keyof typeof spacing;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
  style,
}) => {
  const flexStyle: CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    gap: spacing[gap],
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    ...style,
  };

  return (
    <div className={className} style={flexStyle}>
      {children}
    </div>
  );
};

export const HStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="row" />
);

export const VStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="column" />
);

