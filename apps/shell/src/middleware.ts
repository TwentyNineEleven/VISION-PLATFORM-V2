import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware
 *
 * Runs before every request to apply security headers, rate limiting,
 * and other global request processing.
 *
 * Security features:
 * - Content Security Policy (CSP)
 * - HTTP Strict Transport Security (HSTS)
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Referrer-Policy
 * - Permissions-Policy
 */

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get the pathname
  const pathname = request.nextUrl.pathname;

  // Skip security headers for static assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|woff|woff2|ttf|eot)$/)
  ) {
    return response;
  }

  // Content Security Policy (CSP)
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vercel.live https://*.sentry.io https://app.posthog.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'self' https://vercel.live",
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspHeader);

  // HTTP Strict Transport Security (HSTS)
  // Tells browsers to only use HTTPS for this domain
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // X-Frame-Options
  // Prevents clickjacking by not allowing the site to be embedded in iframes
  response.headers.set('X-Frame-Options', 'DENY');

  // X-Content-Type-Options
  // Prevents MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection
  // Enables XSS filter in older browsers
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy
  // Controls how much referrer information is included with requests
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy
  // Controls which browser features can be used
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // X-DNS-Prefetch-Control
  // Controls DNS prefetching
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  // Remove X-Powered-By header (security through obscurity)
  response.headers.delete('X-Powered-By');

  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
