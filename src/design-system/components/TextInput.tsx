import React, { InputHTMLAttributes, useState, ReactNode } from 'react';
import { semanticColors, radius, spacing, spacingPatterns, focusShadow } from '../theme';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  floatingLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  helperText,
  error,
  required,
  leftAddon,
  rightAddon,
  floatingLabel = false,
  size = 'md',
  className = '',
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  const sizeStyles = {
    sm: { padding: `${spacing.sm} ${spacing.lg}`, fontSize: 'var(--font-size-sm)', height: '32px' },
    md: { padding: spacingPatterns.inputPaddingY + ' ' + spacingPatterns.inputPaddingX, fontSize: 'var(--font-size-md)', height: '40px' },
    lg: { padding: `${spacing['2xl']} ${spacing['3xl']}`, fontSize: 'var(--font-size-md)', height: '48px' },
  };

  const inputStyle: React.CSSProperties = {
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
    boxShadow: error
      ? focusShadow.error
      : isFocused
      ? focusShadow.subtle
      : 'none',
    ...sizeStyles[size],
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    position: floatingLabel && (isFocused || hasValue) ? 'absolute' : 'static',
    top: floatingLabel && (isFocused || hasValue) ? '0' : 'auto',
    left: floatingLabel && (isFocused || hasValue) ? '12px' : 'auto',
    backgroundColor: floatingLabel && (isFocused || hasValue) ? semanticColors.backgroundSurface : 'transparent',
    padding: floatingLabel && (isFocused || hasValue) ? '0 4px' : '0',
    zIndex: floatingLabel && (isFocused || hasValue) ? 3 : 'auto',
    fontFamily: 'var(--font-family-body)',
    fontWeight: 'var(--font-weight-medium)',
    fontSize: floatingLabel && (isFocused || hasValue) ? 'var(--font-size-xs)' : sizeStyles[size].fontSize,
    color: error
      ? semanticColors.textError
      : isFocused
      ? semanticColors.textBrand
      : semanticColors.textTertiary,
    marginBottom: floatingLabel ? '0' : spacing.xs,
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {label && (
        <label style={labelStyle}>
          {label}
          {required && (
            <span style={{ color: semanticColors.textError, marginLeft: spacing.xs }}>*</span>
          )}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.lg,
            ...inputStyle,
            padding: undefined,
          }}
        >
          {leftAddon && (
            <span style={{ display: 'flex', alignItems: 'center' }}>{leftAddon}</span>
          )}
          <input
            {...props}
            style={{
              ...inputStyle,
              border: 'none',
              flex: 1,
              padding: leftAddon || rightAddon ? '0' : inputStyle.padding,
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={error || helperText ? `${props.id || 'input'}-helper` : undefined}
          />
          {rightAddon && (
            <span style={{ display: 'flex', alignItems: 'center' }}>{rightAddon}</span>
          )}
        </div>
      </div>
      {(error || helperText) && (
        <div
          id={`${props.id || 'input'}-helper`}
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

export const TextArea: React.FC<Omit<TextInputProps, 'leftAddon' | 'rightAddon'> & { rows?: number }> = ({
  rows = 4,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    props.onFocus?.(e as any);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    props.onBlur?.(e as any);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e as any);
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: semanticColors.backgroundSurface,
    border: props.error
      ? `1px solid ${semanticColors.borderError}`
      : `1px solid ${semanticColors.borderPrimary}`,
    borderRadius: radius.sm,
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-md)',
    lineHeight: 'var(--line-height-md)',
    color: semanticColors.textPrimary,
    padding: spacingPatterns.inputPaddingY + ' ' + spacingPatterns.inputPaddingX,
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: props.error
      ? focusShadow.error
      : isFocused
      ? focusShadow.subtle
      : 'none',
    resize: 'vertical',
    minHeight: `${rows * 24}px`,
    ...props.style,
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {props.label && (
        <label
          style={{
            fontFamily: 'var(--font-family-body)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
            color: props.error
              ? semanticColors.textError
              : semanticColors.textSecondary,
            marginBottom: spacing.xs,
          }}
        >
          {props.label}
          {props.required && (
            <span style={{ color: semanticColors.textError, marginLeft: spacing.xs }}>*</span>
          )}
        </label>
      )}
      <textarea
        {...(props as any)}
        rows={rows}
        style={textareaStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        aria-invalid={!!props.error}
        aria-describedby={props.error || props.helperText ? `${props.id || 'textarea'}-helper` : undefined}
      />
      {(props.error || props.helperText) && (
        <div
          id={`${props.id || 'textarea'}-helper`}
          style={{
            marginTop: spacing.md,
            fontSize: 'var(--font-size-sm)',
            lineHeight: 'var(--line-height-sm)',
            color: props.error ? semanticColors.textError : semanticColors.textTertiary,
          }}
        >
          {props.error || props.helperText}
        </div>
      )}
    </div>
  );
};

