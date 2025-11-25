/**
 * Test Helpers for Real Database Testing
 * 
 * Provides utilities to conditionally use real database or mocks
 */

/**
 * Check if we should use real database for tests
 */
export function shouldUseRealDb(): boolean {
  return process.env.USE_REAL_DB === '1' || process.env.USE_REAL_DB === 'true';
}

/**
 * Conditionally mock a module only if not using real DB
 */
export function conditionalMock(modulePath: string, factory?: () => any) {
  if (shouldUseRealDb()) {
    // Don't mock - use real implementation
    return;
  }
  
  // Use mocks
  const { vi } = require('vitest');
  if (factory) {
    vi.mock(modulePath, factory);
  } else {
    vi.mock(modulePath);
  }
}

