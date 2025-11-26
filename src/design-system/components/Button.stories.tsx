import type { Meta, StoryObj } from '@storybook/react';
import { Button, IconButton, ButtonGroup } from './Button';
import { Icon } from '../icons/Icon';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component with multiple variants and sizes. Uses 2911 brand colors.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'accent', 'secondary', 'subtle', 'destructive'],
      description: 'Button variant style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make button full width',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Accent: Story = {
  args: {
    children: 'Accent Button',
    variant: 'accent',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
  },
};

export const Subtle: Story = {
  args: {
    children: 'Subtle Button',
    variant: 'subtle',
    size: 'md',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <Button leftIcon={<Icon name="plus" size={20} />}>Add Item</Button>
      <Button rightIcon={<Icon name="arrowRight" size={20} />}>Continue</Button>
      <Button leftIcon={<Icon name="download" size={20} />} rightIcon={<Icon name="arrowRight" size={20} />}>
        Download & Continue
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    isLoading: true,
    variant: 'primary',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    variant: 'primary',
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
    variant: 'primary',
  },
};

export const IconButtonExample: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <IconButton icon={<Icon name="edit" size={20} />} aria-label="Edit" />
      <IconButton icon={<Icon name="trash" size={20} />} aria-label="Delete" variant="destructive" />
      <IconButton icon={<Icon name="download" size={20} />} aria-label="Download" variant="secondary" />
    </div>
  ),
};

export const ButtonGroupExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <ButtonGroup>
        <Button variant="primary">Save</Button>
        <Button variant="secondary">Cancel</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical">
        <Button variant="primary">Option 1</Button>
        <Button variant="secondary">Option 2</Button>
        <Button variant="subtle">Option 3</Button>
      </ButtonGroup>
    </div>
  ),
};

