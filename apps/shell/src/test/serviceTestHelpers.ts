/**
 * Service Test Helpers
 * 
 * Provides utilities for testing services with both mocks and real database
 */

import { vi } from 'vitest';
import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

export const USE_REAL_DB = process.env.USE_REAL_DB === '1' || process.env.USE_REAL_DB === 'true';

/**
 * Get Supabase client for testing
 * Returns real client if USE_REAL_DB is set, otherwise returns mock
 */
export function getTestSupabaseClient(): SupabaseClient {
  if (USE_REAL_DB) {
    // Use real client
    return createClient();
  }
  
  // Return mock (should be set up by test)
  return createClient() as any;
}

/**
 * Setup test environment
 * Call this in beforeEach to set up mocks or real DB
 */
export function setupTestEnvironment() {
  if (!USE_REAL_DB) {
    // Clear mocks for mock-based tests
    vi.clearAllMocks();
  }
  // For real DB, no setup needed - just use the real client
}

/**
 * Test data constants for real DB tests
 * Note: User IDs are dynamic (from auth), so we use emails for lookups
 */
export const TEST_DATA = {
  ORGANIZATION_ID: '00000000-0000-0000-0000-000000000010',
  ORGANIZATION_NAME: 'Test Organization',
  EMAILS: {
    OWNER: 'owner@test.com',
    ADMIN: 'admin@test.com',
    EDITOR: 'editor@test.com',
    VIEWER: 'viewer@test.com',
    PENDING_INVITE: 'pending@test.com',
  },
  DOCUMENT_IDS: {
    DOC1: '00000000-0000-0000-0000-000000000100',
    DOC2: '00000000-0000-0000-0000-000000000101',
  },
  INVITE_IDS: {
    PENDING: '00000000-0000-0000-0000-000000000200',
  },
} as const;

/**
 * Get user ID by email (for real DB tests)
 * Since auth user IDs are dynamic, we look them up by email
 */
export async function getUserIdByEmail(email: string): Promise<string | null> {
  if (!USE_REAL_DB) {
    return null;
  }
  
  // Use dynamic import to avoid module resolution issues
  const { createClient } = await import('@/lib/supabase/client');
  const supabase = createClient();
  
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();
  
  return data?.id || null;
}

