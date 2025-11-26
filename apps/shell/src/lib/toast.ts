import { toast as sonnerToast } from 'sonner';

/**
 * Toast notification helpers
 * Wraps Sonner toast with consistent styling and behavior
 */

export const toast = {
  /**
   * Show a success toast
   */
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
    });
  },

  /**
   * Show an error toast
   */
  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
    });
  },

  /**
   * Show an info toast
   */
  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
    });
  },

  /**
   * Show a warning toast
   */
  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
    });
  },

  /**
   * Show a loading toast that can be updated
   */
  loading: (message: string, description?: string) => {
    return sonnerToast.loading(message, {
      description,
    });
  },

  /**
   * Show a promise toast that automatically updates based on promise state
   */
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },

  /**
   * Custom toast with full control
   */
  custom: (message: string, options?: any) => {
    return sonnerToast(message, options);
  },
};

/**
 * API error toast helper
 * Displays user-friendly error messages from API responses
 */
export function showApiError(error: any, defaultMessage = 'An error occurred') {
  const message = error?.message || error?.error || defaultMessage;
  toast.error('Error', message);
}

/**
 * Form validation error toast
 */
export function showValidationError(message = 'Please check your input') {
  toast.error('Validation Error', message);
}
