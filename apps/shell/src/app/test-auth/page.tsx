'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function TestAuthPage() {
  const router = useRouter();
  const [status, setStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const testAuth = async () => {
    setLoading(true);
    setStatus('Testing authentication...');

    try {
      const supabase = createClient();
      setStatus('✓ Supabase client created');

      const testEmail = 'test@visionplatform.org';
      const testPassword = 'TestPassword123!';

      setStatus(`Attempting to sign in as ${testEmail}...`);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        setStatus(`❌ Error: ${error.message}`);
        console.error('Auth error:', error);
        return;
      }

      setStatus('✅ Sign in successful!');
      console.log('Auth success:', data);

      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

    } catch (err) {
      setStatus(`❌ Exception: ${err}`);
      console.error('Exception:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">Auth Test</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Quick authentication test
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={testAuth}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Sign In'}
          </button>

          {status && (
            <div className="p-4 bg-gray-100 rounded">
              <p className="text-sm font-mono whitespace-pre-wrap">{status}</p>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Test Credentials:</strong></p>
            <p>Email: test@visionplatform.org</p>
            <p>Password: TestPassword123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
