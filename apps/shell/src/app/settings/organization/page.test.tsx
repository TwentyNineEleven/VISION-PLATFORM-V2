import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
vi.mock('@/contexts/OrganizationContext', () => ({
  useOrganization: () => ({
    activeOrganization: { id: 'org-123', name: 'Test Org' },
    currentRole: 'Owner',
    canEditOrganization: true,
    refreshOrganizations: vi.fn(),
    switchOrganization: vi.fn(),
    createOrganization: vi.fn(),
    updateOrganization: vi.fn(),
    canManageMembers: true,
    canInviteMembers: true,
    isOwner: true,
    isAdmin: true,
    userOrganizations: [],
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

import { OrganizationSettingsTestComponent as OrganizationSettingsPage } from './page';
import { ORGANIZATION_STORAGE_KEY } from '@/services/organizationService';

vi.mock('@/design-system', () => {
  const React = require('react');
  const Stack = ({ children, ...props }: any) => <div {...props}>{children}</div>;
  const Grid = ({ children, ...props }: any) => <div {...props}>{children}</div>;
  return {
    Stack,
    Grid,
    spacing: { '3xl': '24px', lg: '16px', sm: '8px', md: '12px', xl: '20px' },
    semanticColors: { borderSecondary: '#D7DBDF' },
  };
});

vi.mock('@/components/settings/LogoUpload', () => ({
  LogoUpload: () => <div data-testid="logo-upload" />,
}));

vi.mock('@/components/settings/ConfirmDialog', () => ({
  ConfirmDialog: ({ triggerLabel, onConfirm }: any) => (
    <button type="button" data-testid={triggerLabel} onClick={onConfirm}>
      {triggerLabel}
    </button>
  ),
}));

describe.skip('OrganizationSettingsPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders GlowSelect inputs for organization type and country', () => {
    render(<OrganizationSettingsPage />);

    expect(screen.getByLabelText(/organization type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('validates required fields before saving', async () => {
    render(<OrganizationSettingsPage />);

    fireEvent.change(screen.getByLabelText(/organization name/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(await screen.findByText(/organization name is required/i)).toBeInTheDocument();
  });

  it('persists organization data to localStorage after save', async () => {
    render(<OrganizationSettingsPage />);

    fireEvent.change(screen.getByLabelText(/organization name/i), {
      target: { value: 'Test Community Org' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      const stored = window.localStorage.getItem(ORGANIZATION_STORAGE_KEY);
      expect(stored).toMatch(/Test Community Org/);
    });
  });
});

