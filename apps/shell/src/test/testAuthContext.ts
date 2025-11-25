/**
 * Test Auth Context
 * 
 * Global context for test authentication
 * This allows us to mock auth.getUser() for real DB tests
 */

// Global variable to track current test user
let currentTestUser: { id: string; email: string } | null = null;

/**
 * Set the current test user for auth mocking
 */
export function setTestUser(userId: string, email: string) {
  currentTestUser = { id: userId, email };
}

/**
 * Clear the current test user
 */
export function clearTestUser() {
  currentTestUser = null;
}

/**
 * Get the current test user
 */
export function getTestUser() {
  return currentTestUser;
}

/**
 * Mock auth.getUser() on a Supabase client
 */
export function mockAuthOnClient(client: any) {
  if (currentTestUser) {
    const originalGetUser = client.auth.getUser;
    client.auth.getUser = async () => {
      return {
        data: {
          user: {
            id: currentTestUser!.id,
            email: currentTestUser!.email,
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          },
          session: null,
        },
        error: null,
      };
    };
  }
  return client;
}

