/**
 * GlowFormField Component
 * Form field wrapper with label, error display, and accessibility
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface GlowFormFieldProps {
  label: string;
  name: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function GlowFormField({
  label,
  name,
  error,
  touched,
  required,
  hint,
  children,
  className = '',
}: GlowFormFieldProps) {
  const showError = error && touched;
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {hint && !showError && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}

      {children}

      {showError && (
        <div
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-sm text-red-600"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Inline error display for compact forms
 */
export function GlowFieldError({
  error,
  touched,
  name,
}: {
  error?: string;
  touched?: boolean;
  name: string;
}) {
  if (!error || !touched) return null;

  return (
    <p
      id={`${name}-error`}
      role="alert"
      className="mt-1 flex items-center gap-1 text-xs text-red-600"
    >
      <AlertCircle className="h-3 w-3" />
      {error}
    </p>
  );
}
