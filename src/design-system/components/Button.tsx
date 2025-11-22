import React, { ButtonHTMLAttributes, ReactNode, useState } from 'react';
import { semanticColors, radius, spacing, focusShadow } from '../theme';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'subtle' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: semanticColors.fillPrimary,
    color: semanticColors.textInverse,
    border: 'none',
  },
  accent: {
    backgroundColor: semanticColors.fillAccent,
    color: semanticColors.textInverse,
    border: 'none',
  },
  secondary: {
    backgroundColor: semanticColors.backgroundSurface,
    color: semanticColors.textPrimary,
    border: `1px solid ${semanticColors.borderPrimary}`,
  },
  subtle: {
    backgroundColor: 'transparent',
    color: semanticColors.textPrimary,
    border: 'none',
  },
  destructive: {
    backgroundColor: semanticColors.fillError,
    color: semanticColors.textInverse,
    border: 'none',
  },
};

const sizeStyles: Record<ButtonSize, { padding: string; fontSize: string; height: string }> = {
  sm: {
    padding: `${spacing.sm} ${spacing.lg}`,
    fontSize: 'var(--font-size-sm)',
    height: '32px',
  },
  md: {
    padding: `${spacing.xl} ${spacing.xxl}`,
    fontSize: 'var(--font-size-md)',
    height: '40px',
  },
  lg: {
    padding: `${spacing['2xl']} ${spacing['4xl']}`,
    fontSize: 'var(--font-size-md)',
    height: '48px',
  },
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    borderRadius: radius.sm,
    fontFamily: 'var(--font-family-body)',
    fontWeight: 'var(--font-weight-medium)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : isActive ? 0.8 : isHovered ? 0.9 : 1,
    transform: isActive ? 'translateY(0)' : isHovered && !disabled && !isLoading ? 'translateY(-1px)' : 'none',
    outline: 'none',
    boxShadow: isFocused && !disabled && !isLoading ? focusShadow.default : 'none',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={className}
      style={baseStyle}
      onMouseEnter={() => {
        if (!disabled && !isLoading) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => {
        if (!disabled && !isLoading) {
          setIsActive(true);
        }
      }}
      onMouseUp={() => {
        setIsActive(false);
      }}
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size={16} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

const Spinner: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ animation: 'spin 1s linear infinite' }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="32"
      strokeDashoffset="32"
      opacity="0.3"
    />
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="32"
      strokeDashoffset="24"
    />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </svg>
);

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: ReactNode;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  ...props
}) => {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  
  return (
    <Button
      {...props}
      size={size}
      style={{
        width: sizeStyles[size].height,
        padding: 0,
        ...props.style,
      }}
    >
      <span style={{ display: 'flex', width: iconSize, height: iconSize }}>
        {icon}
      </span>
    </Button>
  );
};

export interface ButtonGroupProps {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  className = '',
  style,
}) => {
  const groupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    gap: spacing.xs,
    ...style,
  };

  return (
    <div className={className} style={groupStyle}>
      {children}
    </div>
  );
};

