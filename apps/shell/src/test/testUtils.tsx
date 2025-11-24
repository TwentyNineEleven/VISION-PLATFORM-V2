import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

/**
 * Test Utilities
 * Provides helper functions for testing React components and services
 */

// ============================================================================
// Supabase Mocking - Re-export from dedicated file
// ============================================================================
export * from './supabaseMocks';

// ============================================================================
// Mock Data Generators
// ============================================================================

export const mockOrganization = {
  id: 'org-123',
  name: 'Test Organization',
  type: 'nonprofit',
  ein: '12-3456789',
  website: 'https://test.org',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockProfile = {
  id: 'user-123',
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockDocument = {
  id: 'doc-123',
  organization_id: 'org-123',
  name: 'test-document.pdf',
  original_name: 'test-document.pdf',
  mime_type: 'application/pdf',
  file_size: 1024000,
  storage_path: 'org-123/test-document.pdf',
  folder_id: null,
  uploaded_by: 'user-123',
  version: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockFolder = {
  id: 'folder-123',
  organization_id: 'org-123',
  name: 'Test Folder',
  parent_id: null,
  created_by: 'user-123',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// ============================================================================
// React Testing Library Helpers
// ============================================================================

interface AllProvidersProps {
  children: ReactNode;
}

/**
 * Wrapper for providers (can add OrganizationContext, AuthContext, etc.)
 */
function AllProviders({ children }: AllProvidersProps) {
  // Add your providers here if needed
  return <>{children}</>;
}

/**
 * Custom render function that includes all providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// ============================================================================
// Test Utilities
// ============================================================================

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean,
  timeout = 5000,
  interval = 50
): Promise<void> {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

/**
 * Create a mock File object
 */
export function createMockFile(
  name: string,
  size: number,
  type: string,
  content = 'test content'
): File {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
}

/**
 * Create a mock FormData with file
 */
export function createMockFormData(file: File, additionalData?: Record<string, string>): FormData {
  const formData = new FormData();
  formData.append('file', file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  return formData;
}

/**
 * Flush all promises
 */
export async function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
