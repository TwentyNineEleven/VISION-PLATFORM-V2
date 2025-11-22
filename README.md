# VISION Platform Shell 🚀

**Microsoft 365 for Nonprofits**

A modern, production-ready platform shell built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4, designed to integrate with your Glow UI design system.

---

## 🎯 Project Status

✅ **SETUP COMPLETE** - Ready for component development

**Tech Stack:**
- Next.js 15.5.6 + React 19
- TypeScript 5
- Tailwind CSS 4
- Turborepo + pnpm
- Radix UI Components

**Development Server:** http://localhost:3001

---

## 📚 Quick Start

```bash
# Install dependencies (if not already done)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint

# Format code
pnpm format
```

---

## 📖 Documentation

### Setup & Configuration
- **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - Complete setup summary and next steps
- **[GLOW_UI_INTEGRATION_GUIDE.md](GLOW_UI_INTEGRATION_GUIDE.md)** - How to extract and apply Glow UI design tokens

### Component Build Guides
Located in `Claude Documentation/files/`:
- [Component_03_Navigation_Header.md](Claude%20Documentation/files/Component_03_Navigation_Header.md) - Build first (1-2 days)
- [Component_01_Platform_Dashboard.md](Claude%20Documentation/files/Component_01_Platform_Dashboard.md) - Build second (2-3 days)
- [Component_02_Document_Library.md](Claude%20Documentation/files/Component_02_Document_Library.md) - Priority component (3-4 days)

### Reference Guides
- [README.md](Claude%20Documentation/files/README.md) - Overview of all documentation
- [Quick_Start_Commands.md](Claude%20Documentation/files/Quick_Start_Commands.md) - Command reference
- [Project_Initialization_Guide.md](Claude%20Documentation/files/Project_Initialization_Guide.md) - Detailed setup guide
- [Component_Index_Master.md](Claude%20Documentation/files/Component_Index_Master.md) - All components overview

---

## 📁 Project Structure

```
VISION-PLATFORM-V2/
├── apps/
│   └── shell/                          # Main Platform Shell app
│       ├── src/
│       │   ├── app/                    # Next.js App Router
│       │   │   ├── dashboard/          # Dashboard page
│       │   │   ├── layout.tsx          # Root layout
│       │   │   ├── page.tsx            # Home (redirects)
│       │   │   └── globals.css         # Global styles + design tokens
│       │   ├── components/             # React components
│       │   │   ├── layout/            # Navigation, Header, Footer
│       │   │   ├── dashboard/         # Dashboard components
│       │   │   ├── documents/         # Document library
│       │   │   ├── settings/          # Settings pages
│       │   │   └── ui/                # Reusable UI components
│       │   ├── lib/                    # Utilities
│       │   │   ├── utils.ts           # Helper functions
│       │   │   └── constants.ts       # App constants
│       │   ├── hooks/                  # Custom React hooks
│       │   └── types/                  # TypeScript types
│       ├── public/                     # Static assets
│       ├── next.config.ts             # Next.js config
│       ├── tailwind.config.ts         # Tailwind config
│       └── tsconfig.json              # TypeScript config
├── packages/                           # Shared packages (future)
│   ├── ui/                            # Shared UI components
│   └── config/                        # Shared configs
├── Claude Documentation/               # Build guides
├── documentation/                      # Additional docs
├── turbo.json                         # Turborepo config
├── pnpm-workspace.yaml                # Workspace config
└── package.json                       # Root package.json
```

---

## 🎨 Glow UI Integration

Your project is configured to work with Glow UI design tokens:

**Next Steps:**
1. Open your Glow UI Figma file
2. Extract design tokens (colors, typography, spacing)
3. Update [tailwind.config.ts](apps/shell/tailwind.config.ts)
4. Update [globals.css](apps/shell/src/app/globals.css)

**See:** [GLOW_UI_INTEGRATION_GUIDE.md](GLOW_UI_INTEGRATION_GUIDE.md) for detailed instructions

---

## 🏗️ Building Components

### Recommended Build Order

**Week 1: Foundation**
1. Component 03: Navigation Header (1-2 days)
2. Component 01: Platform Dashboard (2-3 days)

**Week 2: Core Feature**
3. Component 02: Document Library (3-4 days) ⭐ PRIORITY

### Build Process

For each component:
1. **Read** the component guide
2. **Extract** matching components from Glow UI Figma
3. **Build** using Radix UI primitives + Tailwind
4. **Test** all interactions and responsive behavior
5. **Complete** the testing checklist in the guide

---

## 🧪 Testing

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# All checks
pnpm type-check && pnpm lint && pnpm build
```

---

## 🔧 Configuration Files

- [next.config.ts](apps/shell/next.config.ts) - Next.js configuration
- [tailwind.config.ts](apps/shell/tailwind.config.ts) - Tailwind + design tokens
- [tsconfig.json](apps/shell/tsconfig.json) - TypeScript with path aliases
- [turbo.json](turbo.json) - Turborepo pipeline
- [.eslintrc.json](apps/shell/.eslintrc.json) - ESLint rules
- [.prettierrc](.prettierrc) - Prettier formatting

---

## 🚀 Deployment

**Recommended:** Vercel (seamless Next.js integration)

```bash
# Build for production
pnpm build

# Test production build locally
cd apps/shell && pnpm start
```

---

## 📞 Need Help?

- Check [SETUP_COMPLETE.md](SETUP_COMPLETE.md) for troubleshooting
- Review component guides for detailed instructions
- Each guide has a troubleshooting section
- Use Claude Code for AI-assisted development

---

## 📊 Progress Tracking

- [ ] Glow UI design tokens extracted and applied
- [ ] Component 03: Navigation Header built
- [ ] Component 01: Platform Dashboard built  
- [ ] Component 02: Document Library built
- [ ] Settings pages built
- [ ] Authentication integrated
- [ ] Supabase backend connected

---

## 🎉 Ready to Build!

Your VISION Platform Shell is production-ready with:
- ✅ Modern tech stack (Next.js 15, React 19, TypeScript 5)
- ✅ Turborepo monorepo for scalability
- ✅ Tailwind CSS 4 with design token system
- ✅ Comprehensive component guides
- ✅ Glow UI integration ready

**Start building:** Extract Glow UI tokens, then build Component 03 (Navigation Header)

**Development server:** http://localhost:3001

---

**Built with ❤️ for nonprofit organizations**
