import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  try {
    // Test structured logging
    const { logger } = Sentry;
    logger.info('Sentry test endpoint called', { timestamp: new Date().toISOString() });

    // Test error capture
    const testError = new Error('Test error from Sentry integration');
    Sentry.captureException(testError);

    logger.warn('Test warning logged to Sentry');

    return NextResponse.json({
      success: true,
      message: 'Sentry test completed. Check your Sentry dashboard for the error and logs.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
