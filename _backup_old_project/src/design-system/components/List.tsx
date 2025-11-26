import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, spacing } from '../theme';
import { VStack } from '../primitives/Stack';

export interface ListItemProps {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ListItem: React.FC<ListItemProps> = ({
  children,
  onClick,
  selected = false,
  disabled = false,
  className = '',
  style,
}) => {
  const itemStyle: CSSProperties = {
    padding: spacing.md,
    backgroundColor: selected ? semanticColors.backgroundSurfaceSecondary : 'transparent',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
    opacity: disabled ? 0.6 : 1,
    transition: 'background-color 0.2s ease',
    ...style,
  };

  return (
    <div
      className={className}
      style={itemStyle}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={(e) => {
        if (!disabled && !selected && onClick) {
          e.currentTarget.style.backgroundColor = semanticColors.backgroundSurfaceSecondary;
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
};

export interface ListProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const List: React.FC<ListProps> = ({
  children,
  className = '',
  style,
}) => {
  return (
    <VStack gap="xs" className={className} style={style}>
      {children}
    </VStack>
  );
};

