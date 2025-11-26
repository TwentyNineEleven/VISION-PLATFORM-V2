import { NextRequest, NextResponse } from 'next/server';
import { rateLimitMiddleware } from '@/lib/security/rate-limit';
import { csrfMiddleware } from '@/lib/security/csrf';
import { validateRequestBody, schemas, ValidationError } from '@/lib/security/input-validation';
import { handleApiError } from '@/lib/api-error-handler';
import { logApiRequest } from '@/lib/logger';
import { z } from 'zod';

/**
 * Example Secure API Route
 *
 * Demonstrates how to implement all security features:
 * - Rate limiting
 * - CSRF protection
 * - Input validation
 * - Error handling
 * - Logging
 *
 * This serves as a template for creating secure API endpoints.
 */

// Define request body schema
const requestSchema = z.object({
  name: schemas.organizationName,
  email: schemas.email,
  description: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Rate Limiting - Check rate limit first (strict: 10 req/10s)
    const rateLimitResult = await rateLimitMiddleware(request, 'strict');
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    // 2. CSRF Protection - Validate CSRF token
    const csrfResult = csrfMiddleware(request);
    if (!csrfResult.valid) {
      return csrfResult.response;
    }

    // 3. Input Validation - Parse and validate request body
    const body = await request.json();
    const validatedData = validateRequestBody(body, requestSchema);

    // 4. Business Logic - Process the validated request
    // Example: Create organization, process data, etc.
    const result = {
      success: true,
      data: {
        id: 'example-uuid',
        ...validatedData,
        createdAt: new Date().toISOString(),
      },
    };

    // 5. Logging - Log successful request
    const duration = Date.now() - startTime;
    logApiRequest({
      method: 'POST',
      path: '/api/v1/example-secure',
      statusCode: 200,
      duration,
    });

    // 6. Response with rate limit headers
    return NextResponse.json(result, {
      status: 200,
      headers: rateLimitResult.headers,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof ValidationError) {
      const duration = Date.now() - startTime;
      logApiRequest({
        method: 'POST',
        path: '/api/v1/example-secure',
        statusCode: 400,
        duration,
      });

      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle all other errors with centralized error handler
    return handleApiError(error, {
      method: 'POST',
      path: '/api/v1/example-secure',
    });
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Rate limiting for GET requests (generous: 1000 req/hour)
    const rateLimitResult = await rateLimitMiddleware(request, 'generous');
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    // GET requests don't need CSRF protection
    // But still validate query parameters if needed

    const result = {
      success: true,
      message: 'This is a secure API endpoint',
      features: [
        'Rate limiting',
        'CSRF protection (for POST/PUT/DELETE)',
        'Input validation',
        'Error handling',
        'Request logging',
      ],
    };

    const duration = Date.now() - startTime;
    logApiRequest({
      method: 'GET',
      path: '/api/v1/example-secure',
      statusCode: 200,
      duration,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: rateLimitResult.headers,
    });
  } catch (error) {
    return handleApiError(error, {
      method: 'GET',
      path: '/api/v1/example-secure',
    });
  }
}
