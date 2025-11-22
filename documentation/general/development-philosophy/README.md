# CapacityIQ Development Guide - Ultimate Reference

**Version:** 1.0.0  
**Last Updated:** November 11, 2025  
**Status:** Production-Ready

---

## 🎯 Purpose & Vision

This Development Guide is the **single source of truth** for building VISION Platform applications based on the proven patterns, standards, and best practices extracted from CapacityIQ—the flagship nonprofit capacity assessment platform.

**Mission:** Enable rapid development of high-quality, enterprise-grade SaaS applications for nonprofits while maintaining consistency, quality, and the nonprofit-first principles that make our platform successful.

---

## 📋 What's Inside

This guide provides comprehensive documentation across 10 core areas:

### 00. Overview (You Are Here)
- **[README.md](./README.md)** - This document
- **[tech-stack-decisions.md](./tech-stack-decisions.md)** - Why we chose each technology
- **[architecture-principles.md](./architecture-principles.md)** - Core architectural patterns
- **[development-philosophy.md](./development-philosophy.md)** - Nonprofit-first development

### 01. Project Structure
- Complete monorepo setup guide
- File organization standards
- Naming conventions
- Module boundaries

### 02. Frontend Standards
- React patterns & component architecture
- TypeScript configuration & best practices
- Tailwind CSS design system
- Mantine UI integration
- State management (React Query)
- Form handling patterns
- Routing strategies

### 03. Backend Standards
- Complete Supabase setup & configuration
- Database schema design patterns
- Row-Level Security (RLS) policies
- Edge Functions implementation
- Real-time subscriptions
- Authentication & authorization flows

### 04. AI Integration
- Claude API integration patterns
- Tool Calling for structured output
- Prompt engineering best practices
- Cost optimization with caching
- RAG implementation (future)
- AI agent configuration

### 05. Design System
- 2911 Brand colors & typography
- Design tokens
- Component library
- Accessibility standards (WCAG 2.1 AA)
- Dark mode implementation
- Responsive design patterns

### 06. Testing Standards
- Testing philosophy & strategy
- Unit testing with Vitest
- Integration testing
- E2E testing with Playwright
- Accessibility testing
- Performance testing

### 07. DevOps & Deployment
- Vercel deployment & optimization
- Environment management
- CI/CD with GitHub Actions
- Performance monitoring
- Error tracking with Sentry
- Database migrations

### 08. Reusable Templates
- **Project boilerplate** - Full starter template
- **Component templates** - Reusable UI patterns
- **API templates** - Backend service patterns
- **Configuration templates** - All config files
- **Deployment templates** - Infrastructure as code

### 09. Development Process
- Feature development workflow
- Code review standards
- Git branching strategy
- Documentation requirements
- Quality gates & checkpoints

### 10. Future App Framework
- Planning new VISION Platform apps
- Rapid development strategies
- Platform integration patterns
- Scaling considerations
- Maintenance best practices

---

## 🚀 Quick Start Paths

### For New Developers
1. Read **[development-philosophy.md](./development-philosophy.md)**
2. Review **[tech-stack-decisions.md](./tech-stack-decisions.md)**
3. Explore **[../01-Project-Structure/](../01-Project-Structure/)**
4. Clone the **[project boilerplate](../08-Reusable-Templates/project-boilerplate/)**

### For UI/UX Development
1. Start with **[../05-Design-System/](../05-Design-System/)**
2. Review **[../02-Frontend-Standards/](../02-Frontend-Standards/)**
3. Explore the **[component library](../08-Reusable-Templates/component-templates/)**
4. Check **[accessibility standards](../05-Design-System/accessibility.md)**

### For Backend Development
1. Begin with **[../03-Backend-Standards/supabase-setup.md](../03-Backend-Standards/supabase-setup.md)**
2. Study **[database patterns](../03-Backend-Standards/database-patterns.md)**
3. Review **[RLS policies](../03-Backend-Standards/rls-policies.md)**
4. Examine **[Edge Functions](../03-Backend-Standards/edge-functions.md)**

### For AI Integration
1. Review **[../04-AI-Integration/claude-api-patterns.md](../04-AI-Integration/claude-api-patterns.md)**
2. Study **[prompt engineering](../04-AI-Integration/prompt-engineering.md)**
3. Learn **[cost optimization](../04-AI-Integration/claude-api-patterns.md#cost-optimization)**

### For Deployment
1. Read **[../07-DevOps-Deployment/vercel-config.md](../07-DevOps-Deployment/vercel-config.md)**
2. Review **[environment management](../07-DevOps-Deployment/environment-management.md)**
3. Study **[CI/CD setup](../07-DevOps-Deployment/ci-cd-setup.md)**

---

## 🏗️ Technology Stack at a Glance

### Frontend
- **React 18** - UI framework
- **TypeScript 5.3** - Type-safe JavaScript
- **Vite 7** - Build tool & dev server
- **Mantine 8.3** - UI component library
- **Tailwind CSS 3.4** - Utility-first styling
- **React Router 6** - Client-side routing
- **TanStack Query 5** - Data fetching & caching
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Recharts** - Data visualization

### Backend
- **Supabase** - PostgreSQL + Auth + Storage + Realtime
- **PostgreSQL 17** - Primary database
- **Deno** - Edge Functions runtime
- **Row-Level Security** - Data access control

### AI Integration
- **Claude 4.5 (Anthropic)** - LLM for capacity analysis
- **Tool Calling** - Structured JSON output
- **Prompt Caching** - 90% cost reduction

### DevOps
- **Vercel** - Frontend hosting & deployment
- **GitHub Actions** - CI/CD pipeline
- **Sentry** - Error monitoring
- **Playwright** - E2E testing
- **Vitest** - Unit & integration testing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript strict mode** - Type safety
- **Storybook** - Component development

---

## 📊 CapacityIQ by the Numbers

### Codebase Statistics
- **Total Files:** 500+
- **Lines of Code:** 75,000+
- **React Components:** 180+
- **Custom Hooks:** 45+
- **Edge Functions:** 25+
- **Database Tables:** 32
- **Migrations:** 68
- **TypeScript Coverage:** 100% (new code)

### Performance Metrics
- **Lighthouse Score:** 95+ across all categories
- **First Contentful Paint:** < 1.2s
- **Time to Interactive:** < 2.5s
- **Bundle Size:** < 500 KB (initial load)
- **Code Splitting:** 8 vendor chunks

### Quality Standards
- **Test Coverage:** 85%+ (critical paths)
- **Accessibility:** WCAG 2.1 AA compliant
- **TypeScript Strict Mode:** Enabled
- **ESLint Max Warnings:** 120
- **Zero Security Vulnerabilities:** Production

---

## 🎓 Core Principles

### 1. Nonprofit-First Development
- **Affordability:** Minimize costs, maximize value
- **Simplicity:** Easy to use, even with limited tech expertise
- **Accessibility:** WCAG 2.1 AA compliance required
- **Mission-Driven:** Always prioritize nonprofit outcomes

### 2. Quality Standards
- **Type Safety:** TypeScript strict mode everywhere
- **Testing:** Unit, integration, E2E, and accessibility tests
- **Performance:** Lighthouse 95+ score target
- **Security:** Zero-trust architecture with RLS

### 3. Developer Experience
- **Clear Documentation:** Every pattern documented
- **Fast Iteration:** Hot reload < 500ms
- **Error Messages:** Helpful, actionable guidance
- **Tooling:** Best-in-class developer tools

### 4. Scalability & Maintainability
- **Modular Architecture:** Clear separation of concerns
- **Reusable Components:** DRY principles
- **Performance Optimization:** Lazy loading, code splitting
- **Database Design:** Normalized schemas with proper indexes

---

## 📖 How to Use This Guide

### Reading Order for Different Roles

#### **Full-Stack Developer (Start Here)**
1. Overview (00) → Philosophy & Tech Stack
2. Project Structure (01) → Understand organization
3. Frontend (02) + Backend (03) → Core patterns
4. Design System (05) → UI consistency
5. Testing (06) → Quality assurance
6. DevOps (07) → Deployment pipeline

#### **Frontend Specialist**
1. Overview (00) → Context
2. Project Structure (01) → File organization
3. Frontend Standards (02) → React/TypeScript patterns
4. Design System (05) → UI components & themes
5. Testing (06) → Component testing

#### **Backend Specialist**
1. Overview (00) → Context
2. Backend Standards (03) → Supabase & PostgreSQL
3. AI Integration (04) → Edge Functions with Claude
4. Testing (06) → Integration testing
5. DevOps (07) → Database migrations

#### **AI Engineer**
1. Overview (00) → Context
2. AI Integration (04) → Claude API patterns
3. Backend Standards (03) → Edge Functions
4. Testing (06) → AI output validation

#### **DevOps Engineer**
1. Overview (00) → Tech stack
2. DevOps (07) → Complete deployment guide
3. Backend (03) → Database migrations
4. Testing (06) → CI/CD integration

---

## 🔄 Continuous Improvement

This guide is a living document. As CapacityIQ evolves and new patterns emerge:

1. **Document immediately** - Capture decisions as they happen
2. **Update patterns** - Keep best practices current
3. **Add examples** - Real code snippets from production
4. **Validate regularly** - Ensure patterns still work
5. **Share learnings** - Cross-pollinate with other VISION apps

---

## 🆘 Getting Help

### Internal Resources
- **CapacityIQ Codebase:** `/capacityiq` directory
- **Documentation:** This guide + inline code comments
- **Example Code:** `src/components/ui/` for UI patterns
- **Templates:** `documents/app/Development-Guide/08-Reusable-Templates/`

### External Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Mantine UI Documentation](https://mantine.dev)
- [Claude API Reference](https://docs.anthropic.com)
- [React Query Documentation](https://tanstack.com/query)
- [Vercel Documentation](https://vercel.com/docs)

### Community
- Anthropic Claude Community
- Supabase Discord
- Mantine Discord
- React Community

---

## 📝 Contributing to This Guide

When adding or updating documentation:

1. **Follow the Structure:** Use existing file templates
2. **Be Specific:** Include code examples
3. **Explain Why:** Not just what, but why we do it
4. **Link Related Docs:** Cross-reference related sections
5. **Update Index:** Keep README files current
6. **Test Examples:** Ensure code samples work

---

## 🎉 Success Stories

CapacityIQ has successfully served:

- **100+ nonprofit organizations**
- **Comprehensive capacity assessments** across 10 domains
- **AI-powered development plans** with Claude 4.5
- **Real-time collaboration** with Supabase
- **Enterprise-grade security** with RLS
- **Sub-2-second load times** on Vercel

This guide captures the patterns that made it possible.

---

## 🚦 Next Steps

Now that you understand the guide structure, choose your path:

- **Building a new app?** → Start with [10-Future-App-Framework](../10-Future-App-Framework/)
- **Joining CapacityIQ?** → Read [development-philosophy.md](./development-philosophy.md)
- **Curious about decisions?** → Check [tech-stack-decisions.md](./tech-stack-decisions.md)
- **Ready to code?** → Clone the [project boilerplate](../08-Reusable-Templates/project-boilerplate/)

---

**Welcome to the VISION Platform development ecosystem. Let's build something amazing for nonprofits! 🌟**

