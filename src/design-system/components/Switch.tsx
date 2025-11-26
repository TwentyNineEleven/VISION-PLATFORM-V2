import React, { InputHTMLAttributes } from 'react';
import { semanticColors, colors, radius, spacing } from '../theme';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  size = 'md',
  className = '',
  style,
  ...props
}) => {
  const sizeMap = { sm: { width: 32, height: 18 }, md: { width: 40, height: 20 }, lg: { width: 48, height: 24 } };
  const switchSize = sizeMap[size];

  const switchStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: switchSize.width,
    height: switchSize.height,
    ...style,
  };

  const sliderStyle: React.CSSProperties = {
    position: 'absolute',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: props.checked ? semanticColors.fillPrimary : semanticColors.borderSecondary,
    transition: '0.3s',
    borderRadius: radius.full,
    opacity: props.disabled ? 0.6 : 1,
  };

  const thumbStyle: React.CSSProperties = {
    position: 'absolute',
    content: '""',
    height: switchSize.height - 4,
    width: switchSize.height - 4,
    left: props.checked ? switchSize.width - switchSize.height + 2 : 2,
    bottom: 2,
    backgroundColor: colors.white,
    transition: '0.3s',
    borderRadius: radius.round,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  };

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
      }}
      className={className}
    >
      <div style={switchStyle}>
        <input
          type="checkbox"
          role="switch"
          {...props}
          style={{ opacity: 0, width: 0, height: 0 }}
        />
        <span style={sliderStyle}>
          <span style={thumbStyle} />
        </span>
      </div>
      {label && (
        <span
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-md)',
            color: semanticColors.textPrimary,
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
};

