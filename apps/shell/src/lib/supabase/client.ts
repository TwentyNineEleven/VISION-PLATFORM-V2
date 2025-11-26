import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

export function createClient() {
  // In test environment, use service role client to bypass auth/RLS
  if (process.env.NODE_ENV === 'test' && process.env.USE_REAL_DB === '1') {
    const client = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Mock auth.getUser() to return test user for services that require it
    if (process.env.TEST_USER_ID) {
      const originalGetUser = client.auth.getUser.bind(client.auth);
      client.auth.getUser = async () => {
        return {
          data: {
            user: {
              id: process.env.TEST_USER_ID!,
              email: process.env.TEST_USER_EMAIL || 'test@example.com',
              app_metadata: {},
              user_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString(),
              role: 'authenticated',
              updated_at: new Date().toISOString(),
              phone: '',
              confirmation_sent_at: '',
              confirmed_at: new Date().toISOString(),
              email_confirmed_at: new Date().toISOString(),
              last_sign_in_at: new Date().toISOString(),
            },
          },
          error: null,
        };
      };
    }

    return client;
  }

  // Production: use browser client with anon key
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
