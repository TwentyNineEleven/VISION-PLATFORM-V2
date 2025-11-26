import React, { ReactNode, CSSProperties } from 'react';
import { semanticColors, spacing } from '../theme';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  helperText,
  error,
  children,
  id,
  className = '',
  style,
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = `${fieldId}-helper`;
  const hasError = !!error;

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {label && (
        <label
          htmlFor={fieldId}
          style={{
            fontFamily: 'var(--font-family-body)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
            color: hasError ? semanticColors.textError : semanticColors.textSecondary,
            marginBottom: spacing.xs,
          }}
        >
          {label}
          {required && (
            <span style={{ color: semanticColors.textError, marginLeft: spacing.xs }}>*</span>
          )}
        </label>
      )}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            id: fieldId,
            'aria-describedby': (error || helperText) ? helperId : undefined,
            'aria-invalid': hasError,
            error: hasError ? error : undefined,
          })
        : children}
      {(error || helperText) && (
        <div
          id={helperId}
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

export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
  style,
}) => {
  return (
    <div className={className} style={{ marginBottom: spacing['6xl'], ...style }}>
      <h3
        style={{
          fontFamily: 'var(--font-family-heading)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-primary)',
          marginBottom: description ? spacing.sm : spacing['3xl'],
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-md)',
            color: 'var(--color-text-secondary)',
            marginBottom: spacing['3xl'],
          }}
        >
          {description}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['3xl'] }}>
        {children}
      </div>
    </div>
  );
};

export interface FormActionsProps {
  children: ReactNode;
  align?: 'left' | 'right' | 'center' | 'space-between';
  className?: string;
  style?: CSSProperties;
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  align = 'right',
  className = '',
  style,
}) => {
  const alignMap = {
    left: 'flex-start',
    right: 'flex-end',
    center: 'center',
    'space-between': 'space-between',
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        gap: spacing.md,
        justifyContent: alignMap[align],
        marginTop: spacing['6xl'],
        paddingTop: spacing['3xl'],
        borderTop: `1px solid ${semanticColors.borderPrimary}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

