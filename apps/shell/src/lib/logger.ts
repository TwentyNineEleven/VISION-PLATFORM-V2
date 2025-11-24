import pino from 'pino';

// Create logger instance with appropriate configuration for different environments
const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),

  // Format logs in development for better readability
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),

  // Base context for all logs
  base: {
    env: process.env.NODE_ENV,
    app: 'vision-platform',
  },

  // Serialize errors properly
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },

  // Redact sensitive information
  redact: {
    paths: [
      'password',
      'email',
      'token',
      'accessToken',
      'refreshToken',
      'apiKey',
      'authorization',
      'cookie',
      'req.headers.authorization',
      'req.headers.cookie',
    ],
    remove: true,
  },
});

/**
 * Logger utility for structured logging throughout the application.
 *
 * Usage:
 * - logger.info('User logged in', { userId: '123' });
 * - logger.error(error, 'Failed to process request');
 * - logger.debug({ data }, 'Processing data');
 *
 * Context:
 * Use child loggers for adding context:
 * const requestLogger = logger.child({ requestId: req.id });
 * requestLogger.info('Handling request');
 */
export { logger };

/**
 * Create a child logger with additional context
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

/**
 * Log API request
 */
export function logApiRequest(params: {
  method: string;
  path: string;
  userId?: string;
  organizationId?: string;
  duration?: number;
  statusCode?: number;
}) {
  logger.info(
    {
      type: 'api_request',
      ...params,
    },
    `${params.method} ${params.path} - ${params.statusCode || 'pending'}`
  );
}

/**
 * Log API error
 */
export function logApiError(params: {
  method: string;
  path: string;
  error: Error;
  userId?: string;
  organizationId?: string;
  statusCode?: number;
}) {
  logger.error(
    {
      type: 'api_error',
      method: params.method,
      path: params.path,
      userId: params.userId,
      organizationId: params.organizationId,
      statusCode: params.statusCode,
      err: params.error,
    },
    `API Error: ${params.method} ${params.path} - ${params.error.message}`
  );
}

/**
 * Log authentication event
 */
export function logAuthEvent(params: {
  event: 'signup' | 'signin' | 'signout' | 'password_reset' | 'email_verification';
  userId?: string;
  email?: string;
  success: boolean;
  error?: Error;
}) {
  const logLevel = params.success ? 'info' : 'warn';
  logger[logLevel](
    {
      type: 'auth_event',
      ...params,
      email: params.email ? '***@' + params.email.split('@')[1] : undefined, // Partial redaction
    },
    `Auth ${params.event}: ${params.success ? 'success' : 'failure'}`
  );
}

/**
 * Log database operation
 */
export function logDatabaseOp(params: {
  operation: 'select' | 'insert' | 'update' | 'delete';
  table: string;
  userId?: string;
  organizationId?: string;
  duration?: number;
  error?: Error;
}) {
  if (params.error) {
    logger.error(
      {
        type: 'database_error',
        ...params,
        err: params.error,
      },
      `DB Error: ${params.operation} on ${params.table}`
    );
  } else {
    logger.debug(
      {
        type: 'database_op',
        ...params,
      },
      `DB: ${params.operation} ${params.table}${params.duration ? ` (${params.duration}ms)` : ''}`
    );
  }
}

/**
 * Log business event (for analytics/monitoring)
 */
export function logBusinessEvent(params: {
  event: string;
  userId?: string;
  organizationId?: string;
  metadata?: Record<string, unknown>;
}) {
  logger.info(
    {
      type: 'business_event',
      ...params,
    },
    `Business Event: ${params.event}`
  );
}

export default logger;
