/**
 * Test Client Wrapper
 * 
 * This module provides a test-friendly way to create Supabase clients
 * with mocked authentication for testing purposes.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';
import { getTestUser, mockAuthOnClient } from '@/test/testAuthContext';

/**
 * Create a Supabase client for testing
 * If a test user is set, the client's auth.getUser() will be mocked
 */
export function createTestClient() {
  const client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // If we're in a test with a test user set, mock auth.getUser()
  if (getTestUser()) {
    mockAuthOnClient(client);
  }

  return client;
}

