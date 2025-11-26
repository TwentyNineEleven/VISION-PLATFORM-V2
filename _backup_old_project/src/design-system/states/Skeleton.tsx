import React, { CSSProperties } from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1em',
  borderRadius = 'var(--radius-sm)',
  className = '',
  style,
}) => {
  const skeletonStyle: CSSProperties = {
    width,
    height,
    borderRadius,
    backgroundColor: 'var(--color-background-surface-secondary)',
    backgroundImage: `linear-gradient(
      90deg,
      var(--color-background-surface-secondary) 0px,
      var(--color-background-surface) 40px,
      var(--color-background-surface-secondary) 80px
    )`,
    backgroundSize: '200px 100%',
    animation: 'skeleton-loading 1.5s ease-in-out infinite',
    ...style,
  };

  return <div className={`skeleton ${className}`} style={skeletonStyle} aria-hidden="true" />;
};

