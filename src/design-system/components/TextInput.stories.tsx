import type { Meta, StoryObj } from '@storybook/react';
import { TextInput, TextArea } from './TextInput';
import { Icon } from '../icons/Icon';
import { useState } from 'react';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Text input component with floating labels, validation, and addon support. Based on Glow UI patterns.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    required: {
      control: 'boolean',
      description: 'Mark as required',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below input',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input',
    },
    floatingLabel: {
      control: 'boolean',
      description: 'Use floating label style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    helperText: 'Password must be at least 8 characters long',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    error: 'Please enter a valid email address',
    defaultValue: 'invalid-email',
  },
};

export const FloatingLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    floatingLabel: true,
  },
};

export const WithLeftAddon: Story = {
  args: {
    label: 'Website',
    placeholder: 'example.com',
    leftAddon: <span>https://</span>,
  },
};

export const WithRightAddon: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    rightAddon: <Icon name="eye" size={20} />,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    disabled: true,
    defaultValue: 'disabled@example.com',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      <TextInput label="Small" size="sm" placeholder="Small input" />
      <TextInput label="Medium" size="md" placeholder="Medium input" />
      <TextInput label="Large" size="lg" placeholder="Large input" />
    </div>
  ),
};

export const TextAreaExample: Story = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <TextArea
        label="Description"
        placeholder="Enter a description..."
        rows={6}
        helperText="Provide a detailed description of your program"
      />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
      const newErrors: Record<string, string> = {};
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    return (
      <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <TextInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
          error={errors.email}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
          error={errors.password}
          helperText="Must be at least 8 characters"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <TextInput
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          required
          error={errors.confirmPassword}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
        <button
          onClick={validate}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--color-fill-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          Submit
        </button>
      </div>
    );
  },
};

