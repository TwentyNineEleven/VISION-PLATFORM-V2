import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
// Use local Supabase if USE_REAL_DB is set, otherwise use mock values
const USE_REAL_DB = process.env.USE_REAL_DB === '1' || process.env.USE_REAL_DB === 'true';

if (USE_REAL_DB) {
  // Use local Supabase for real database tests
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMAS_xFeM0';
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
} else {
  // Use mock values for mock-based tests
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
}

process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NODE_ENV = 'test';

// Mock Next.js router
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

// Mock Next.js server components
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

// Mock Supabase client only if not using real DB
if (!USE_REAL_DB) {
  vi.mock('@/lib/supabase/client', () => ({
    createClient: vi.fn(() => ({
      auth: {
        getSession: vi.fn(),
        getUser: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        signUp: vi.fn(),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
      })),
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn(),
          download: vi.fn(),
          remove: vi.fn(),
          getPublicUrl: vi.fn(),
        })),
      },
    })),
  }));
}

// Mock Supabase server client only if not using real DB
if (!USE_REAL_DB) {
  vi.mock('@/lib/supabase/server', () => ({
    createServerSupabaseClient: vi.fn(() => ({
      auth: {
        getSession: vi.fn(),
        getUser: vi.fn(),
        admin: {
          inviteUserByEmail: vi.fn(),
          createUser: vi.fn(),
          deleteUser: vi.fn(),
        },
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
      })),
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn(),
          download: vi.fn(),
          remove: vi.fn(),
          getPublicUrl: vi.fn(),
        })),
      },
    })),
  }));
}

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  init: vi.fn(),
  replayIntegration: vi.fn(),
}));

// Mock logger
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
