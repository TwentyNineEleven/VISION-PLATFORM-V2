/**
 * Authentication Test Helpers
 * 
 * Provides utilities for setting up authentication in tests
 * 
 * Solution: Use vi.mock with factory function that can be controlled
 */

import { vi } from 'vitest';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { USE_REAL_DB } from './serviceTestHelpers';

// Global state for test user
let testUser: { id: string; email: string } | null = null;

/**
 * Set the current test user for auth mocking
 */
export function setTestUser(userId: string, email: string) {
  testUser = { id: userId, email };
}

/**
 * Clear the current test user
 */
export function clearTestUser() {
  testUser = null;
}

/**
 * Get the current test user
 */
export function getTestUser() {
  return testUser;
}

/**
 * Create a client with mocked auth.getUser() if test user is set
 */
export function createAuthenticatedClient() {
  // Dynamically import to avoid hoisting issues
  const { createClient } = require('@/lib/supabase/client');
  const client = createClient();
  
  if (USE_REAL_DB && testUser) {
    // Override auth.getUser to return test user
    client.auth.getUser = vi.fn().mockImplementation(async () => {
      return {
        data: {
          user: {
            id: testUser!.id,
            email: testUser!.email,
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          },
          session: null,
        },
        error: null,
      };
    });
  }
  
  return client;
}

/**
 * Setup authentication for a test
 * Mocks createClient to return authenticated client
 * Returns cleanup function
 */
export function setupTestAuth(userId: string, email: string) {
  if (!USE_REAL_DB) {
    return () => {}; // No-op for mocks
  }

  // Set test user
  setTestUser(userId, email);

  // Mock createClient module to return authenticated client
  const clientModule = require('@/lib/supabase/client');
  
  // Store original
  const originalCreateClient = clientModule.createClient;
  
  // Mock it
  vi.spyOn(clientModule, 'createClient').mockImplementation(() => {
    return createAuthenticatedClient();
  });

  // Return cleanup
  return () => {
    clearTestUser();
    vi.mocked(clientModule.createClient).mockRestore();
  };
}

/**
 * Use service role client for admin operations
 * This bypasses RLS and auth checks
 */
export function createServiceRoleClient() {
  if (!USE_REAL_DB) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

  return createServiceClient(url, serviceKey);
}
