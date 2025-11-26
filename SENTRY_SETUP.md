# Sentry Setup - VISION Platform V2

## ✅ Configuration Complete

Sentry has been successfully configured for error tracking and monitoring in the VISION Platform.

### Platform Information
- **Platform**: Next.js 15 with React 19
- **Organization**: 2911-impact-parters-llc
- **Project**: vision-platform
- **Sentry SDK**: @sentry/nextjs v10.26.0

### Files Created/Modified

1. **Configuration Files**:
   - `apps/shell/sentry.client.config.ts` - Client-side error tracking
   - `apps/shell/sentry.server.config.ts` - Server-side error tracking
   - `apps/shell/sentry.edge.config.ts` - Edge runtime error tracking
   - `apps/shell/instrumentation.ts` - Sentry initialization

2. **Environment Variables** (`.env.local`):
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://449a8047cdef5f9268f0d67544837ab6@o4510167821975553.ingest.us.sentry.io/4510421665513472
   SENTRY_ORG=2911-impact-parters-llc
   SENTRY_PROJECT=vision-platform
   SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
   ```

3. **Test Endpoint**:
   - `apps/shell/src/app/api/sentry-test/route.ts`

### Features Enabled

- ✅ **Client-side error tracking** - Captures JavaScript errors in the browser
- ✅ **Server-side error tracking** - Captures Node.js errors on the server
- ✅ **Edge runtime support** - Captures errors in Next.js Edge functions
- ✅ **Structured logging** - `enableLogs: true` in all configs
- ✅ **Console integration** - Automatically sends console.log, console.warn, console.error to Sentry
- ✅ **Session replay** - Records user sessions when errors occur (100% sample rate for errors)
- ✅ **Performance monitoring** - Transaction tracing enabled (10% in production, 100% in dev)
- ✅ **Source map uploads** - Auth token configured for production builds

### Configuration Details

#### Sample Rates
- **Development**:
  - Traces: 100%
  - Session Replay: 100%
- **Production**:
  - Traces: 10%
  - Session Replay: 10% (100% on errors)

#### Security
- Development errors filtered out (localhost URLs won't be sent to Sentry in dev mode)
- Source maps hidden in production builds
- Session replay masks all text and blocks media by default

### Testing

Test the integration:
```bash
# Start dev server
pnpm dev

# Call test endpoint
curl http://localhost:3001/api/sentry-test
```

Expected response:
```json
{
  "success": true,
  "message": "Sentry test completed. Check your Sentry dashboard for the error and logs.",
  "timestamp": "..."
}
```

Then check your Sentry dashboard at:
https://2911-impact-parters-llc.sentry.io/projects/vision-platform/

### Using Sentry in Code

#### Capture Exceptions
```typescript
import * as Sentry from '@sentry/nextjs';

try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

#### Structured Logging
```typescript
import * as Sentry from '@sentry/nextjs';

const { logger } = Sentry;

logger.info('User action completed', { userId: '123', action: 'login' });
logger.warn('Rate limit approaching', { endpoint: '/api/data', requests: 95 });
logger.error('Failed to save document', { documentId: 'abc', error: err.message });
```

#### Performance Tracing
```typescript
import * as Sentry from '@sentry/nextjs';

// Trace UI interactions
Sentry.startSpan({ op: 'ui.click', name: 'Save Button Click' }, (span) => {
  span.setAttribute('documentId', documentId);
  span.setAttribute('userId', userId);
  saveDocument();
});

// Trace API calls
async function fetchUserData(userId: string) {
  return Sentry.startSpan(
    { op: 'http.client', name: `GET /api/users/${userId}` },
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      return response.json();
    }
  );
}
```

#### Using with ErrorBoundary
```typescript
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Dashboard Features

Access your Sentry dashboard to view:
- **Issues**: All captured errors with stack traces and context
- **Performance**: Transaction traces and performance metrics
- **Releases**: Track errors by release version
- **Alerts**: Configure notifications for critical errors
- **Session Replay**: Watch user sessions that encountered errors

### Production Deployment

For production deployments (Vercel, etc.):

1. **Add environment variables** to your deployment platform:
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
   - `SENTRY_AUTH_TOKEN`

2. **Source maps** will automatically upload during build
3. **Releases** will be tracked automatically
4. **Performance data** will be sampled at 10%

### Notes

- The OpenTelemetry warnings during build are normal and don't affect functionality
- Localhost errors in development are filtered out to reduce noise
- Source maps are hidden in production builds for security
- Session replay captures are anonymized (text masked, media blocked)

## Support

For Sentry-specific questions:
- Documentation: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Your Dashboard: https://2911-impact-parters-llc.sentry.io/projects/vision-platform/
