import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

/**
 * Test Utilities
 * Provides helper functions for testing React components and services
 */

// ============================================================================
// Mock Data Generators
// ============================================================================

export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

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
// Supabase Mock Helpers
// ============================================================================

/**
 * Creates a mock Supabase client with chainable methods
 */
export function createMockSupabaseClient(overrides?: any) {
  const mockData = overrides?.data || [];
  const mockError = overrides?.error || null;

  const mockQuery = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: mockData[0] || null, error: mockError }),
    maybeSingle: vi.fn().mockResolvedValue({ data: mockData[0] || null, error: mockError }),
    then: vi.fn((resolve) => resolve({ data: mockData, error: mockError })),
  };

  return {
    from: vi.fn(() => mockQuery),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: mockUser },
        error: null,
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      }),
      signIn: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      signUp: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      admin: {
        inviteUserByEmail: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
        createUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
        deleteUser: vi.fn().mockResolvedValue({ error: null }),
      },
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
        download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
        remove: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://test.supabase.co/storage/v1/object/public/test-path' },
        }),
      })),
    },
  };
}

/**
 * Mock Supabase error
 */
export function createMockSupabaseError(message: string, code = 'PGRST116') {
  return {
    message,
    details: '',
    hint: '',
    code,
  };
}

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
