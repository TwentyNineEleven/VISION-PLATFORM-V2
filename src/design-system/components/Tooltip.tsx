import React, { useState, useRef, useEffect, ReactNode, CSSProperties } from 'react';
import { semanticColors, colors, radius, spacing, shadows, zIndex } from '../theme';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
  className = '',
  style,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - gap;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + gap;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - gap;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + gap;
        break;
    }

    setPosition({ top, left });
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setTimeout(updatePosition, 0);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  const tooltipStyle: CSSProperties = {
    position: 'fixed',
    top: position.top,
    left: position.left,
    backgroundColor: colors.gray.dark,
    color: semanticColors.textInverse,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: radius.sm,
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-xs)',
    lineHeight: 'var(--line-height-xs)',
    boxShadow: shadows.md,
    zIndex: zIndex.tooltip,
    pointerEvents: 'none',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.2s ease',
    whiteSpace: 'nowrap',
    maxWidth: '200px',
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={className}
        style={{ display: 'inline-block', ...style }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isVisible && (
        <div ref={tooltipRef} style={tooltipStyle} role="tooltip">
          {content}
        </div>
      )}
    </>
  );
};

