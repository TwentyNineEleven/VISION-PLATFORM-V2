import React, { CSSProperties, ReactNode } from 'react';

export interface ContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  className?: string;
  style?: CSSProperties;
}

const maxWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
};

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'xl',
  padding = true,
  className = '',
  style,
}) => {
  const containerStyle: CSSProperties = {
    width: '100%',
    maxWidth: maxWidths[maxWidth],
    margin: '0 auto',
    padding: padding ? 'var(--spacing-3xl)' : '0',
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
};

