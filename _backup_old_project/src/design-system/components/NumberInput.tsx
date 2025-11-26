import React, { InputHTMLAttributes, useState } from 'react';
import { semanticColors, radius, spacing, spacingPatterns } from '../theme';
import { Icon } from '../icons/Icon';

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  showSteppers?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  helperText,
  error,
  required,
  min,
  max,
  step = 1,
  showSteppers = true,
  size = 'md',
  className = '',
  style,
  value,
  onChange,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>('');
  const currentValue = value !== undefined ? String(value) : internalValue;

  const sizeStyles = {
    sm: { padding: `${spacing.sm} ${spacing.lg}`, fontSize: 'var(--font-size-sm)', height: '32px' },
    md: { padding: spacingPatterns.inputPaddingY + ' ' + spacingPatterns.inputPaddingX, fontSize: 'var(--font-size-md)', height: '40px' },
    lg: { padding: `${spacing['2xl']} ${spacing['3xl']}`, fontSize: 'var(--font-size-md)', height: '48px' },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(e);
  };

  const handleStep = (direction: 'up' | 'down') => {
    const numValue = parseFloat(currentValue) || 0;
    const newValue = direction === 'up' ? numValue + step : numValue - step;
    const clampedValue = min !== undefined && newValue < min ? min : max !== undefined && newValue > max ? max : newValue;
    
    const syntheticEvent = {
      target: { value: String(clampedValue) },
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(syntheticEvent);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: semanticColors.backgroundSurface,
    border: error
      ? `2px solid ${semanticColors.borderError}`
      : `1px solid ${semanticColors.borderPrimary}`,
    borderRadius: radius.sm,
    fontFamily: 'var(--font-family-body)',
    lineHeight: 'var(--line-height-md)',
    color: semanticColors.textPrimary,
    outline: 'none',
    transition: 'all 0.2s ease',
    ...sizeStyles[size],
    paddingRight: showSteppers ? '40px' : sizeStyles[size].padding,
    ...style,
  };

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          {...props}
          type="number"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          style={inputStyle}
          aria-invalid={!!error}
          aria-describedby={error || helperText ? `${props.id || 'number-input'}-helper` : undefined}
        />
        {showSteppers && (
          <div
            style={{
              position: 'absolute',
              right: spacing.xs,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => handleStep('up')}
              disabled={max !== undefined && parseFloat(currentValue) >= max}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: max !== undefined && parseFloat(currentValue) >= max ? 0.5 : 1,
              }}
              aria-label="Increment"
            >
              <Icon name="chevronUp" size={16} color={semanticColors.textSecondary} />
            </button>
            <button
              type="button"
              onClick={() => handleStep('down')}
              disabled={min !== undefined && parseFloat(currentValue) <= min}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: min !== undefined && parseFloat(currentValue) <= min ? 0.5 : 1,
              }}
              aria-label="Decrement"
            >
              <Icon name="chevronDown" size={16} color={semanticColors.textSecondary} />
            </button>
          </div>
        )}
      </div>
      {(error || helperText) && (
        <div
          id={`${props.id || 'number-input'}-helper`}
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

