# VISION Platform - Quick Start Commands

**Copy and paste these commands in order**

---

## 🚀 1. Initial Setup (5 minutes)

```bash
# Check prerequisites
node --version  # Need 20+
pnpm --version  # Need 9+

# If pnpm not installed:
npm install -g pnpm@9

# Create project
mkdir vision-platform && cd vision-platform
pnpm dlx create-turbo@latest .
# Choose: basic template, pnpm package manager

# Clean up
rm -rf apps/docs
mv apps/web apps/shell

# Update shell package name
cd apps/shell
sed -i '' 's/"web"/"@vision\/shell"/g' package.json || sed -i 's/"web"/"@vision\/shell"/g' package.json
cd ../..
```

---

## 📦 2. Install Latest Dependencies (3 minutes)

```bash
cd apps/shell

# Remove old versions
pnpm remove next react react-dom

# Install Next.js 15 + React 19
pnpm add next@latest react@latest react-dom@latest

# TypeScript types
pnpm add -D @types/react@latest @types/react-dom@latest @types/node@latest typescript

# Tailwind CSS 4
pnpm add tailwindcss@next @tailwindcss/postcss@next autoprefixer@latest -D

# UI Components
pnpm add @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-avatar @radix-ui/react-switch lucide-react

# Utilities
pnpm add clsx tailwind-merge class-variance-authority date-fns

# Forms
pnpm add react-hook-form @hookform/resolvers zod

# Animations
pnpm add tailwindcss-animate

cd ../..
```

---

## 📁 3. Create Project Structure (1 minute)

```bash
cd apps/shell

# Create directories
mkdir -p src/{app,components,lib,hooks,types,styles}
mkdir -p src/components/{layout,dashboard,documents,settings,ui}
mkdir -p src/lib/{utils,api,constants}
mkdir -p public/assets/{images,fonts}

# Create files
touch src/lib/utils.ts
touch src/lib/constants.ts
touch src/types/index.ts
touch src/app/globals.css

cd ../..
```

---

## ⚙️ 4. Create Configuration Files

Copy these files to their respective locations:

### `apps/shell/next.config.ts`
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.pravatar.cc' },
    ],
  },
  experimental: {
    reactCompiler: true,
    typedRoutes: true,
  },
};

export default nextConfig;
```

### `apps/shell/tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### `apps/shell/tsconfig.json`
```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `apps/shell/src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### `apps/shell/src/lib/utils.ts`
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

### `apps/shell/src/app/layout.tsx`
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VISION Platform',
  description: 'Comprehensive SaaS suite for nonprofit organizations',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### `apps/shell/src/app/page.tsx`
```typescript
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
}
```

### `turbo.json` (root)
```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## 🚀 5. Start Development

```bash
# Install all dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
open http://localhost:3000
```

---

## ✅ Verification

```bash
# Should see:
# ✓ Next.js 15.x
# ✓ Turbopack enabled
# ✓ Local: http://localhost:3000

# Test build
pnpm build

# Test lint
pnpm lint
```

---

## 📚 Useful Commands

```bash
# Development
pnpm dev                           # All apps
pnpm --filter @vision/shell dev    # Shell only

# Build
pnpm build
pnpm --filter @vision/shell build

# Lint & Format
pnpm lint
pnpm format

# Clean
pnpm clean
rm -rf .next node_modules

# Add packages
pnpm add <package> -w              # Root
pnpm --filter @vision/shell add <package>  # Shell
```

---

## 🎯 What's Next?

1. **Verify everything works** (run `pnpm dev`)
2. **Start building components**:
   - Component 03: Navigation Header
   - Component 01: Platform Dashboard
   - Component 02: Document Library

---

**Time to complete: ~15 minutes**  
**Result: Production-ready Next.js 15 monorepo!**
