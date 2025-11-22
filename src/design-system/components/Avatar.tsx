import React, { CSSProperties } from 'react';
import { semanticColors, radius } from '../theme';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'square';
  className?: string;
  style?: CSSProperties;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  variant = 'circle',
  className = '',
  style,
}) => {
  const avatarSize = sizeMap[size];
  const fontSize = avatarSize * 0.4;

  const avatarStyle: CSSProperties = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: variant === 'circle' ? radius.round : radius.md,
    backgroundColor: semanticColors.fillPrimary,
    color: semanticColors.textInverse,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-family-body)',
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: `${fontSize}px`,
    overflow: 'hidden',
    flexShrink: 0,
    ...style,
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={className}
        style={avatarStyle}
      />
    );
  }

  return (
    <div className={className} style={avatarStyle} role="img" aria-label={alt || name || 'Avatar'}>
      {name ? getInitials(name) : '?'}
    </div>
  );
};

