import React, { useState, useRef, useEffect, ReactNode, CSSProperties } from 'react';
import { semanticColors, radius, spacing, shadows, zIndex } from '../theme';
import { Icon } from '../icons/Icon';

export interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  title?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  title,
  placement = 'bottom',
  onClose,
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!containerRef.current || !popoverRef.current) return;

    const triggerRect = containerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - popoverRect.height - gap;
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + gap;
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        left = triggerRect.left - popoverRect.width - gap;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        left = triggerRect.right + gap;
        break;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const popoverStyle: CSSProperties = {
    position: 'fixed',
    top: position.top,
    left: position.left,
    backgroundColor: semanticColors.backgroundSurface,
    border: `1px solid ${semanticColors.borderPrimary}`,
    borderRadius: radius.md,
    boxShadow: shadows.lg,
    zIndex: zIndex.popover,
    minWidth: '200px',
    maxWidth: '400px',
  };

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>
      {isOpen && (
        <div ref={popoverRef} style={popoverStyle}>
          {title && (
            <div
              style={{
                padding: spacing.lg,
                borderBottom: `1px solid ${semanticColors.borderPrimary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-family-heading)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: 'var(--font-size-md)',
                  color: semanticColors.textPrimary,
                }}
              >
                {title}
              </div>
              {onClose && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onClose();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: spacing.xs,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label="Close"
                >
                  <Icon name="close" size={16} color={semanticColors.textSecondary} />
                </button>
              )}
            </div>
          )}
          <div style={{ padding: spacing.lg }}>{content}</div>
        </div>
      )}
    </div>
  );
};

