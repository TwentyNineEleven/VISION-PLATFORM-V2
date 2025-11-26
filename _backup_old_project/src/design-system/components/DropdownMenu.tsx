import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { semanticColors, radius, spacing, shadows, zIndex } from '../theme';
import { Icon } from '../icons/Icon';

export interface DropdownMenuItem {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
  style?: React.CSSProperties;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  placement = 'bottom-left',
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getMenuStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: semanticColors.backgroundSurface,
      border: `1px solid ${semanticColors.borderPrimary}`,
      borderRadius: radius.md,
      boxShadow: shadows.lg,
      minWidth: '200px',
      zIndex: zIndex.dropdown,
      marginTop: placement.startsWith('bottom') ? spacing.xs : 0,
      marginBottom: placement.startsWith('top') ? spacing.xs : 0,
    };

    if (placement.includes('right')) {
      baseStyle.right = 0;
    } else {
      baseStyle.left = 0;
    }

    return baseStyle;
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>
      {isOpen && (
        <div style={getMenuStyle()}>
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div
                  key={index}
                  style={{
                    height: '1px',
                    backgroundColor: semanticColors.borderPrimary,
                    margin: `${spacing.xs} 0`,
                  }}
                />
              );
            }

            return (
              <button
                key={index}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    setIsOpen(false);
                  }
                }}
                disabled={item.disabled}
                style={{
                  width: '100%',
                  padding: `${spacing.md} ${spacing.lg}`,
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-md)',
                  color: item.disabled ? semanticColors.textTertiary : semanticColors.textPrimary,
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  opacity: item.disabled ? 0.5 : 1,
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!item.disabled) {
                    e.currentTarget.style.backgroundColor = semanticColors.backgroundSurfaceSecondary;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

