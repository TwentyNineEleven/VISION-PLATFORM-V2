import React, { useState, KeyboardEvent } from 'react';
import { semanticColors, radius, spacing, spacingPatterns } from '../theme';
import { Tag } from './Tag';

export interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  maxTags?: number;
  separator?: string | RegExp;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  label,
  helperText,
  error,
  required,
  placeholder = 'Type and press Enter...',
  maxTags,
  separator = /[,\n]/,
  size = 'md',
  className = '',
  style,
}) => {
  const [inputValue, setInputValue] = useState('');

  const sizeStyles = {
    sm: { padding: `${spacing.sm} ${spacing.lg}`, fontSize: 'var(--font-size-sm)', height: '32px' },
    md: { padding: spacingPatterns.inputPaddingY + ' ' + spacingPatterns.inputPaddingX, fontSize: 'var(--font-size-md)', height: '40px' },
    lg: { padding: `${spacing['2xl']} ${spacing['3xl']}`, fontSize: 'var(--font-size-md)', height: '48px' },
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag || (maxTags && value.length >= maxTags)) return;
    if (value.includes(trimmedTag)) return;
    onChange?.([...value, trimmedTag]);
  };

  const removeTag = (tagToRemove: string) => {
    onChange?.(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || (typeof separator === 'string' && e.key === separator)) {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const tags = typeof separator === 'string'
      ? pastedText.split(separator)
      : pastedText.split(separator);
    tags.forEach((tag) => addTag(tag));
    setInputValue('');
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    ...style,
  };

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    alignItems: 'center',
    width: '100%',
    minHeight: sizeStyles[size].height,
    backgroundColor: semanticColors.backgroundSurface,
    border: error
      ? `2px solid ${semanticColors.borderError}`
      : `1px solid ${semanticColors.borderPrimary}`,
    borderRadius: radius.sm,
    padding: spacing.xs,
    transition: 'all 0.2s ease',
  };

  return (
    <div className={className} style={containerStyle}>
      {label && (
        <label
          style={{
            fontFamily: 'var(--font-family-body)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
            color: error ? semanticColors.textError : semanticColors.textSecondary,
            marginBottom: spacing.xs,
            display: 'block',
          }}
        >
          {label}
          {required && (
            <span style={{ color: semanticColors.textError, marginLeft: spacing.xs }}>*</span>
          )}
        </label>
      )}
      <div style={inputContainerStyle}>
        {value.map((tag) => (
          <Tag
            key={tag}
            variant="primary"
            size="sm"
            onClose={() => removeTag(tag)}
          >
            {tag}
          </Tag>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={maxTags !== undefined && value.length >= maxTags}
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
        />
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

