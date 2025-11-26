import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate Limiting with Upstash Redis
 *
 * Implements rate limiting for API routes to prevent abuse and DDoS attacks.
 * Uses Upstash Redis for distributed rate limiting across serverless functions.
 *
 * Rate Limit Tiers:
 * - Strict: 10 requests per 10 seconds (auth endpoints)
 * - Standard: 100 requests per minute (API endpoints)
 * - Generous: 1000 requests per hour (public endpoints)
 */

// Initialize Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    })
  : null;

/**
 * Strict rate limiter for authentication endpoints
 * 10 requests per 10 seconds per IP
 */
export const strictRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true,
      prefix: '@upstash/ratelimit:strict',
    })
  : null;

/**
 * Standard rate limiter for general API endpoints
 * 100 requests per minute per IP
 */
export const standardRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
      prefix: '@upstash/ratelimit:standard',
    })
  : null;

/**
 * Generous rate limiter for public endpoints
 * 1000 requests per hour per IP
 */
export const generousRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(1000, '1 h'),
      analytics: true,
      prefix: '@upstash/ratelimit:generous',
    })
  : null;

/**
 * Per-user rate limiter for authenticated endpoints
 * 500 requests per minute per user
 */
export const userRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(500, '1 m'),
      analytics: true,
      prefix: '@upstash/ratelimit:user',
    })
  : null;

/**
 * Check rate limit for a request
 *
 * @param identifier - IP address or user ID
 * @param limiter - Rate limiter to use (strict, standard, generous, user)
 * @returns Object with success status and rate limit info
 */
export async function checkRateLimit(
  identifier: string,
  limiter: typeof strictRateLimit | typeof standardRateLimit | typeof generousRateLimit | typeof userRateLimit
) {
  if (!limiter) {
    // If Redis is not configured, allow all requests (development mode)
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    };
  }

  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  return {
    success,
    limit,
    remaining,
    reset,
  };
}

/**
 * Get client IP address from request
 * Handles proxies and load balancers (Vercel, Cloudflare, etc.)
 *
 * @param request - Next.js request object
 * @returns Client IP address
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;

  // Check common proxy headers (in order of reliability)
  const ip =
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('cf-connecting-ip') || // Cloudflare
    headers.get('x-vercel-forwarded-for') || // Vercel
    'anonymous';

  return ip;
}

/**
 * Rate limit middleware for API routes
 *
 * Usage:
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = await rateLimitMiddleware(request, 'strict');
 *   if (!rateLimitResult.success) {
 *     return rateLimitResult.response;
 *   }
 *
 *   // Process request...
 * }
 * ```
 */
export async function rateLimitMiddleware(
  request: Request,
  level: 'strict' | 'standard' | 'generous' = 'standard'
) {
  const ip = getClientIp(request);

  const limiter =
    level === 'strict'
      ? strictRateLimit
      : level === 'generous'
        ? generousRateLimit
        : standardRateLimit;

  const { success, limit, remaining, reset } = await checkRateLimit(ip, limiter);

  if (!success) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          limit,
          remaining,
          reset: new Date(reset).toISOString(),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      ),
    };
  }

  return {
    success: true,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  };
}

/**
 * User-specific rate limiting for authenticated requests
 *
 * Usage:
 * ```typescript
 * const rateLimitResult = await userRateLimitMiddleware(request, user.id);
 * if (!rateLimitResult.success) {
 *   return rateLimitResult.response;
 * }
 * ```
 */
export async function userRateLimitMiddleware(request: Request, userId: string) {
  const { success, limit, remaining, reset } = await checkRateLimit(userId, userRateLimit);

  if (!success) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: 'You have exceeded your rate limit. Please try again later.',
          limit,
          remaining,
          reset: new Date(reset).toISOString(),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      ),
    };
  }

  return {
    success: true,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  };
}
