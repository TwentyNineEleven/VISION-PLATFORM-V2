import { z } from 'zod';

/**
 * Input Validation Utilities
 *
 * Provides reusable validation schemas and sanitization functions
 * to prevent injection attacks and ensure data integrity.
 */

/**
 * Common validation schemas
 */
export const schemas = {
  // Email validation
  email: z.string().email('Invalid email address').toLowerCase().trim(),

  // Password validation (minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 number)
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  // UUID validation
  uuid: z.string().uuid('Invalid UUID'),

  // URL validation
  url: z.string().url('Invalid URL'),

  // Phone number (basic validation)
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional(),

  // Organization name
  organizationName: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must not exceed 100 characters')
    .trim(),

  // User name
  userName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),

  // EIN (Employer Identification Number)
  ein: z.string().regex(/^\d{2}-\d{7}$/, 'Invalid EIN format (XX-XXXXXXX)'),

  // Positive integer
  positiveInt: z.number().int().positive('Must be a positive integer'),

  // Non-negative integer
  nonNegativeInt: z.number().int().min(0, 'Must be a non-negative integer'),

  // Date string (ISO format)
  dateString: z.string().datetime('Invalid date format'),

  // Hex color
  hexColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),

  // Pagination
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
  }),

  // Search query
  searchQuery: z.string().max(100, 'Search query too long').trim(),

  // Role validation
  role: z.enum(['owner', 'admin', 'member'], {
    errorMap: () => ({ message: 'Invalid role. Must be owner, admin, or member' }),
  }),

  // File upload validation
  fileSize: (maxSizeMB: number) =>
    z.number().max(maxSizeMB * 1024 * 1024, `File size must not exceed ${maxSizeMB}MB`),

  // Array of UUIDs
  uuidArray: z.array(z.string().uuid('Invalid UUID in array')),
};

/**
 * Sanitize string to prevent XSS attacks
 * Removes potentially dangerous characters and HTML
 *
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .trim();
}

/**
 * Sanitize HTML - strips all HTML tags
 *
 * @param input - HTML string to sanitize
 * @returns Plain text without HTML
 */
export function sanitizeHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

/**
 * Validate and sanitize email
 *
 * @param email - Email to validate
 * @returns Sanitized email or throws error
 */
export function validateEmail(email: string): string {
  const result = schemas.email.safeParse(email);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
}

/**
 * Validate UUID
 *
 * @param uuid - UUID to validate
 * @returns Valid UUID or throws error
 */
export function validateUuid(uuid: string): string {
  const result = schemas.uuid.safeParse(uuid);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
}

/**
 * Validate pagination parameters
 *
 * @param page - Page number
 * @param limit - Items per page
 * @returns Validated pagination object
 */
export function validatePagination(page?: number, limit?: number) {
  const result = schemas.pagination.safeParse({ page, limit });
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
}

/**
 * Sanitize search query
 * Prevents SQL injection and XSS in search queries
 *
 * @param query - Search query
 * @returns Sanitized query
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[<>'"]/g, '') // Remove quotes and angle brackets
    .replace(/--/g, '') // Remove SQL comment syntax
    .replace(/;/g, '') // Remove semicolons
    .replace(/\\/g, '') // Remove backslashes
    .trim();
}

/**
 * Validate file upload
 *
 * @param file - File object
 * @param maxSizeMB - Maximum file size in MB
 * @param allowedTypes - Array of allowed MIME types
 * @returns Validation result
 */
export function validateFileUpload(
  file: File,
  maxSizeMB: number = 15,
  allowedTypes: string[] = []
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Check file type if allowedTypes is specified
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Validate request body against schema
 *
 * @param body - Request body to validate
 * @param schema - Zod schema to validate against
 * @returns Validated data or throws error
 */
export function validateRequestBody<T>(body: unknown, schema: z.ZodSchema<T>): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    throw new ValidationError('Validation failed', errors);
  }
  return result.data;
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  public errors: Array<{ field: string; message: string }>;

  constructor(message: string, errors: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * API validation middleware
 *
 * Usage:
 * ```typescript
 * const bodySchema = z.object({
 *   name: schemas.organizationName,
 *   email: schemas.email,
 * });
 *
 * export async function POST(request: NextRequest) {
 *   try {
 *     const body = await request.json();
 *     const validatedData = validateRequestBody(body, bodySchema);
 *     // Use validatedData...
 *   } catch (error) {
 *     if (error instanceof ValidationError) {
 *       return NextResponse.json(
 *         { error: error.message, details: error.errors },
 *         { status: 400 }
 *       );
 *     }
 *     throw error;
 *   }
 * }
 * ```
 */

/**
 * Common MIME types for file validation
 */
export const MIME_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  all: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
};
