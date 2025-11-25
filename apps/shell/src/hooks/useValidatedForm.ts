/**
 * useValidatedForm Hook
 * Enterprise-grade form validation with Zod
 */

import { useState, useCallback, useMemo } from 'react';
import type { ZodSchema, ZodError } from 'zod';

export interface FieldError {
  message: string;
  path: string[];
}

export interface UseValidatedFormOptions<T> {
  schema: ZodSchema<T>;
  initialValues: Partial<T>;
  onSubmit?: (values: T) => Promise<void> | void;
}

export interface UseValidatedFormReturn<T> {
  values: Partial<T>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  setTouched: (field: string) => void;
  validate: () => boolean;
  validateField: (field: string) => string | null;
  handleSubmit: (e?: React.FormEvent) => Promise<boolean>;
  reset: (newValues?: Partial<T>) => void;
  getFieldProps: (field: string) => {
    value: unknown;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: () => void;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
  };
}

export function useValidatedForm<T extends Record<string, unknown>>({
  schema,
  initialValues,
  onSubmit,
}: UseValidatedFormOptions<T>): UseValidatedFormReturn<T> {
  const [values, setValuesState] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialSnapshot] = useState(initialValues);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialSnapshot);
  }, [values, initialSnapshot]);

  const parseZodErrors = useCallback((error: ZodError): Record<string, string> => {
    const fieldErrors: Record<string, string> = {};
    error.errors.forEach((err) => {
      const path = err.path.join('.');
      if (!fieldErrors[path]) {
        fieldErrors[path] = err.message;
      }
    });
    return fieldErrors;
  }, []);

  const validateField = useCallback(
    (field: string): string | null => {
      try {
        // Create a partial schema for single field validation
        const fieldValue = values[field as keyof T];
        const result = schema.safeParse(values);

        if (!result.success) {
          const fieldError = result.error.errors.find(
            (err) => err.path.join('.') === field
          );
          return fieldError?.message || null;
        }
        return null;
      } catch {
        return null;
      }
    },
    [schema, values]
  );

  const validate = useCallback((): boolean => {
    const result = schema.safeParse(values);
    if (!result.success) {
      setErrors(parseZodErrors(result.error));
      return false;
    }
    setErrors({});
    return true;
  }, [schema, values, parseZodErrors]);

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValuesState((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  const setTouched = useCallback((field: string) => {
    setTouchedState((prev) => ({ ...prev, [field]: true }));
    // Validate field on blur
    const error = validateField(field);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  }, [validateField]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent): Promise<boolean> => {
      e?.preventDefault();

      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(values).forEach((key) => {
        allTouched[key] = true;
      });
      setTouchedState(allTouched);

      if (!validate()) {
        return false;
      }

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values as T);
          return true;
        } catch (error) {
          console.error('Form submission error:', error);
          return false;
        } finally {
          setIsSubmitting(false);
        }
      }

      return true;
    },
    [values, validate, onSubmit]
  );

  const reset = useCallback((newValues?: Partial<T>) => {
    setValuesState(newValues || initialValues);
    setErrors({});
    setTouchedState({});
  }, [initialValues]);

  const getFieldProps = useCallback(
    (field: string) => ({
      value: values[field as keyof T] ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        let value: unknown;

        if (target.type === 'checkbox') {
          value = (target as HTMLInputElement).checked;
        } else if (target.type === 'number') {
          value = target.value === '' ? undefined : Number(target.value);
        } else {
          value = target.value;
        }

        setValue(field as keyof T, value as T[keyof T]);
      },
      onBlur: () => setTouched(field),
      'aria-invalid': Boolean(errors[field] && touched[field]),
      'aria-describedby': errors[field] && touched[field] ? `${field}-error` : undefined,
    }),
    [values, errors, touched, setValue, setTouched]
  );

  const isValid = useMemo(() => {
    const result = schema.safeParse(values);
    return result.success;
  }, [schema, values]);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    isDirty,
    setValue,
    setValues,
    setTouched,
    validate,
    validateField,
    handleSubmit,
    reset,
    getFieldProps,
  };
}
