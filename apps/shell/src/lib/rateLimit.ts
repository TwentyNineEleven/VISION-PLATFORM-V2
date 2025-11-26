import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

type RateLimitResult =
  | {
      success: true;
      headers: Record<string, string>;
    }
  | {
      success: false;
      response: NextResponse;
    };

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// AI endpoints: 10 requests/min, burst up to 20
const aiLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: '@rate:ai',
    })
  : null;

const apiLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
      prefix: '@rate:api',
    })
  : null;

function getClientIdentifier(request: Request, userId?: string) {
  if (userId) return userId;
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip');
  return forwarded || realIp || 'anonymous';
}

async function applyLimiter(
  limiter: typeof aiLimiter,
  request: Request,
  userId?: string
): Promise<RateLimitResult> {
  if (!limiter) {
    return { success: true, headers: {} };
  }

  const identifier = getClientIdentifier(request, userId);
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  const headers = {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': reset.toString(),
    'Retry-After': Math.max(0, Math.ceil((reset - Date.now()) / 1000)).toString(),
  };

  if (!success) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again shortly.',
        },
        { status: 429, headers }
      ),
    };
  }

  return { success: true, headers };
}

export async function enforceAiRateLimit(request: Request, userId?: string) {
  return applyLimiter(aiLimiter, request, userId);
}

export async function enforceApiRateLimit(request: Request, userId?: string) {
  return applyLimiter(apiLimiter, request, userId);
}
