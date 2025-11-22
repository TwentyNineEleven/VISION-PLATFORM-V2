import type { Meta, StoryObj } from '@storybook/react';
import { AppShell } from './AppShell';
import { Icon } from '../icons/Icon';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const meta: Meta<typeof AppShell> = {
  title: 'Layout/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main application shell with sidebar navigation and top bar. Provides the primary layout structure for the application.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppShell>;

const sidebarItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Icon name="menu" size={20} />,
    active: true,
  },
  {
    id: 'programs',
    label: 'Programs',
    icon: <Icon name="menu" size={20} />,
  },
  {
    id: 'grants',
    label: 'Grants',
    icon: <Icon name="menu" size={20} />,
    badge: 3,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <Icon name="menu" size={20} />,
    submenu: [
      { id: 'reports-1', label: 'Monthly Reports' },
      { id: 'reports-2', label: 'Annual Reports' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Icon name="menu" size={20} />,
  },
];

export const Default: Story = {
  args: {
    sidebarItems,
    sidebarLogo: (
      <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
        2911 Platform
      </div>
    ),
    topBarProps: {
      title: 'Dashboard',
      userMenuSlot: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon name="menu" size={20} />
          <span>User Menu</span>
        </div>
      ),
    },
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Card>
          <h2>Welcome to the 2911 Platform</h2>
          <p>This is the main content area of the application shell.</p>
        </Card>
        <Card>
          <h3>Recent Activity</h3>
          <p>Your recent activities will appear here.</p>
        </Card>
      </div>
    ),
  },
};

export const WithSearch: Story = {
  args: {
    sidebarItems,
    sidebarLogo: (
      <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
        2911 Platform
      </div>
    ),
    topBarProps: {
      title: 'Programs',
      searchSlot: (
        <input
          type="search"
          placeholder="Search programs..."
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            border: '1px solid var(--color-border-primary)',
            borderRadius: 'var(--radius-sm)',
          }}
        />
      ),
      userMenuSlot: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon name="menu" size={20} />
        </div>
      ),
    },
    children: (
      <div>
        <Card>
          <h2>Programs</h2>
          <p>Search and manage your programs from here.</p>
        </Card>
      </div>
    ),
  },
};

export const WithActions: Story = {
  args: {
    sidebarItems,
    sidebarLogo: (
      <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
        2911 Platform
      </div>
    ),
    topBarProps: {
      title: 'Grant Application',
      actions: (
        <>
          <Button variant="secondary">Save Draft</Button>
          <Button variant="primary">Submit</Button>
        </>
      ),
      userMenuSlot: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon name="menu" size={20} />
        </div>
      ),
    },
    children: (
      <div>
        <Card>
          <h2>Grant Application Form</h2>
          <p>Fill out your grant application details here.</p>
        </Card>
      </div>
    ),
  },
};

