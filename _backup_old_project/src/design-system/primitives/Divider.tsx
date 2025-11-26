import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, spacing } from '../theme';

export interface DividerProps {
  direction?: 'horizontal' | 'vertical';
  showText?: boolean;
  text?: ReactNode;
  topPadding?: keyof typeof spacing;
  bottomPadding?: keyof typeof spacing;
  className?: string;
  style?: CSSProperties;
}

export const Divider: React.FC<DividerProps> = ({
  direction = 'horizontal',
  showText = false,
  text,
  topPadding = '2xl',
  bottomPadding = '2xl',
  className = '',
  style,
}) => {
  const spacingMap = {
    none: '0px',
    xxs: '2px',
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '12px',
    xxl: '14px',
    '2xl': '16px',
    '3xl': '16px',
    '4xl': '18px',
    '5xl': '20px',
    '6xl': '24px',
    '7xl': '28px',
    '8xl': '32px',
    '9xl': '40px',
    '10xl': '40px',
    '12xl': '48px',
    '16xl': '64px',
  };

  if (direction === 'vertical') {
    const verticalStyle: CSSProperties = {
      width: '1px',
      height: '100%',
      backgroundColor: semanticColors.borderPrimary,
      ...style,
    };
    return <div className={className} style={verticalStyle} role="separator" aria-orientation="vertical" />;
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingTop: spacingMap[topPadding],
    paddingBottom: spacingMap[bottomPadding],
    ...style,
  };

  const lineStyle: CSSProperties = {
    flex: 1,
    height: '1px',
    backgroundColor: semanticColors.borderPrimary,
  };

  if (!showText) {
    return (
      <div className={className} style={containerStyle}>
        <div style={lineStyle} role="separator" aria-orientation="horizontal" />
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      <div style={lineStyle} />
      {text && (
        <div
          style={{
            padding: `0 ${spacing.lg}`,
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-sm)',
            color: semanticColors.textTertiary,
          }}
        >
          {text}
        </div>
      )}
      <div style={lineStyle} />
    </div>
  );
};

