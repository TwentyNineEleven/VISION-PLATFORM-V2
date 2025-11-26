import React, { ReactNode, CSSProperties, useEffect } from 'react';
import { semanticColors, radius, shadows, spacing, zIndex } from '../theme';
import { Icon } from '../icons/Icon';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  style?: CSSProperties;
}

const sizeMap = {
  sm: '320px',
  md: '400px',
  lg: '600px',
  xl: '800px',
  full: '100%',
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  placement = 'right',
  size = 'md',
  className = '',
  style,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getDrawerStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      position: 'fixed',
      backgroundColor: semanticColors.backgroundSurface,
      boxShadow: shadows['2xl'],
      zIndex: zIndex.modal,
      transition: 'transform 0.3s ease',
    };

    switch (placement) {
      case 'left':
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          bottom: 0,
          width: sizeMap[size],
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        };
      case 'right':
        return {
          ...baseStyle,
          top: 0,
          right: 0,
          bottom: 0,
          width: sizeMap[size],
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        };
      case 'top':
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          right: 0,
          height: sizeMap[size],
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
        };
      case 'bottom':
        return {
          ...baseStyle,
          bottom: 0,
          left: 0,
          right: 0,
          height: sizeMap[size],
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        };
    }
  };

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: semanticColors.backgroundOverlay,
    zIndex: zIndex.modalBackdrop,
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} aria-hidden="true" />
      <div className={className} style={getDrawerStyle()}>
        {title && (
          <div
            style={{
              padding: spacing['3xl'],
              borderBottom: `1px solid ${semanticColors.borderPrimary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-family-heading)',
                fontWeight: 'var(--font-weight-bold)',
                fontSize: 'var(--font-size-xl)',
                color: semanticColors.textPrimary,
                margin: 0,
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: spacing.xs,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close drawer"
            >
              <Icon name="close" size={20} color={semanticColors.textSecondary} />
            </button>
          </div>
        )}
        <div
          style={{
            padding: spacing['3xl'],
            overflow: 'auto',
            height: title ? 'calc(100% - 73px)' : '100%',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

