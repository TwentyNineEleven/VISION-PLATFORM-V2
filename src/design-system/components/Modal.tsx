import React, { ReactNode, CSSProperties, useEffect, useRef } from 'react';
import { semanticColors, radius, shadows, spacing } from '../theme';
import { Icon } from '../icons/Icon';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  style?: CSSProperties;
}

const sizeMap = {
  sm: '400px',
  md: '500px',
  lg: '700px',
  xl: '900px',
  full: '95vw',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEsc = true,
  className = '',
  style,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Save currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Focus modal content
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus to previous element
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEsc, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: semanticColors.backgroundOverlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: spacing['3xl'],
  };

  const modalStyle: CSSProperties = {
    backgroundColor: semanticColors.backgroundSurface,
    borderRadius: radius.lg,
    boxShadow: shadows['2xl'],
    width: sizeMap[size],
    maxWidth: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    ...style,
  };

  return (
    <div className={className} style={overlayStyle} onClick={handleBackdropClick}>
      <div
        ref={modalRef}
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
      >
        {title && (
          <div
            style={{
              padding: spacing['3xl'],
              borderBottom: `1px solid ${semanticColors.borderPrimary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2
              id="modal-title"
              style={{
                fontFamily: 'var(--font-family-heading)',
                fontWeight: 'var(--font-weight-bold)',
                fontSize: 'var(--font-size-xl)',
                color: semanticColors.textPrimary,
                margin: 0,
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: spacing.xs,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close modal"
            >
              <Icon name="close" size={20} color={semanticColors.textSecondary} />
            </button>
          </div>
        )}
        <div
          style={{
            padding: spacing['3xl'],
            overflow: 'auto',
            flex: 1,
          }}
        >
          {children}
        </div>
        {footer && (
          <div
            style={{
              padding: spacing['3xl'],
              borderTop: `1px solid ${semanticColors.borderPrimary}`,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

