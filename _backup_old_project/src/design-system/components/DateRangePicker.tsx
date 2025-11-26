import React from 'react';
import { DatePicker } from './DatePicker';
import { spacing } from '../theme';
import { HStack } from '../primitives/Stack';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  min?: Date;
  max?: Date;
  startPlaceholder?: string;
  endPlaceholder?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value = { start: null, end: null },
  onChange,
  label,
  helperText,
  error,
  required,
  min,
  max,
  startPlaceholder = 'Start date',
  endPlaceholder = 'End date',
  size = 'md',
  className = '',
  style,
}) => {
  const handleStartChange = (date: Date | null) => {
    onChange?.({ start: date, end: value?.end || null });
  };

  const handleEndChange = (date: Date | null) => {
    onChange?.({ start: value?.start || null, end: date });
  };

  const endMin = value?.start || min;

  return (
    <div className={className} style={{ width: '100%', ...style }}>
      {label && (
        <label
          style={{
            fontFamily: 'var(--font-family-body)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
            marginBottom: spacing.xs,
            display: 'block',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--color-text-error)', marginLeft: spacing.xs }}>*</span>}
        </label>
      )}
      <HStack gap="md" style={{ width: '100%' }}>
        <DatePicker
          value={value?.start}
          onChange={handleStartChange}
          placeholder={startPlaceholder}
          min={min}
          max={value?.end || max}
          size={size}
          style={{ flex: 1 }}
        />
        <DatePicker
          value={value?.end}
          onChange={handleEndChange}
          placeholder={endPlaceholder}
          min={endMin}
          max={max}
          size={size}
          style={{ flex: 1 }}
        />
      </HStack>
      {(error || helperText) && (
        <div
          style={{
            marginTop: spacing.md,
            fontSize: 'var(--font-size-sm)',
            color: error ? 'var(--color-text-error)' : 'var(--color-text-tertiary)',
          }}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

