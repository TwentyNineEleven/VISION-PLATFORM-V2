import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { semanticColors, radius, spacing, spacingPatterns } from '../theme';
import { Icon } from '../icons/Icon';
import { Tag } from './Tag';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  label,
  helperText,
  error,
  required,
  placeholder = 'Select options...',
  size = 'md',
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeStyles = {
    sm: { padding: `${spacing.sm} ${spacing.lg}`, fontSize: 'var(--font-size-sm)', height: '32px' },
    md: { padding: spacingPatterns.inputPaddingY + ' ' + spacingPatterns.inputPaddingX, fontSize: 'var(--font-size-md)', height: '40px' },
    lg: { padding: `${spacing['2xl']} ${spacing['3xl']}`, fontSize: 'var(--font-size-md)', height: '48px' },
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  };

  const handleRemove = (optionValue: string) => {
    onChange?.(value.filter((v) => v !== optionValue));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: '100%', ...style }}
    >
      {label && (
        <label
          style={{
            fontFamily: 'var(--font-family-body)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
            color: error ? semanticColors.textError : semanticColors.textSecondary,
            marginBottom: spacing.xs,
          }}
        >
          {label}
          {required && (
            <span style={{ color: semanticColors.textError, marginLeft: spacing.xs }}>*</span>
          )}
        </label>
      )}
      <div
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          onClick={() => {
            setIsOpen(!isOpen);
            inputRef.current?.focus();
          }}
          style={{
            width: '100%',
            minHeight: sizeStyles[size].height,
            backgroundColor: semanticColors.backgroundSurface,
            border: error
              ? `2px solid ${semanticColors.borderError}`
              : `1px solid ${semanticColors.borderPrimary}`,
            borderRadius: radius.sm,
            padding: spacing.xs,
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing.xs,
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <Tag
                key={option.value}
                variant="primary"
                size="sm"
                onClose={() => handleRemove(option.value)}
              >
                {option.label}
              </Tag>
            ))
          ) : (
            <span
              style={{
                color: semanticColors.textTertiary,
                fontSize: sizeStyles[size].fontSize,
                padding: `0 ${spacing.xs}`,
              }}
            >
              {placeholder}
            </span>
          )}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            style={{
              flex: 1,
              minWidth: '120px',
              border: 'none',
              outline: 'none',
              fontSize: sizeStyles[size].fontSize,
              fontFamily: 'var(--font-family-body)',
              color: semanticColors.textPrimary,
              background: 'transparent',
            }}
            placeholder={selectedOptions.length === 0 ? placeholder : ''}
          />
          <Icon
            name={isOpen ? 'chevronUp' : 'chevronDown'}
            size={20}
            color={semanticColors.textTertiary}
          />
        </div>
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: spacing.xs,
              backgroundColor: semanticColors.backgroundSurface,
              border: `1px solid ${semanticColors.borderPrimary}`,
              borderRadius: radius.md,
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000,
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => !option.disabled && handleToggle(option.value)}
                  style={{
                    padding: `${spacing.md} ${spacing.lg}`,
                    cursor: option.disabled ? 'not-allowed' : 'pointer',
                    backgroundColor: value.includes(option.value)
                      ? semanticColors.backgroundSurfaceSecondary
                      : 'transparent',
                    opacity: option.disabled ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!option.disabled && !value.includes(option.value)) {
                      e.currentTarget.style.backgroundColor = semanticColors.backgroundSurfaceSecondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!value.includes(option.value)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    disabled={option.disabled}
                    readOnly
                    style={{ cursor: 'pointer' }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-family-body)',
                      fontSize: 'var(--font-size-md)',
                      color: semanticColors.textPrimary,
                    }}
                  >
                    {option.label}
                  </span>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: spacing['3xl'],
                  textAlign: 'center',
                  color: semanticColors.textTertiary,
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                No options found
              </div>
            )}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <div
          style={{
            marginTop: spacing.md,
            fontSize: 'var(--font-size-sm)',
            lineHeight: 'var(--line-height-sm)',
            color: error ? semanticColors.textError : semanticColors.textTertiary,
          }}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

