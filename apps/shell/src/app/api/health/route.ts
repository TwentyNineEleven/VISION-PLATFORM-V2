import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Health Check Endpoint
 *
 * Used by deployment workflows to verify the application is running correctly.
 * Checks database connectivity and returns system status.
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // Check database connectivity
    const { error: dbError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (dbError) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          checks: {
            database: 'failed',
            error: dbError.message,
          },
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'ok',
        },
        version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
        environment: process.env.NODE_ENV,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
