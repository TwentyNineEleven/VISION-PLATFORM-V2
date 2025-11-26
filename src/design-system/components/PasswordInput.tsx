import React, { InputHTMLAttributes, useState } from 'react';
import { TextInput, TextInputProps } from './TextInput';
import { Icon } from '../icons/Icon';
import { semanticColors } from '../theme';

export interface PasswordInputProps extends Omit<TextInputProps, 'type' | 'rightAddon'> {
  showToggle?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  showToggle = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      {...props}
      type={showPassword ? 'text' : 'password'}
      rightAddon={
        showToggle ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon
              name={showPassword ? 'eyeOff' : 'eye'}
              size={20}
              color={semanticColors.textTertiary}
            />
          </button>
        ) : undefined
      }
    />
  );
};

