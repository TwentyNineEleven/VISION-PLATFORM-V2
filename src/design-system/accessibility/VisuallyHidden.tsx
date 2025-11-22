import React, { ReactNode, CSSProperties } from 'react';

export interface VisuallyHiddenProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  className = '',
  style,
}) => {
  const hiddenStyle: CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
    ...style,
  };

  return (
    <span className={className} style={hiddenStyle}>
      {children}
    </span>
  );
};

