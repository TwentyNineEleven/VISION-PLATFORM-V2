import React, { useState, useRef, useEffect } from 'react';
import { semanticColors, radius, spacing, spacingPatterns } from '../theme';
import { Icon } from '../icons/Icon';
import { TextInput } from './TextInput';

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  min?: Date;
  max?: Date;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  helperText,
  error,
  required,
  min,
  max,
  placeholder = 'Select date...',
  size = 'md',
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (min && selectedDate < min) return;
    if (max && selectedDate > max) return;
    onChange?.(selectedDate);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = daysInMonth(currentMonth);
  const firstDay = firstDayOfMonth(currentMonth);
  const today = new Date();
  const selectedDate = value;

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', width: '100%', ...style }}>
      <TextInput
        label={label}
        helperText={helperText}
        error={error}
        required={required}
        placeholder={placeholder}
        size={size}
        value={formatDate(value ?? null)}
        readOnly
        rightAddon={<Icon name="chevronDown" size={20} color={semanticColors.textTertiary} />}
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      />
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: spacing.xs,
            backgroundColor: semanticColors.backgroundSurface,
            border: `1px solid ${semanticColors.borderPrimary}`,
            borderRadius: radius.md,
            boxShadow: 'var(--shadow-lg)',
            padding: spacing['3xl'],
            zIndex: 1000,
            minWidth: '300px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: spacing.xs,
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Previous month"
            >
              <Icon name="chevronLeft" size={20} color={semanticColors.textPrimary} />
            </button>
            <div
              style={{
                fontFamily: 'var(--font-family-body)',
                fontWeight: 'var(--font-weight-semibold)',
                fontSize: 'var(--font-size-md)',
                color: semanticColors.textPrimary,
              }}
            >
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: spacing.xs,
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Next month"
            >
              <Icon name="chevronRight" size={20} color={semanticColors.textPrimary} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: spacing.xs, marginBottom: spacing.xs }}>
            {dayNames.map((day) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontFamily: 'var(--font-family-body)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontSize: 'var(--font-size-xs)',
                  color: semanticColors.textTertiary,
                  padding: spacing.xs,
                }}
              >
                {day}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: spacing.xs }}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: days }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const isToday = date.toDateString() === today.toDateString();
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
              const isDisabled = (min && date < min) || (max && date > max);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => !isDisabled && handleDateSelect(day)}
                  disabled={isDisabled}
                  style={{
                    padding: spacing.md,
                    border: 'none',
                    borderRadius: radius.sm,
                    backgroundColor: isSelected
                      ? semanticColors.fillPrimary
                      : isToday
                      ? semanticColors.backgroundSurfaceSecondary
                      : 'transparent',
                    color: isSelected
                      ? semanticColors.textInverse
                      : isDisabled
                      ? semanticColors.textTertiary
                      : semanticColors.textPrimary,
                    fontFamily: 'var(--font-family-body)',
                    fontSize: 'var(--font-size-sm)',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.5 : 1,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled && !isSelected) {
                      e.currentTarget.style.backgroundColor = semanticColors.backgroundSurfaceSecondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && !isToday) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

