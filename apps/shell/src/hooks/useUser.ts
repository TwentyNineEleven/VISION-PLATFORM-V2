/**
 * useUser hook - provides current authenticated user info
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser) {
          // Get user details from public.users table
          const { data: userData } = await supabase
            .from('users')
            .select('id, name, email')
            .eq('id', authUser.id)
            .single();

          if (userData) {
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
            });
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return { user, loading };
}
