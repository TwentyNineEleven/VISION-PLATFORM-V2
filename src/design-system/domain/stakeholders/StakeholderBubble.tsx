import React, { CSSProperties } from 'react';
import { semanticColors, colors, radius, spacing } from '../../theme';

export interface StakeholderBubbleProps {
  name: string;
  category: string;
  influence: number; // 1-5
  interest: number; // 1-5
  x: number;
  y: number;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

const getSize = (influence: number): number => {
  return 40 + influence * 10; // 50-90px
};

const getColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    internal: colors.blue.mid,
    external: colors.emeraldGreen,
    partner: colors.vibrantOrange,
    beneficiary: semanticColors.fillPrimary,
  };
  return categoryColors[category] || colors.warmGray;
};

export const StakeholderBubble: React.FC<StakeholderBubbleProps> = ({
  name,
  category,
  influence,
  interest,
  x,
  y,
  onClick,
  className = '',
  style,
}) => {
  const size = getSize(influence);
  const color = getColor(category);

  const bubbleStyle: CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    width: size,
    height: size,
    borderRadius: radius.round,
    backgroundColor: color,
    color: semanticColors.textInverse,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-family-body)',
    fontSize: `${size * 0.2}px`,
    fontWeight: 'var(--font-weight-semibold)',
    cursor: onClick ? 'pointer' : 'default',
    textAlign: 'center',
    padding: spacing.xs,
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.2s ease',
    ...style,
  };

  return (
    <div
      className={className}
      style={bubbleStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      title={`${name} (${category}) - Influence: ${influence}, Interest: ${interest}`}
    >
      {name.substring(0, 3).toUpperCase()}
    </div>
  );
};

