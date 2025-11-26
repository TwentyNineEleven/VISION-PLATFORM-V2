import React, { CSSProperties, ReactNode, useRef, useEffect, useState } from 'react';

export interface ScrollAreaProps {
  children: ReactNode;
  maxHeight?: string;
  className?: string;
  style?: CSSProperties;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  maxHeight,
  className = '',
  style,
}) => {
  const scrollAreaStyle: CSSProperties = {
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight,
    ...style,
  };

  return (
    <div 
      className={`scroll-area ${className}`}
      style={scrollAreaStyle}
    >
      {children}
    </div>
  );
};

