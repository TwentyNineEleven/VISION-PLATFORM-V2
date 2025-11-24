import { createHash, randomBytes } from 'crypto';

/**
 * CSRF Protection
 *
 * Implements Cross-Site Request Forgery (CSRF) protection using the
 * Double Submit Cookie pattern with cryptographic verification.
 *
 * This prevents malicious websites from making unauthorized requests
 * on behalf of authenticated users.
 */

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generate a cryptographically secure CSRF token
 *
 * @returns Base64-encoded random token
 */
export function generateCsrfToken(): string {
  const token = randomBytes(CSRF_TOKEN_LENGTH).toString('base64');
  return token;
}

/**
 * Hash a CSRF token for secure comparison
 * Prevents timing attacks by comparing hashes instead of raw tokens
 *
 * @param token - CSRF token to hash
 * @returns SHA-256 hash of the token
 */
export function hashCsrfToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Validate CSRF token from request
 *
 * Compares the token from the header with the token from the cookie.
 * Uses constant-time comparison to prevent timing attacks.
 *
 * @param request - Next.js request object
 * @returns True if token is valid, false otherwise
 */
export function validateCsrfToken(request: Request): boolean {
  // Get CSRF token from header
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  if (!headerToken) {
    return false;
  }

  // Get CSRF token from cookie
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return false;
  }

  const cookies = parseCookies(cookieHeader);
  const cookieToken = cookies[CSRF_COOKIE_NAME];
  if (!cookieToken) {
    return false;
  }

  // Compare hashed tokens (constant-time comparison)
  const headerHash = hashCsrfToken(headerToken);
  const cookieHash = hashCsrfToken(cookieToken);

  return timingSafeEqual(headerHash, cookieHash);
}

/**
 * Parse cookies from cookie header string
 *
 * @param cookieHeader - Cookie header string
 * @returns Object with cookie name-value pairs
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(';').reduce(
    (cookies, cookie) => {
      const [name, value] = cookie.split('=').map((c) => c.trim());
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
      return cookies;
    },
    {} as Record<string, string>
  );
}

/**
 * Constant-time string comparison to prevent timing attacks
 *
 * @param a - First string
 * @param b - Second string
 * @returns True if strings are equal, false otherwise
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * CSRF protection middleware for API routes
 *
 * Usage:
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const csrfResult = csrfMiddleware(request);
 *   if (!csrfResult.valid) {
 *     return csrfResult.response;
 *   }
 *
 *   // Process request...
 * }
 * ```
 */
export function csrfMiddleware(request: Request) {
  // Skip CSRF check for GET, HEAD, OPTIONS (safe methods)
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }

  // Skip CSRF check in development mode (optional)
  if (process.env.NODE_ENV === 'development' && process.env.DISABLE_CSRF_IN_DEV === 'true') {
    return { valid: true };
  }

  const valid = validateCsrfToken(request);

  if (!valid) {
    return {
      valid: false,
      response: new Response(
        JSON.stringify({
          error: 'Invalid CSRF token',
          message: 'CSRF token validation failed. Please refresh the page and try again.',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ),
    };
  }

  return { valid: true };
}

/**
 * Generate CSRF token and set cookie
 *
 * Call this in your authentication endpoints or app initialization
 * to set the CSRF token cookie.
 *
 * @returns Object with token and Set-Cookie header
 */
export function setCsrfToken() {
  const token = generateCsrfToken();

  const cookieOptions = [
    `${CSRF_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${60 * 60 * 24 * 7}`, // 7 days
  ];

  return {
    token,
    cookie: cookieOptions.join('; '),
  };
}

/**
 * Get CSRF token from request cookies
 *
 * @param request - Next.js request object
 * @returns CSRF token or null if not found
 */
export function getCsrfToken(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }

  const cookies = parseCookies(cookieHeader);
  return cookies[CSRF_COOKIE_NAME] || null;
}

/**
 * CSRF token header name for client-side usage
 */
export const CSRF_HEADER = CSRF_HEADER_NAME;
export const CSRF_COOKIE = CSRF_COOKIE_NAME;
