# VISION Platform Shell - Project Initialization Guide

**Latest Stack (2025)**: Next.js 15 | React 19 | TypeScript 5 | Tailwind CSS 4 | pnpm + Turborepo  
**Created**: November 19, 2025  
**Status**: Production-Ready Setup

---

## 🎯 What We're Building

A **monorepo structure** for the VISION Platform that will:
1. **Platform Shell** (main Next.js app) - The core infrastructure
2. **Shared Packages** - Reusable UI components, utilities, types
3. **Future Apps** - CapacityIQ, FundingFramer, etc. (extracted later)

---

## 🔬 RESEARCH: 2025 Tech Stack Best Practices

### Key Research Findings:

**1. Next.js 15 + React 19** (Latest Stable)
- App Router is now the standard (pages router deprecated)
- Server Components by default
- Turbopack for faster builds
- Enhanced image optimization
- Built-in TypeScript and Tailwind support

**2. Monorepo with pnpm + Turborepo**
- pnpm is 2-3x faster than npm/yarn with better disk efficiency
- Turborepo provides intelligent caching and parallel execution
- Vercel's official monorepo solution (acquired 2021)
- Used by: Next.js, React, Vercel, and 1000+ companies

**3. Project Structure (Feature-Based + Modular)**
- `src/` directory for cleaner root
- Feature modules over flat components
- Co-located types, tests, and styles
- Route groups for logical organization

**4. Modern Tooling Stack**
- **ESLint 9** with flat config
- **Prettier 3** for formatting
- **Biome** (optional, 100x faster than ESLint)
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

---

## 📦 Complete Technology Stack

```yaml
# Core Framework
Next.js: 15.x (with Turbopack)
React: 19.x
TypeScript: 5.x

# Styling
Tailwind CSS: 4.x (latest)
PostCSS: 8.x
Autoprefixer: 10.x

# UI Components
Radix UI: 1.x (accessible primitives)
lucide-react: Latest (icons)
clsx + tailwind-merge: Class management

# Forms & Validation
React Hook Form: 7.x
Zod: 3.x (TypeScript-first validation)

# State Management
Zustand: 4.x (lightweight, only if needed)
React Query (TanStack Query): 5.x (server state)

# Backend (Phase 2)
Supabase: Latest (PostgreSQL + Auth + Storage)
Prisma: 5.x (ORM, optional)

# Monorepo Tools
pnpm: 9.x (package manager)
Turborepo: 2.x (build system)

# Development Tools
ESLint: 9.x
Prettier: 3.x
Husky: 9.x (git hooks)
lint-staged: 15.x

# Testing (Optional, can add later)
Vitest: 2.x (unit tests)
Playwright: 1.x (E2E tests)
Testing Library: 16.x
```

---

## 🚀 STEP-BY-STEP SETUP

### Prerequisites

Ensure you have these installed:

```bash
# Check Node.js version (need 18.17+, recommend 20+)
node --version  # Should be v20.x or v22.x

# If not installed, use nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 22
nvm use 22

# Install pnpm globally
npm install -g pnpm@9

# Verify pnpm
pnpm --version  # Should be 9.x
```

---

### Step 1: Create Turborepo Monorepo

```bash
# Create project directory
mkdir vision-platform && cd vision-platform

# Initialize with Turborepo (basic template)
pnpm dlx create-turbo@latest .

# When prompted:
# - Name: vision-platform (or just press enter)
# - Package manager: pnpm
# - Template: basic
```

**What this creates:**
```
vision-platform/
├── apps/
│   ├── docs/          # Documentation site (we'll remove)
│   └── web/           # Main Next.js app (we'll rename to "shell")
├── packages/
│   ├── @repo/eslint-config/
│   ├── @repo/typescript-config/
│   └── @repo/ui/
├── turbo.json         # Turborepo config
├── package.json       # Root package.json
└── pnpm-workspace.yaml
```

---

### Step 2: Clean Up and Rename

```bash
# Remove docs app (we don't need it)
rm -rf apps/docs

# Rename 'web' to 'shell' (our Platform Shell)
mv apps/web apps/shell

# Update package.json in apps/shell
cd apps/shell
# Change "name": "web" to "name": "@vision/shell"
sed -i '' 's/"web"/"@vision\/shell"/g' package.json
cd ../..
```

**Update root `package.json`:**

```json
{
  "name": "vision-platform",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "@turbo/gen": "^2.4.0",
    "prettier": "^3.3.3",
    "turbo": "^2.4.0"
  },
  "packageManager": "pnpm@9.15.1",
  "engines": {
    "node": ">=20.0.0"
  }
}
```

---

### Step 3: Upgrade to Next.js 15 + React 19

```bash
# Navigate to shell app
cd apps/shell

# Remove old dependencies
pnpm remove next react react-dom

# Install latest Next.js 15 + React 19
pnpm add next@latest react@latest react-dom@latest

# Install TypeScript types
pnpm add -D @types/react@latest @types/react-dom@latest @types/node@latest

# Install Tailwind CSS 4 (alpha, stable coming soon)
pnpm add tailwindcss@next @tailwindcss/postcss@next autoprefixer@latest -D

cd ../..
```

---

### Step 4: Configure Next.js 15

**Update `apps/shell/next.config.ts`:**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable Turbopack for faster builds (dev only for now)
  turbopack: {
    // Optional: Add custom turbopack config
  },
  
  // Transpile packages from the monorepo
  transpilePackages: ['@repo/ui'],
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.pravatar.cc', // For mock avatars
      },
    ],
  },
  
  // Experimental features
  experimental: {
    // Enable React 19 features
    reactCompiler: true,
    // Type-safe environment variables
    typedRoutes: true,
  },
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
```

---

### Step 5: Set Up Project Structure

Create the recommended folder structure:

```bash
cd apps/shell

# Create directory structure
mkdir -p src/{app,components,lib,hooks,types,styles}
mkdir -p src/components/{layout,dashboard,documents,settings,ui}
mkdir -p src/lib/{utils,api,constants}
mkdir -p public/assets/{images,fonts}

# Create initial files
touch src/lib/utils.ts
touch src/lib/constants.ts
touch src/types/index.ts
touch src/styles/globals.css
```

**Final structure:**

```
apps/shell/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── (auth)/            # Route group for auth pages
│   │   ├── (main)/            # Route group for main app
│   │   │   ├── dashboard/
│   │   │   ├── documents/
│   │   │   └── settings/
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page (redirect to dashboard)
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── layout/           # Header, Footer, Sidebar
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── documents/        # Document library components
│   │   ├── settings/         # Settings components
│   │   └── ui/               # Reusable UI primitives
│   │
│   ├── lib/                   # Utilities and helpers
│   │   ├── utils.ts          # Helper functions
│   │   ├── api.ts            # API client
│   │   └── constants.ts      # Constants
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types/interfaces
│   └── styles/                # Additional styles (if needed)
│
├── public/                    # Static assets
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   ├── favicon.ico
│   └── robots.txt
│
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Package dependencies
```

---

### Step 6: Configure Tailwind CSS 4

**Create `apps/shell/tailwind.config.ts`:**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // Include shared UI package
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
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
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
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
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

**Create `apps/shell/src/app/globals.css`:**

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

---

### Step 7: Install Core Dependencies

```bash
cd apps/shell

# UI Components & Icons
pnpm add @radix-ui/react-dropdown-menu @radix-ui/react-dialog \
  @radix-ui/react-select @radix-ui/react-tabs \
  @radix-ui/react-avatar @radix-ui/react-switch \
  lucide-react

# Utilities
pnpm add clsx tailwind-merge class-variance-authority \
  date-fns

# Forms & Validation
pnpm add react-hook-form @hookform/resolvers zod

# Animations
pnpm add tailwindcss-animate

# Development dependencies
pnpm add -D @types/node typescript

cd ../..
```

---

### Step 8: Create Utility Functions

**Create `apps/shell/src/lib/utils.ts`:**

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Truncate string to specified length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Debounce function
 */
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

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
```

---

### Step 9: Set Up Root Layout

**Create `apps/shell/src/app/layout.tsx`:**

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VISION Platform',
  description: 'Comprehensive SaaS suite for nonprofit organizations',
  keywords: ['nonprofit', 'capacity building', 'grant writing', 'saas'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

**Create `apps/shell/src/app/page.tsx`:**

```typescript
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to dashboard
  redirect('/dashboard');
}
```

---

### Step 10: Configure TypeScript

**Update `apps/shell/tsconfig.json`:**

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
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

---

### Step 11: Configure ESLint & Prettier

**Create `apps/shell/.eslintrc.js`:**

```javascript
module.exports = {
  extends: ['@repo/eslint-config/next.js'],
  rules: {
    // Add custom rules here
    '@next/next/no-html-link-for-pages': 'off',
  },
};
```

**Create `prettier.config.js` at root:**

```javascript
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  printWidth: 80,
  plugins: ['prettier-plugin-tailwindcss'],
};
```

---

### Step 12: Set Up Git Hooks (Optional but Recommended)

```bash
# Install Husky
pnpm add -D husky lint-staged

# Initialize Husky
pnpm dlx husky init

# Create pre-commit hook
echo "pnpm lint-staged" > .husky/pre-commit

# Configure lint-staged
```

**Add to root `package.json`:**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,mdx,css,yaml,yml}": [
      "prettier --write"
    ]
  }
}
```

---

### Step 13: Configure Turborepo

**Update `turbo.json` at root:**

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
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

### Step 14: Create Environment Variables

**Create `apps/shell/.env.example`:**

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME="VISION Platform"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase (Add in Phase 2)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=

# Claude API (for AI features)
# ANTHROPIC_API_KEY=

# OpenAI API (for embeddings)
# OPENAI_API_KEY=

# Analytics (Optional)
# NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

**Create `apps/shell/.env.local`:**

```bash
# Copy .env.example and fill in your values
cp .env.example .env.local
```

**Add to `.gitignore`:**

```
# Environment variables
.env
.env.local
.env.*.local
```

---

## ✅ Verification Steps

### 1. Install All Dependencies

```bash
# From root directory
pnpm install
```

### 2. Start Development Server

```bash
# Start the shell app
pnpm dev

# Or specifically for shell
pnpm --filter @vision/shell dev
```

**Expected output:**

```
• Packages in scope: @vision/shell
• Running dev in 1 package
@vision/shell:dev: > next dev --turbopack
@vision/shell:dev: ▲ Next.js 15.x
@vision/shell:dev: - Local:        http://localhost:3000
@vision/shell:dev: - Turbopack:    enabled
```

### 3. Verify Pages Load

Open browser and check:
- ✅ `http://localhost:3000` → Should redirect to `/dashboard`
- ✅ No console errors
- ✅ Tailwind styles loading
- ✅ Fast refresh working

### 4. Run Linting

```bash
pnpm lint
```

### 5. Test Build

```bash
pnpm build
```

---

## 📁 Final Directory Structure

```
vision-platform/
├── apps/
│   └── shell/                          # Main Platform Shell app
│       ├── src/
│       │   ├── app/                    # Next.js App Router
│       │   │   ├── (main)/            # Protected routes
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   └── globals.css
│       │   ├── components/             # React components
│       │   │   ├── layout/
│       │   │   ├── dashboard/
│       │   │   ├── documents/
│       │   │   └── ui/
│       │   ├── lib/                    # Utilities
│       │   ├── hooks/                  # Custom hooks
│       │   └── types/                  # TypeScript types
│       ├── public/                     # Static assets
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── @repo/ui/                       # Shared UI components
│   ├── @repo/eslint-config/            # ESLint config
│   └── @repo/typescript-config/        # TS config
│
├── turbo.json                          # Turborepo config
├── pnpm-workspace.yaml                 # pnpm workspaces
├── package.json                        # Root package.json
├── prettier.config.js
└── .gitignore
```

---

## 🎯 Next Steps

Now that the project is initialized, you can:

1. **Follow Component Build Guides**:
   - Component 03: Navigation Header
   - Component 01: Platform Dashboard
   - Component 02: Document Library

2. **Add Shared UI Package**:
   ```bash
   # Later, extract common components to packages/ui
   ```

3. **Set Up Supabase** (Phase 2):
   ```bash
   pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
   ```

4. **Add Testing** (Optional):
   ```bash
   pnpm add -D vitest @testing-library/react @testing-library/jest-dom
   ```

---

## 🔧 Useful Commands

```bash
# Development
pnpm dev                           # Start all apps
pnpm --filter @vision/shell dev    # Start shell only

# Building
pnpm build                         # Build all apps
pnpm --filter @vision/shell build  # Build shell only

# Linting
pnpm lint                          # Lint all packages
pnpm lint:fix                      # Auto-fix lint issues

# Formatting
pnpm format                        # Format all files

# Clean
pnpm clean                         # Remove node_modules & .next

# Add dependencies
pnpm add <package>                 # Add to root
pnpm --filter @vision/shell add <package>  # Add to shell

# Turborepo
turbo build --filter=@vision/shell # Build specific package
turbo build --force                # Force rebuild (ignore cache)
```

---

## 🚨 Common Issues & Solutions

### Issue 1: pnpm not found
```bash
npm install -g pnpm@9
```

### Issue 2: Turborepo not recognized
```bash
pnpm add turbo -w  # -w flag for workspace root
```

### Issue 3: TypeScript path aliases not working
```bash
# Verify tsconfig.json has correct paths
# Restart TypeScript server in VSCode (Cmd+Shift+P → Restart TS Server)
```

### Issue 4: Tailwind classes not applying
```bash
# Check tailwind.config.ts content paths
# Ensure globals.css is imported in layout.tsx
# Clear .next cache: rm -rf .next && pnpm dev
```

---

## 📚 Documentation Links

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Turborepo Handbook](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

---

## ✅ Completion Checklist

- [ ] Node.js 20+ installed
- [ ] pnpm 9+ installed
- [ ] Turborepo project created
- [ ] Next.js 15 + React 19 installed
- [ ] Tailwind CSS 4 configured
- [ ] TypeScript configured with path aliases
- [ ] ESLint & Prettier set up
- [ ] Project structure created
- [ ] Utils and helpers added
- [ ] Development server runs successfully
- [ ] Build completes without errors
- [ ] Ready to build components!

---

**Congratulations! 🎉**

You now have a production-ready, modern Next.js 15 monorepo with:
- ✅ Latest tech stack (2025)
- ✅ Optimal project structure
- ✅ Full TypeScript support
- ✅ Tailwind CSS 4 styling
- ✅ Turborepo caching
- ✅ Ready for component development

**Next**: Start building Component 03 (Navigation Header)!
