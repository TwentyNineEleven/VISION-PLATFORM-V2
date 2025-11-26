import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { semanticColors, colors, radius, spacing, shadows, zIndex } from '../theme';
import { Icon } from '../icons/Icon';

export interface Toast {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const typeStyles = {
    info: { bg: colors.blue.light, border: colors.blue.mid, icon: 'info' as const },
    success: { bg: colors.green.light, border: colors.emeraldGreen, icon: 'check' as const },
    warning: { bg: colors.orange.light, border: colors.vibrantOrange, icon: 'alert' as const },
    error: { bg: semanticColors.backgroundErrorLight, border: semanticColors.fillError, icon: 'alert' as const },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: spacing['3xl'],
          right: spacing['3xl'],
          zIndex: zIndex.toast,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.md,
        }}
      >
        {toasts.map((toast) => {
          const style = typeStyles[toast.type || 'info'];
          return (
            <div
              key={toast.id}
              style={{
                backgroundColor: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: radius.md,
                padding: spacing.lg,
                boxShadow: shadows.lg,
                minWidth: '300px',
                maxWidth: '400px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: spacing.md,
                animation: 'slideIn 0.3s ease',
              }}
            >
              <Icon name={style.icon} size={20} color={style.border} />
              <div style={{ flex: 1, fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)', color: semanticColors.textPrimary }}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Close"
              >
                <Icon name="close" size={16} color={semanticColors.textSecondary} />
              </button>
              <style>{`
                @keyframes slideIn {
                  from {
                    transform: translateX(100%);
                    opacity: 0;
                  }
                  to {
                    transform: translateX(0);
                    opacity: 1;
                  }
                }
              `}</style>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

