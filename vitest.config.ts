import path from 'node:path';
import { createRequire } from 'node:module';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { config as dotenvConfig } from 'dotenv';

// Load .env.test.local for test environment
dotenvConfig({ path: '.env.test.local' });

const require = createRequire(import.meta.url);
const shellRoot = path.resolve(__dirname, 'apps/shell');
const shellTsconfig = path.resolve(shellRoot, 'tsconfig.json');
const shellReactPath = require.resolve('react', { paths: [shellRoot] });
const shellReactDomPath = require.resolve('react-dom', { paths: [shellRoot] });
const shellVitestSetup = path.resolve(__dirname, 'vitest.setup.ts');

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: [shellTsconfig],
      ignoreConfigErrors: true,
    }),
  ],
  resolve: {
    alias: {
      react: shellReactPath,
      'react-dom': shellReactDomPath,
      'react-dom/client': path.resolve(__dirname, 'apps/shell/node_modules/react-dom/client'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    // Use real Supabase if USE_REAL_DB env var is set, otherwise use mocks
    setupFiles: [
      process.env.USE_REAL_DB
        ? path.resolve(__dirname, 'vitest.setup.real-db.ts')
        : shellVitestSetup
    ],
    include: [path.resolve(shellRoot, 'src/**/*.test.{ts,tsx}')],
    isolate: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        'apps/shell/src/services/**/*.ts',
        'apps/shell/src/lib/**/*.ts',
        'apps/shell/src/utils/**/*.ts',
        'apps/shell/src/app/api/**/*.ts',
      ],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/types/**',
        '**/*.d.ts',
        '**/node_modules/**',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 65,
        statements: 70,
      },
    },
  },
});
