/**
 * Vitest Setup with Real Remote Supabase Instance (Option 3)
 * 
 * This setup uses your remote Supabase project for testing instead of mocks.
 * Credentials are loaded from environment variables or .env file.
 * 
 * To use: Set USE_REAL_DB=1 when running tests
 * Example: USE_REAL_DB=1 pnpm test:run
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Remote Supabase instance credentials (Option 3)
// Uses your remote Supabase project for testing
// Priority: VITEST_* env vars > NEXT_PUBLIC_* env vars > .env file > defaults

// Load environment variables (vitest doesn't auto-load .env, so we do it manually)
import { config } from 'dotenv';
import { resolve } from 'path';

// Try to load .env file if it exists
try {
  config({ path: resolve(process.cwd(), '.env') });
} catch (e) {
  // .env file not found, that's okay - use env vars or defaults
}

// Get Supabase credentials from environment variables
// Priority: VITEST_* > NEXT_PUBLIC_* > local defaults
// Defaults to local Supabase instance (start with: npx supabase start)
const SUPABASE_URL = 
  process.env.VITEST_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  'http://127.0.0.1:54321'; // Local Supabase URL

const SUPABASE_ANON_KEY = 
  process.env.VITEST_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'; // Local anon key (standard for local dev)

const SUPABASE_SERVICE_KEY = 
  process.env.VITEST_SUPABASE_SERVICE_KEY || 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'; // Local service key (standard for local dev)

// Set environment variables for tests to use Supabase (local or remote)
process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
process.env.SUPABASE_SERVICE_ROLE_KEY = SUPABASE_SERVICE_KEY;

// Log which Supabase instance is being used (for debugging)
if (process.env.VITEST_VERBOSE !== 'false') {
  const isLocal = SUPABASE_URL.includes('localhost') || SUPABASE_URL.includes('127.0.0.1');
  console.log(`[Test Setup] Using ${isLocal ? 'LOCAL' : 'REMOTE'} Supabase: ${SUPABASE_URL.replace(/\/\/.*@/, '//***@')}`);
}
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NODE_ENV = 'test';

// Mock Next.js router (still needed)
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock Next.js server components (still needed)
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
  headers: () => ({
    get: vi.fn(),
  }),
}));

// DO NOT mock Supabase client - use real instance (local or remote)
// The createClient() function will use the environment variables above
// This connects to your Supabase project (local by default, or remote if configured)

// Unmock Supabase client if it was mocked elsewhere
// This ensures tests use the real client when USE_REAL_DB is set
// Note: vi.doUnmock works even if mock was hoisted
vi.doUnmock('@/lib/supabase/client');

// Mock Sentry (still needed)
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  init: vi.fn(),
  replayIntegration: vi.fn(),
}));

// Mock logger (still needed)
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    child: vi.fn(() => ({
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    })),
  },
  createLogger: vi.fn(),
  logApiRequest: vi.fn(),
  logApiError: vi.fn(),
  logAuthEvent: vi.fn(),
  logDatabaseOp: vi.fn(),
  logBusinessEvent: vi.fn(),
}));

// Note: Tests can import createClient directly from '@/lib/supabase/client'
// The environment variables above will ensure it uses the remote Supabase instance

