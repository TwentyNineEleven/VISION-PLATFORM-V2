import path from 'node:path';
import { createRequire } from 'node:module';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

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
    setupFiles: [shellVitestSetup],
    include: [path.resolve(shellRoot, 'src/**/*.test.{ts,tsx}')],
    isolate: true,
  },
});
