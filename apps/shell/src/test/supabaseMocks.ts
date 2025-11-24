/**
 * Supabase Mock Helpers
 *
 * Provides utilities for mocking Supabase client queries in tests
 */

import { vi } from 'vitest';

export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

/**
 * Creates a chainable mock query builder
 *
 * Usage:
 * ```ts
 * const query = createMockQuery();
 * query.mockResolvedValue({ data: [...], error: null });
 *
 * // Or with terminal methods:
 * query.single.mockResolvedValue({ data: {...}, error: null });
 * ```
 */
export function createMockQuery() {
  const query: any = {};

  // All chainable methods return the query itself
  // IMPORTANT: Each method must be a real vi.fn() that returns the same query
  const chainableMethods = [
    'select', 'insert', 'update', 'delete', 'upsert',
    'eq', 'neq', 'gt', 'gte', 'lt', 'lte',
    'like', 'ilike', 'in', 'is', 'contains', 'containedBy',
    'or', 'not', 'filter', 'match',
    'order', 'limit', 'range', 'offset',
  ];

  // Create each chainable method as a vi.fn() that always returns the query
  chainableMethods.forEach(method => {
    query[method] = vi.fn(function() {
      return query; // Always return the query object for chaining
    });
  });

  // Terminal methods return promises
  query.single = vi.fn();
  query.maybeSingle = vi.fn();

  // Make query itself awaitable/mockable
  query.then = vi.fn();
  query.catch = vi.fn();

  /**
   * Helper to make the query resolve to a specific value when awaited
   */
  query.mockResolvedValue = (value: any) => {
    const promise = Promise.resolve(value);
    query.then = promise.then.bind(promise);
    query.catch = promise.catch.bind(promise);
    return query;
  };

  return query;
}

/**
 * Creates a mock Supabase client
 *
 * Usage:
 * ```ts
 * const mockSupabase = createMockSupabaseClient();
 * vi.mocked(createClient).mockReturnValue(mockSupabase);
 *
 * // For each service call, return a new query:
 * const query1 = createMockQuery();
 * query1.mockResolvedValue({ data: [...], error: null });
 * mockSupabase.from.mockReturnValueOnce(query1);
 * ```
 */
export function createMockSupabaseClient() {
  return {
    from: vi.fn(() => createMockQuery()),
    rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: mockUser },
        error: null,
      })),
      getSession: vi.fn(() => Promise.resolve({
        data: { session: { user: mockUser } },
        error: null,
      })),
      signIn: vi.fn(() => Promise.resolve({ data: { user: mockUser }, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      signUp: vi.fn(() => Promise.resolve({ data: { user: mockUser }, error: null })),
      admin: {
        inviteUserByEmail: vi.fn(() => Promise.resolve({ data: { user: mockUser }, error: null })),
        createUser: vi.fn(() => Promise.resolve({ data: { user: mockUser }, error: null })),
        deleteUser: vi.fn(() => Promise.resolve({ error: null })),
      },
    },
    storage: {
      from: vi.fn((bucket: string) => ({
        upload: vi.fn(() => Promise.resolve({ data: { path: 'test-path' }, error: null })),
        download: vi.fn(() => Promise.resolve({ data: new Blob(), error: null })),
        remove: vi.fn(() => Promise.resolve({ data: [], error: null })),
        getPublicUrl: vi.fn((path: string) => ({
          data: { publicUrl: `https://test.supabase.co/storage/v1/object/public/${bucket}/${path}` },
        })),
        createSignedUrl: vi.fn((path: string, expiresIn: number) => Promise.resolve({
          data: { signedUrl: `https://test.supabase.co/storage/v1/object/sign/${bucket}/${path}?token=signed` },
          error: null,
        })),
      })),
    },
  };
}

/**
 * Creates a Supabase error object
 */
export function createMockSupabaseError(message: string, code = 'PGRST116') {
  return {
    message,
    details: '',
    hint: '',
    code,
  };
}
