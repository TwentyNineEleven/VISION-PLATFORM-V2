# Technology Stack & Architecture
# VISION Platform V2

**Last Updated:** 2025-11-19
**Version:** 2.0

## Executive Summary

VISION Platform uses a modern, open-source technology stack optimized for nonprofit budgets while maintaining enterprise-grade security and scalability. The architecture is built on Next.js 14 (frontend), Supabase (backend/database), and Claude API (AI), deployed on Vercel with pnpm monorepo management.

**Key Principles:**
- **Open-Source First:** Avoid vendor lock-in, reduce costs
- **Nonprofit Budget-Conscious:** Cost-effective at scale
- **Modern & Maintainable:** Use current best practices
- **AI-Native:** Built for intelligent automation
- **Secure by Default:** Multi-tenant security baked in

---

## Frontend Stack

### Framework: Next.js 14.2+ (App Router)
**Reasoning:**
- Best-in-class React framework with Server Components
- Excellent SEO capabilities for platform marketing pages
- Built-in API routes for BFF (Backend for Frontend) pattern
- Automatic code splitting and optimization
- Edge runtime support for global performance
- Strong TypeScript support
- Large ecosystem and community

**Key Libraries:**
- **State Management:** Zustand 4.5+
  - Simpler than Redux, perfect for multi-app state
  - Minimal boilerplate, excellent TypeScript support
  - Easy to share state across apps while maintaining boundaries

- **UI Components:** Mantine UI 8.3+
  - Complete component library with theming system
  - Production-ready components out of the box
  - Excellent TypeScript support and documentation
  - Built-in accessibility features
  - Customizable through theme system (colors, spacing, typography)
  - Integrates with Tailwind CSS for additional utility classes

- **Forms:** React Hook Form 7.51+
  - Best performance for complex forms
  - Excellent validation integration
  - Minimal re-renders

- **Data Fetching:** TanStack Query (React Query) 5.28+
  - Intelligent caching and synchronization
  - Optimistic updates for better UX
  - Perfect for real-time Supabase data
  - Built-in loading/error states

- **Real-Time:** Supabase Realtime client
  - WebSocket subscriptions for live updates
  - Collaborative editing support
  - Presence tracking

- **Validation:** Zod 3.22+
  - Runtime type validation
  - Generates TypeScript types
  - Integrates with React Hook Form
  - API request/response validation

- **Date Handling:** date-fns 3.3+
  - Lightweight, functional, tree-shakeable
  - Better than Moment.js for bundle size

- **Rich Text Editing:** Tiptap 2.2+
  - Headless, extensible rich text editor
  - Markdown support
  - Collaborative editing ready
  - Used for documents, notes, content

- **Data Visualization:** Recharts 2.12+
  - React-native charts for dashboards
  - Responsive and accessible
  - Integrates well with data flow

- **File Uploads:** Uppy 3.24+
  - Drag-and-drop file uploads
  - Progress tracking
  - Integration with Supabase Storage
  - Image compression and optimization

### Testing Framework
- **Unit/Integration:** Vitest 1.4+
  - Fast, Vite-native test runner
  - Jest-compatible API
  - Excellent TypeScript support
  - Built-in coverage reporting

- **Component Testing:** Testing Library (React) 14.2+
  - User-centric testing approach
  - Accessibility-first selectors
  - Excellent async utilities

- **E2E Testing:** Playwright 1.42+
  - Cross-browser testing
  - Auto-wait, auto-retry built-in
  - Excellent debugging tools
  - Parallel execution
  - Visual regression testing

---

## Backend & Database Stack

### Backend: Supabase (Open-Source Firebase Alternative)
**Reasoning:**
- Open-source, self-hostable (no vendor lock-in)
- Built on PostgreSQL (battle-tested relational database)
- Real-time subscriptions out of the box
- Row Level Security (RLS) for multi-tenancy
- Edge Functions for serverless logic
- Built-in authentication
- Storage for documents/files
- Cost-effective for nonprofits

**Key Components:**
- **Database:** PostgreSQL 15+
  - Proven relational database
  - Full SQL support
  - JSON/JSONB for flexible data
  - Full-text search (tsvector)
  - PostGIS for geographic data (if needed)
  - pg_vector extension for AI embeddings

- **Authentication:** Supabase Auth
  - Email/password, magic links, OAuth
  - JWT tokens
  - Row Level Security integration
  - MFA support
  - Organization/tenant management

- **Storage:** Supabase Storage
  - S3-compatible object storage
  - Integrated with RLS
  - Image transformation APIs
  - CDN delivery

- **Edge Functions:** Deno Runtime
  - TypeScript-native serverless functions
  - AI API integration (Claude, OpenAI)
  - Webhooks processing
  - Background jobs
  - Scheduled tasks (cron)

- **Realtime:** Supabase Realtime
  - WebSocket connections
  - Database change streams
  - Presence tracking
  - Broadcast messaging

### Database Schema Management
- **Migrations:** Supabase CLI migrations
  - Version-controlled SQL migrations
  - Up/down migration support
  - Local development database
  - Preview branches

- **Type Generation:** Supabase TypeScript generator
  - Auto-generate types from database schema
  - Keep frontend/backend types in sync
  - Type-safe queries

### Vector Database (AI Search)
- **Extension:** pg_vector
  - Store vector embeddings in PostgreSQL
  - Similarity search for documents
  - Semantic search capabilities
  - Efficient indexing (HNSW, IVFFlat)

---

## AI Integration Stack

### Primary AI: Anthropic Claude API
**Reasoning:**
- Superior for long-form content generation
- Excellent instruction-following
- 200K token context window
- Strong safety and compliance features
- Competitive pricing
- Function calling for structured outputs

**Use Cases:**
- Content generation
- Analysis and recommendations
- Impact story generation
- Meeting minute generation
- Compliance guidance
- Insights generation

**Models:**
- **Claude 3.5 Sonnet:** Primary model for content generation
- **Claude 3.5 Haiku:** Fast, cost-effective for simple tasks
- **Claude 3 Opus:** Premium model for complex analysis (optional upgrade)

### Secondary AI: OpenAI API
**Reasoning:**
- Best embeddings model (text-embedding-3-large)
- Fallback for content generation
- DALL-E for image generation
- Whisper for voice input (accessibility)

**Use Cases:**
- Document embeddings for semantic search
- Fallback when Claude unavailable
- Image generation for reports
- Voice-to-text for accessibility

**Models:**
- **text-embedding-3-large:** Document embeddings
- **gpt-4-turbo:** Fallback for content generation
- **DALL-E 3:** Image generation (optional)
- **Whisper:** Voice input (optional)

### Local AI: Ollama (Cost Control)
**Reasoning:**
- Free, self-hosted AI models
- Privacy for sensitive data
- Fallback when budget exhausted
- Offline capability

**Use Cases:**
- Budget exhaustion fallback
- Sensitive data processing
- Development environment
- Cost-effective simple tasks

**Models:**
- **Llama 3.1 8B:** Fast, efficient for simple tasks
- **Mistral 7B:** Alternative for variation
- **Phi-3 Mini:** Ultra-lightweight for basic tasks

---

## Infrastructure & DevOps

### Hosting: Vercel
**Reasoning:**
- Next.js creators (best integration)
- Global edge network
- Automatic preview deployments
- Zero-config deployment
- Excellent DX (Developer Experience)
- Free tier for development
- Affordable scaling

**Features Used:**
- Next.js App Router hosting
- Edge Functions
- Serverless Functions
- Preview deployments per PR
- Environment variables
- Custom domains
- Analytics

### CI/CD: GitHub Actions
**Reasoning:**
- Free for public/private repos
- Tight GitHub integration
- Flexible workflow definitions
- Parallel job execution
- Reusable workflows
- Secrets management

**Workflows:**
- Continuous Integration (tests, linting, type-checking)
- Preview deployments (Vercel)
- Production deployments
- Database migrations
- Security scanning
- Dependency updates

### Monitoring & Error Tracking: Sentry
**Reasoning:**
- Best-in-class error tracking
- Source map support
- User context tracking
- Performance monitoring
- Nonprofit discount program

**Features:**
- Frontend error tracking
- Backend error tracking
- Performance monitoring
- User session replay
- Alert notifications

### Analytics: PostHog (Open-Source)
**Reasoning:**
- Privacy-first analytics
- Self-hostable
- Feature flags
- Session recording
- Funnel analysis
- Free for reasonable usage

---

## Development Tools

### IDE: VS Code / Cursor
**Reasoning:**
- Industry standard
- AI-native IDE options available
- Excellent for rapid development
- Monorepo support
- TypeScript intellisense

**Essential Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens
- Error Lens
- Supabase extension

### Version Control: Git + GitHub
**Reasoning:**
- Industry standard
- Excellent collaboration tools
- Free private repos
- GitHub Actions integration
- Project management tools

**Strategy:**
- Main branch (production)
- Develop branch (staging)
- Feature branches
- PR-based code review
- Protected branches

### Package Manager: pnpm 8.15+
**Reasoning:**
- Fastest package manager
- Efficient disk space usage
- Built-in monorepo support
- Strict dependency resolution
- Compatible with npm registry

**Workspace Structure:**
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Build Tool: Turbo 1.12+
**Reasoning:**
- Intelligent build caching
- Parallel execution
- Incremental builds
- Remote caching support
- Perfect for monorepos

---

## Security Stack

### Authentication & Authorization
- **Provider:** Supabase Auth
- **Method:** JWT tokens, OAuth 2.0
- **MFA:** Time-based OTP (TOTP)
- **Session Management:** Refresh token rotation
- **Password Requirements:** 12+ chars, complexity rules

### Data Protection
- **Encryption at Rest:** AES-256 (Supabase default)
- **Encryption in Transit:** TLS 1.3
- **Secret Management:** Vercel Environment Variables + GitHub Secrets
- **PII Protection:** Automated detection in logs

### Security Scanning
- **SAST:** ESLint security rules, Semgrep
- **Dependency Scanning:** Dependabot, Snyk
- **Secret Scanning:** GitHub Secret Scanning, TruffleHog
- **Container Scanning:** (if needed) Trivy

### Compliance
- **GDPR:** Data privacy controls, right to deletion
- **SOC 2:** Preparation path (audit logging, access controls)
- **WCAG 2.1 AA:** Accessibility compliance

---

## Architecture Patterns

### Frontend Architecture
- **Pattern:** Micro-frontends with shared packages
- **App Router:** Next.js App Router for each application
- **Shared UI:** Component library in packages/ui
- **State:** Zustand stores with clear boundaries
- **Data Fetching:** TanStack Query with Supabase client

**Structure:**
```
apps/
  platform-shell/        # Main launcher
  [app-directories]/     # Individual applications

packages/
  ui/                   # Shared components
  database/             # Supabase client, hooks, types
  auth/                 # Authentication
  ai-functions/         # AI utilities
  documents/            # Document management
```

### Backend Architecture
- **Pattern:** Serverless + Edge Functions
- **Multi-Tenancy:** Row Level Security (RLS)
- **API:** Next.js API Routes + Supabase Edge Functions
- **Real-Time:** Supabase Realtime subscriptions

### Database Architecture
- **Multi-Tenancy Strategy:** Shared schema with org_id column
- **RLS Policies:** Organization-level data isolation
- **Indexing:** Strategic indexes on foreign keys, queries
- **Partitioning:** (Future) Partition large tables by organization

---

## Environment Variables Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# AI Services
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434

# Vercel
VERCEL_URL=
VERCEL_ENV=

# Monitoring
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
POSTHOG_KEY=

# Email
RESEND_API_KEY=

# Feature Flags
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_ENABLE_REALTIME=true
```

---

## Technology Decision Rationale

### Why Supabase over Firebase?
- ✅ Open-source, no vendor lock-in
- ✅ PostgreSQL (relational, powerful queries)
- ✅ Lower costs at scale
- ✅ Self-hosting option
- ✅ Better for complex data relationships
- ❌ Less mature ecosystem
- ❌ Learning curve for team

### Why Next.js over Create React App?
- ✅ Server-side rendering for SEO
- ✅ Built-in API routes
- ✅ Automatic optimization
- ✅ App Router for modern patterns
- ✅ Better performance
- ❌ More complex than CRA
- ❌ Vercel-optimized (but not locked in)

### Why Zustand over Redux?
- ✅ Simpler API, less boilerplate
- ✅ Better TypeScript support
- ✅ Smaller bundle size
- ✅ Easier to learn
- ❌ Smaller ecosystem
- ❌ Fewer debugging tools

### Why Claude over OpenAI?
- ✅ Better at long-form content
- ✅ Stronger safety features
- ✅ 200K context window
- ✅ Competitive pricing
- ❌ Newer API, less community support
- ❌ Fewer integrations

### Why Monorepo over Separate Repos?
- ✅ Shared code between apps
- ✅ Atomic cross-app changes
- ✅ Consistent tooling
- ✅ Easier dependency management
- ❌ More complex build setup
- ❌ Larger repository size

---

## Scalability Considerations

### Initial Scale (Target)
- Supabase handles reasonable database and storage needs
- Vercel handles moderate traffic
- Manual scaling intervention points clear

### Mid-Scale Growth
- Upgrade Supabase plan as needed
- Add database read replicas
- Implement Redis caching
- Consider Edge Caching for static content

### Large-Scale Operations
- Consider database sharding
- Move to dedicated infrastructure (if needed)
- Implement multi-region deployment
- Add CDN (Cloudflare)
- Dedicated AI service with load balancing

---

## Technology Evaluation & Updates

**Review Approach:** Evaluate quarterly or as needs evolve

**Evaluation Criteria:**
- Performance benchmarks
- Cost efficiency
- Developer experience
- Community support
- Security updates
- Scalability needs

**Potential Future Considerations:**
- Evaluate Astro for marketing pages (better performance)
- Consider Drizzle ORM for enhanced type safety
- Evaluate tRPC for end-to-end type safety
- Consider Bun as alternative to Node.js runtime

---

## Cost Considerations

### Infrastructure Costs (Variable by Usage)
- **Vercel:** Scales with usage
- **Supabase:** Tiered pricing based on usage
- **Sentry:** Team plan (nonprofit discounts available)
- **PostHog:** Free tier or self-hosted
- **Domain/SSL:** Minimal cost

### AI Costs (Highly Variable)
- **Claude API:** Usage-based pricing
- **OpenAI Embeddings:** Usage-based pricing
- **Ollama:** Free (self-hosted)

### Cost Management Strategies
- AI usage limits per organization
- Cost tracking and visibility
- Fallback to local models when appropriate
- Optimize prompt efficiency
- Cache AI responses where appropriate

### Pricing Strategy Considerations
- Per-user pricing
- Per-organization pricing
- Tiered feature pricing
- Usage-based pricing
- Nonprofit-friendly tiers

---

**Last Updated:** 2025-11-19
**Version:** 2.0 - Technology Reference Guide
**For:** VISION Platform V2
**Status:** Living Document - Update as technology evolves
