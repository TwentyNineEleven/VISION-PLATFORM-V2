import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.pravatar.cc',
      },
    ],
  },

  // Typed routes moved out of experimental
  typedRoutes: true,

  // Output file tracing config to silence lockfile warning
  outputFileTracingRoot: require('path').join(__dirname, '../../'),

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
