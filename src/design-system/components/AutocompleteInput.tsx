import React, { useState, useRef, useEffect } from 'react';
import { semanticColors, radius, spacing, spacingPatterns } from '../theme';
import { TextInput } from './TextInput';

export interface AutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AutocompleteInputProps {
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: AutocompleteOption) => void;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  filterOptions?: (options: AutocompleteOption[], inputValue: string) => AutocompleteOption[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

const defaultFilter = (options: AutocompleteOption[], inputValue: string): AutocompleteOption[] => {
  if (!inputValue) return options;
  const lowerInput = inputValue.toLowerCase();
  return options.filter((option) =>
    option.label.toLowerCase().includes(lowerInput) ||
    option.value.toLowerCase().includes(lowerInput)
  );
};

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  options,
  value = '',
  onChange,
  onSelect,
  label,
  helperText,
  error,
  required,
  placeholder = 'Type to search...',
  filterOptions = defaultFilter,
  size = 'md',
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredOptions = filterOptions(options, value);
  const showDropdown = isOpen && filteredOptions.length > 0;

  const handleSelect = (option: AutocompleteOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    onSelect?.(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: '100%', ...style }}
    >
      <TextInput
        label={label}
        helperText={helperText}
        error={error}
        required={required}
        placeholder={placeholder}
        size={size}
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {showDropdown && (
        <div
          ref={listRef}
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
          {filteredOptions.map((option, index) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              style={{
                padding: `${spacing.md} ${spacing.lg}`,
                cursor: option.disabled ? 'not-allowed' : 'pointer',
                backgroundColor:
                  index === highlightedIndex
                    ? semanticColors.backgroundSurfaceSecondary
                    : 'transparent',
                opacity: option.disabled ? 0.5 : 1,
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--font-size-md)',
                color: semanticColors.textPrimary,
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

