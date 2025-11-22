import React, { InputHTMLAttributes } from 'react';
import { TextInput, TextInputProps } from './TextInput';
import { Icon } from '../icons/Icon';
import { semanticColors } from '../theme';

export interface SearchInputProps extends Omit<TextInputProps, 'leftAddon' | 'type'> {
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onClear,
  showClearButton = true,
  value,
  onChange,
  ...props
}) => {
  const hasValue = !!value;

  return (
    <TextInput
      {...props}
      type="search"
      leftAddon={<Icon name="search" size={20} color={semanticColors.textTertiary} />}
      rightAddon={
        showClearButton && hasValue ? (
          <button
            type="button"
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Clear search"
          >
            <Icon name="close" size={16} color={semanticColors.textTertiary} />
          </button>
        ) : undefined
      }
      value={value}
      onChange={onChange}
    />
  );
};

