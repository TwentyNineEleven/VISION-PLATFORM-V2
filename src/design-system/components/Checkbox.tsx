import React, { InputHTMLAttributes, ReactNode } from 'react';
import { semanticColors, radius, spacing } from '../theme';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  size = 'md',
  className = '',
  style,
  ...props
}) => {
  const sizeMap = { sm: 16, md: 20, lg: 24 };
  const checkboxSize = sizeMap[size];

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.6 : 1,
        ...style,
      }}
      className={className}
    >
      <input
        type="checkbox"
        {...props}
        style={{
          width: checkboxSize,
          height: checkboxSize,
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          accentColor: semanticColors.fillPrimary,
        }}
      />
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

export interface CheckboxGroupProps {
  children: ReactNode;
  label?: string;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  children,
  label,
  error,
  className = '',
  style,
}) => {
  return (
    <div className={className} style={style}>
      {label && (
        <div
          style={{
            marginBottom: spacing.sm,
            fontFamily: 'var(--font-family-body)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
            color: error ? semanticColors.textError : semanticColors.textPrimary,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {children}
      </div>
      {error && (
        <div
          style={{
            marginTop: spacing.xs,
            fontSize: 'var(--font-size-sm)',
            color: semanticColors.textError,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Radio: React.FC<RadioProps> = ({
  label,
  size = 'md',
  className = '',
  style,
  ...props
}) => {
  const sizeMap = { sm: 16, md: 20, lg: 24 };
  const radioSize = sizeMap[size];

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.6 : 1,
        ...style,
      }}
      className={className}
    >
      <input
        type="radio"
        {...props}
        style={{
          width: radioSize,
          height: radioSize,
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          accentColor: semanticColors.fillPrimary,
        }}
      />
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

export interface RadioGroupProps {
  children: ReactNode;
  label?: string;
  error?: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  children,
  label,
  error,
  name,
  value,
  onChange,
  className = '',
  style,
}) => {
  return (
    <div className={className} style={style}>
      {label && (
        <div
          style={{
            marginBottom: spacing.sm,
            fontFamily: 'var(--font-family-body)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
            color: error ? semanticColors.textError : semanticColors.textPrimary,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              name,
              checked: child.props.value === value,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                onChange?.(e.target.value);
              },
            });
          }
          return child;
        })}
      </div>
      {error && (
        <div
          style={{
            marginTop: spacing.xs,
            fontSize: 'var(--font-size-sm)',
            color: semanticColors.textError,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

