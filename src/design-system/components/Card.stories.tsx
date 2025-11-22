import type { Meta, StoryObj } from '@storybook/react';
import { Card, StatCard } from './Card';
import { Button } from './Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Card component with optional header and footer slots. Used for content containers.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'boolean',
      description: 'Add padding to card content',
    },
    elevation: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Shadow elevation level',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: 'This is a basic card with some content. Cards are used to group related content together.',
    padding: true,
  },
};

export const WithHeader: Story = {
  args: {
    header: <h2 style={{ margin: 0, fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>Card Title</h2>,
    children: 'Card content goes here. This card has a header section.',
    padding: true,
  },
};

export const WithFooter: Story = {
  args: {
    children: 'Card content goes here. This card has a footer section with actions.',
    footer: (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    ),
    padding: true,
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    header: <h2 style={{ margin: 0, fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>Card Title</h2>,
    children: 'This card has both a header and footer. The header contains the title, and the footer contains action buttons.',
    footer: (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    ),
    padding: true,
  },
};

export const NoPadding: Story = {
  args: {
    children: 'This card has no padding. Useful for full-bleed content like images or custom layouts.',
    padding: false,
  },
};

export const ElevationLevels: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      <Card elevation="xs">Extra Small Shadow</Card>
      <Card elevation="sm">Small Shadow</Card>
      <Card elevation="md">Medium Shadow</Card>
      <Card elevation="lg">Large Shadow</Card>
      <Card elevation="xl">Extra Large Shadow</Card>
      <Card elevation="2xl">2X Large Shadow</Card>
    </div>
  ),
};

export const StatCardExample: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxWidth: '800px' }}>
      <StatCard
        label="Total Programs"
        value="42"
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        label="Active Grants"
        value="$2.4M"
        trend={{ value: 8, isPositive: false }}
      />
      <StatCard
        label="Participants"
        value="1,234"
      />
      <StatCard
        label="Completion Rate"
        value="87%"
        trend={{ value: 5, isPositive: true }}
      />
    </div>
  ),
};

