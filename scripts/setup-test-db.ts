/**
 * Setup Test Database
 * 
 * Seeds the local Supabase instance with test data for running tests.
 * Run this before tests: pnpm tsx scripts/setup-test-db.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITEST_SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_SERVICE_KEY = process.env.VITEST_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupTestData() {
  console.log('Setting up test database...');

  try {
    // Create test users
    const testUsers = [
      {
        id: 'test-user-1',
        email: 'test1@example.com',
        name: 'Test User One',
        avatar_url: null,
      },
      {
        id: 'test-user-2',
        email: 'test2@example.com',
        name: 'Test User Two',
        avatar_url: null,
      },
    ];

    // Create test organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        id: 'test-org-1',
        name: 'Test Organization',
        type: 'nonprofit',
        ein: '12-3456789',
        website: 'https://test.org',
      })
      .select()
      .single();

    if (orgError && !orgError.message.includes('duplicate')) {
      throw orgError;
    }

    console.log('✅ Test data setup complete');
    console.log(`Organization ID: ${org?.id || 'test-org-1'}`);
  } catch (error) {
    console.error('❌ Error setting up test data:', error);
    throw error;
  }
}

setupTestData()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

