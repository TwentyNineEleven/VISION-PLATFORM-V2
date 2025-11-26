import React, { SelectHTMLAttributes, ReactNode, useState } from 'react';
import { semanticColors, radius, spacing, spacingPatterns, focusShadow } from '../theme';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Select: React.FC<SelectProps> = ({
  options,
  label,
  helperText,
  error,
  required,
  size = 'md',
  className = '',
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const sizeStyles = {
    sm: { padding: `${spacing.sm} ${spacing.lg}`, fontSize: 'var(--font-size-sm)', height: '32px' },
    md: { padding: spacingPatterns.inputPaddingY + ' ' + spacingPatterns.inputPaddingX, fontSize: 'var(--font-size-md)', height: '40px' },
    lg: { padding: `${spacing['2xl']} ${spacing['3xl']}`, fontSize: 'var(--font-size-md)', height: '48px' },
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: semanticColors.backgroundSurface,
    border: error
      ? `1px solid ${semanticColors.borderError}`
      : `1px solid ${semanticColors.borderPrimary}`,
    borderRadius: radius.sm,
    fontFamily: 'var(--font-family-body)',
    lineHeight: 'var(--line-height-md)',
    color: semanticColors.textPrimary,
    outline: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    boxShadow: error
      ? focusShadow.error
      : isFocused
      ? focusShadow.subtle
      : 'none',
    ...sizeStyles[size],
    ...style,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
      className={className}
    >
      {label && (
        <label
          style={{
            fontFamily: 'var(--font-family-body)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
            color: error ? semanticColors.textError : semanticColors.textSecondary,
            marginBottom: spacing.xs,
          }}
        >
          {label}
          {required && (
            <span style={{ color: semanticColors.textError, marginLeft: spacing.xs }}>*</span>
          )}
        </label>
      )}
      <select
        {...props}
        value={props.value}
        onChange={props.onChange}
        style={selectStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={!!error}
        aria-describedby={error || helperText ? `${props.id || 'select'}-helper` : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <div
          id={`${props.id || 'select'}-helper`}
          style={{
            marginTop: spacing.md,
            fontSize: 'var(--font-size-sm)',
            lineHeight: 'var(--line-height-sm)',
            color: error ? semanticColors.textError : semanticColors.textTertiary,
          }}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

