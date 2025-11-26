import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { logApiError } from './logger';

export interface ApiErrorContext {
  method: string;
  path: string;
  userId?: string;
  organizationId?: string;
  body?: unknown;
  params?: unknown;
}

/**
 * Standard error response structure
 */
export interface ApiErrorResponse {
  error: string;
  message?: string;
  details?: unknown;
  statusCode: number;
}

/**
 * Handles API errors consistently across all routes
 * - Logs to Sentry
 * - Logs to structured logger
 * - Returns appropriate error response
 */
export function handleApiError(error: unknown, context: ApiErrorContext): NextResponse<ApiErrorResponse> {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  // Determine status code based on error type
  let statusCode = 500;
  let message = 'An unexpected error occurred';

  if (errorObj.message.includes('not found')) {
    statusCode = 404;
    message = 'Resource not found';
  } else if (errorObj.message.includes('unauthorized') || errorObj.message.includes('Unauthorized')) {
    statusCode = 401;
    message = 'Unauthorized access';
  } else if (errorObj.message.includes('forbidden') || errorObj.message.includes('permission')) {
    statusCode = 403;
    message = 'Access forbidden';
  } else if (errorObj.message.includes('validation') || errorObj.message.includes('invalid')) {
    statusCode = 400;
    message = 'Invalid request';
  } else if (errorObj.message.includes('conflict')) {
    statusCode = 409;
    message = 'Resource conflict';
  }

  // Capture error in Sentry with context
  Sentry.captureException(errorObj, {
    tags: {
      api_method: context.method,
      api_path: context.path,
    },
    contexts: {
      api: {
        method: context.method,
        path: context.path,
        userId: context.userId,
        organizationId: context.organizationId,
      },
    },
    extra: {
      body: context.body,
      params: context.params,
    },
  });

  // Log to structured logger
  logApiError({
    method: context.method,
    path: context.path,
    error: errorObj,
    userId: context.userId,
    organizationId: context.organizationId,
    statusCode,
  });

  // Return error response
  return NextResponse.json(
    {
      error: message,
      message: process.env.NODE_ENV === 'development' ? errorObj.message : undefined,
      details: process.env.NODE_ENV === 'development' ? errorObj.stack : undefined,
      statusCode,
    },
    { status: statusCode }
  );
}

/**
 * Wraps an API route handler with error handling
 *
 * Usage:
 * export const GET = withErrorHandling(async (request, { params }) => {
 *   // Your handler code
 *   return NextResponse.json({ data });
 * });
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  context?: Partial<ApiErrorContext>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      const request = args[0];
      const method = request?.method || 'UNKNOWN';
      const path = request?.nextUrl?.pathname || 'unknown';

      return handleApiError(error, {
        method,
        path,
        ...context,
      });
    }
  }) as T;
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(data: T, status = 200): NextResponse<{ data: T }> {
  return NextResponse.json({ data }, { status });
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  message: string,
  statusCode: number,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      error: message,
      details: process.env.NODE_ENV === 'development' ? details : undefined,
      statusCode,
    },
    { status: statusCode }
  );
}
