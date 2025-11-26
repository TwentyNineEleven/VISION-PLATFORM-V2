import React, { useState, useRef, useEffect } from 'react';
import { semanticColors, radius, spacing } from '../theme';

export interface SliderProps {
  value?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  showValue?: boolean;
  marks?: Array<{ value: number; label?: string }>;
  className?: string;
  style?: React.CSSProperties;
}

export const Slider: React.FC<SliderProps> = ({
  value: controlledValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  helperText,
  error,
  disabled = false,
  showValue = true,
  marks,
  className = '',
  style,
}) => {
  const [internalValue, setInternalValue] = useState<number | [number, number]>(controlledValue !== undefined ? controlledValue : min);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isRange = Array.isArray(internalValue);
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  const handleMouseDown = (e: React.MouseEvent, index?: number) => {
    if (disabled) return;
    setIsDragging(true);
    handleMove(e, index);
  };

  const handleMove = (e: MouseEvent | React.MouseEvent, index?: number) => {
    if (!sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const rawValue = min + percent * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    if (isRange && index !== undefined) {
      const [start, end] = currentValue as [number, number];
      const newValue: [number, number] = index === 0
        ? [Math.min(clampedValue, end), end]
        : [start, Math.max(clampedValue, start)];
      if (controlledValue === undefined) setInternalValue(newValue);
      onChange?.(newValue);
    } else {
      if (controlledValue === undefined) setInternalValue(clampedValue);
      onChange?.(clampedValue);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleMove(e);
    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentValue, min, max, step]);

  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

  const trackStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '6px',
    backgroundColor: disabled ? semanticColors.borderTertiary : semanticColors.borderPrimary,
    borderRadius: radius.full,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const fillStyle: React.CSSProperties = {
    position: 'absolute',
    height: '100%',
    backgroundColor: disabled ? semanticColors.textTertiary : semanticColors.fillPrimary,
    borderRadius: radius.full,
    transition: isDragging ? 'none' : 'width 0.2s ease',
  };

  if (isRange) {
    const [start, end] = currentValue as [number, number];
    fillStyle.left = `${getPercent(start)}%`;
    fillStyle.width = `${getPercent(end) - getPercent(start)}%`;
  } else {
    fillStyle.width = `${getPercent(currentValue as number)}%`;
  }

  const thumbStyle = (val: number): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    left: `${getPercent(val)}%`,
    transform: 'translate(-50%, -50%)',
    width: '18px',
    height: '18px',
    backgroundColor: disabled ? semanticColors.textTertiary : semanticColors.fillPrimary,
    border: `2px solid ${semanticColors.backgroundSurface}`,
    borderRadius: radius.round,
    cursor: disabled ? 'not-allowed' : 'grab',
    boxShadow: 'var(--shadow-sm)',
    transition: isDragging ? 'none' : 'all 0.2s ease',
  });

  return (
    <div className={className} style={{ width: '100%', ...style }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
          <label
            style={{
              fontFamily: 'var(--font-family-body)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)',
              color: error ? semanticColors.textError : semanticColors.textSecondary,
            }}
          >
            {label}
          </label>
          {showValue && (
            <span
              style={{
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--font-size-sm)',
                color: semanticColors.textPrimary,
              }}
            >
              {isRange
                ? `${(currentValue as [number, number])[0]} - ${(currentValue as [number, number])[1]}`
                : currentValue}
            </span>
          )}
        </div>
      )}
      <div
        ref={sliderRef}
        style={trackStyle}
        onMouseDown={(e) => handleMouseDown(e)}
      >
        <div style={fillStyle} />
        {isRange ? (
          <>
            <div
              style={thumbStyle((currentValue as [number, number])[0])}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, 0);
              }}
            />
            <div
              style={thumbStyle((currentValue as [number, number])[1])}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, 1);
              }}
            />
          </>
        ) : (
          <div
            style={thumbStyle(currentValue as number)}
            onMouseDown={(e) => e.stopPropagation()}
          />
        )}
        {marks && (
          <div style={{ position: 'absolute', top: '100%', width: '100%', marginTop: spacing.xs }}>
            {marks.map((mark) => (
              <div
                key={mark.value}
                style={{
                  position: 'absolute',
                  left: `${getPercent(mark.value)}%`,
                  transform: 'translateX(-50%)',
                  fontSize: 'var(--font-size-xs)',
                  color: semanticColors.textTertiary,
                }}
              >
                {mark.label || mark.value}
              </div>
            ))}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <div
          style={{
            marginTop: spacing.md,
            fontSize: 'var(--font-size-sm)',
            color: error ? semanticColors.textError : semanticColors.textTertiary,
          }}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

