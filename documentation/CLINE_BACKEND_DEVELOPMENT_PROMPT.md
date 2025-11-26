# VISION Platform V2 - Backend Development Implementation Prompt for Cline

## 🎯 Mission Overview

You are tasked with implementing a complete backend migration for the VISION Platform V2 application, transitioning from localStorage/mock data to a production-ready backend using **Supabase** (PostgreSQL + Auth + Storage + Realtime) and **Vercel** (Edge Functions + Deployment).

This is a **complex, multi-phase migration** involving:
- **10 service layer conversions** (organizationService, profileService, teamService, etc.)
- **40+ database tables** with Row Level Security (RLS)
- **100+ API endpoints** across 7 functional domains
- **Multi-tenant architecture** with organization-level data isolation
- **Real-time notifications** with Supabase Realtime
- **File storage integration** with Supabase Storage
- **Stripe billing integration** for subscriptions and payments
- **18 sequential database migrations**

**Estimated Effort:** 312 hours (7-8 weeks with 2 developers)

---

## 📚 Critical Context Documents

Before starting, review these documents in order:

1. **[SUPABASE_BACKEND_INTEGRATION_PLAN.md](./SUPABASE_BACKEND_INTEGRATION_PLAN.md)** - Complete technical specification with:
   - Database schema (40+ tables)
   - Row Level Security policies
   - Service layer conversion requirements
   - API endpoint specifications
   - Implementation priority (7 phases)

2. **[COMPLETE_WORK_VERIFICATION_PROMPT.md](./COMPLETE_WORK_VERIFICATION_PROMPT.md)** - Frontend completion verification

3. **Current Codebase Structure:**
   - `/apps/shell/src/services/` - Service layer files to convert
   - `/apps/shell/src/types/` - TypeScript interfaces
   - `/apps/shell/src/lib/mock-data.ts` - Mock data to migrate
   - `/apps/shell/src/app/` - Next.js 15 app routes

---

## 🏗️ Architecture Overview

### Current State (Mock Data)
```
Frontend (Next.js 15 + React 19)
    ↓
Service Layer (localStorage)
    ↓
Mock Data (static JSON in /lib/mock-data.ts)
```

### Target State (Supabase + Vercel)
```
Frontend (Next.js 15 + React 19)
    ↓
Service Layer (Supabase Client SDK)
    ↓
Vercel Edge Functions (API middleware)
    ↓
Supabase PostgreSQL (with RLS)
Supabase Auth (JWT tokens)
Supabase Storage (file uploads)
Supabase Realtime (subscriptions)
```

### Multi-Tenant Strategy
- **Single database** with Row Level Security (RLS)
- **Organization-level isolation** via RLS policies
- **JWT tokens** contain user_id and organization_id
- **Database-level security** (no application-layer filtering needed)

---

## 📋 Implementation Phases

## PHASE 1: Foundation & Authentication (Week 1-2) - 40 hours

### Objectives
- Set up Supabase project and environments
- Implement authentication system
- Create user management infrastructure
- Configure JWT tokens and session handling

### Tasks

#### 1.1 Supabase Project Setup
```bash
# Create Supabase project
npx supabase init
npx supabase link --project-ref <your-project-id>
npx supabase db reset
```

**Deliverables:**
- [ ] Supabase project created (dev + staging + production)
- [ ] Environment variables configured in `.env.local`:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
  SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```
- [ ] Supabase CLI installed and configured
- [ ] GitHub repository secrets configured for CI/CD

#### 1.2 Database Foundation Migration

**File:** `/supabase/migrations/20240101000001_create_users_tables.sql`

```sql
-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User preferences
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  notifications_enabled BOOLEAN DEFAULT true,
  email_digest TEXT DEFAULT 'daily' CHECK (email_digest IN ('realtime', 'daily', 'weekly', 'never')),
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own preferences"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences
  FOR ALL
  USING (auth.uid() = user_id);
```

**Validation:**
```bash
# Run migration
npx supabase db push

# Verify tables created
npx supabase db diff
```

**Deliverables:**
- [ ] Migration file created and applied
- [ ] Tables visible in Supabase dashboard
- [ ] RLS policies active and tested

#### 1.3 Supabase Client Setup

**File:** `/apps/shell/src/lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**File:** `/apps/shell/src/lib/supabase/server.ts`

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
```

**File:** `/apps/shell/src/lib/supabase/middleware.ts`

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}
```

**File:** `/apps/shell/middleware.ts`

```typescript
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

**Deliverables:**
- [ ] Supabase client utilities created
- [ ] Middleware configured for session management
- [ ] Type definitions generated from database schema

#### 1.4 Authentication API Endpoints

**File:** `/apps/shell/src/app/api/auth/signup/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const supabase = await createClient();

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user!.id,
        email,
        name,
      });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    // Create default preferences
    const { error: prefsError } = await supabase
      .from('user_preferences')
      .insert({
        user_id: authData.user!.id,
      });

    if (prefsError) {
      console.warn('Failed to create preferences:', prefsError);
    }

    return NextResponse.json({
      user: {
        id: authData.user!.id,
        email,
        name,
      },
      session: authData.session,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**File:** `/apps/shell/src/app/api/auth/signin/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update last_active_at timestamp
    await supabase
      .from('organization_members')
      .update({ last_active_at: new Date().toISOString() })
      .eq('user_id', data.user.id);

    return NextResponse.json({
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**File:** `/apps/shell/src/app/api/auth/signout/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**File:** `/apps/shell/src/app/api/auth/reset-password/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/confirm`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Deliverables:**
- [ ] All auth endpoints created and tested
- [ ] Sign up flow creates user + profile + preferences
- [ ] Sign in updates last_active_at timestamp
- [ ] Password reset sends email correctly
- [ ] Sign out clears session

#### 1.5 Convert profileService.ts

**File:** `/apps/shell/src/services/profileService.ts`

**BEFORE (localStorage):**
```typescript
async getProfile(): Promise<UserProfile | null> {
  const raw = window.localStorage.getItem('vision.platform.profile');
  if (!raw) return null;
  return JSON.parse(raw);
}
```

**AFTER (Supabase):**
```typescript
'use client';

import { createClient } from '@/lib/supabase/client';
import type { UserProfile, UserPreferences } from '@/types';

export const profileService = {
  async getProfile(): Promise<UserProfile | null> {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*, user_preferences(*)')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar_url: data.avatar_url,
      preferences: data.user_preferences?.[0] || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        avatar_url: updates.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updatePreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        ...prefs,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async uploadAvatar(file: File): Promise<string> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update user profile with new avatar URL
    await this.updateProfile({ avatar_url: data.publicUrl });

    return data.publicUrl;
  },
};
```

**Deliverables:**
- [ ] profileService converted to Supabase
- [ ] All methods tested (getProfile, updateProfile, updatePreferences)
- [ ] Avatar upload working with Supabase Storage
- [ ] localStorage fallback removed

#### 1.6 Testing & Validation

**Test Script:** `/apps/shell/src/tests/auth.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { createClient } from '@/lib/supabase/client';

describe('Authentication Flow', () => {
  it('should sign up new user', async () => {
    const supabase = createClient();

    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User',
        },
      },
    });

    expect(error).toBeNull();
    expect(data.user).toBeDefined();
    expect(data.user?.email).toBe(testEmail);
  });

  it('should sign in existing user', async () => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'TestPassword123!',
    });

    expect(error).toBeNull();
    expect(data.session).toBeDefined();
  });

  it('should enforce RLS policies', async () => {
    const supabase = createClient();

    // Try to access other user's data
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', 'different-user-id')
      .single();

    expect(data).toBeNull();
    expect(error).toBeDefined();
  });
});
```

**Manual Testing Checklist:**
- [ ] Sign up creates user in auth.users
- [ ] Sign up creates profile in public.users
- [ ] Sign up creates preferences in public.user_preferences
- [ ] Sign in returns valid JWT token
- [ ] JWT token contains user_id
- [ ] RLS policies prevent cross-user access
- [ ] Sign out clears session
- [ ] Password reset sends email
- [ ] Profile update works
- [ ] Preferences update works
- [ ] Avatar upload works

**Phase 1 Completion Criteria:**
- [ ] All migrations applied successfully
- [ ] All auth endpoints working
- [ ] profileService fully converted
- [ ] All tests passing
- [ ] No localStorage dependencies for auth/profile
- [ ] Production build passes
- [ ] Dev server runs without errors

---

## PHASE 2: Organizations & Teams (Week 2-3) - 48 hours

### Objectives
- Implement multi-tenant organization structure
- Create team membership management
- Build invite system with email delivery
- Enforce organization-level RLS policies

### Tasks

#### 2.1 Organizations Migration

**File:** `/supabase/migrations/20240101000002_create_organizations_tables.sql`

```sql
-- Organizations
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  website TEXT,
  industry TEXT,
  ein TEXT,
  logo TEXT,
  mission TEXT,
  founded_year INTEGER,
  staff_count INTEGER,
  annual_budget TEXT,
  focus_areas TEXT[],
  street TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  primary_color TEXT DEFAULT '#2563eb',
  secondary_color TEXT DEFAULT '#9333ea',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organization members
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'org_admin', 'funder_admin', 'member', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
  invited_by UUID REFERENCES public.users(id),
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Organization invites
CREATE TABLE public.organization_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'org_admin', 'funder_admin', 'member', 'viewer')),
  invited_by UUID NOT NULL REFERENCES public.users(id),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_org_members_org_id ON public.organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON public.organization_members(user_id);
CREATE INDEX idx_org_invites_org_id ON public.organization_invites(organization_id);
CREATE INDEX idx_org_invites_email ON public.organization_invites(email);
CREATE INDEX idx_org_invites_token ON public.organization_invites(token);

-- Triggers
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at
  BEFORE UPDATE ON public.organization_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_invites_updated_at
  BEFORE UPDATE ON public.organization_invites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Organizations
CREATE POLICY "Members can view organization"
  ON public.organizations
  FOR SELECT
  USING (
    id IN (
      SELECT organization_id
      FROM public.organization_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Org admins can update organization"
  ON public.organizations
  FOR UPDATE
  USING (
    id IN (
      SELECT organization_id
      FROM public.organization_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('org_admin', 'super_admin')
    )
  );

CREATE POLICY "Super admins can create organizations"
  ON public.organizations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.organization_members
      WHERE user_id = auth.uid()
        AND role = 'super_admin'
        AND status = 'active'
    )
  );

-- RLS Policies for Organization Members
CREATE POLICY "Members can view org members"
  ON public.organization_members
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.organization_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Org admins can manage members"
  ON public.organization_members
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.organization_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('org_admin', 'super_admin')
    )
  );

-- RLS Policies for Organization Invites
CREATE POLICY "Org admins can view invites"
  ON public.organization_invites
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.organization_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('org_admin', 'super_admin')
    )
  );

CREATE POLICY "Org admins can manage invites"
  ON public.organization_invites
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.organization_members
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('org_admin', 'super_admin')
    )
  );
```

**Deliverables:**
- [ ] Migration applied successfully
- [ ] All tables and indexes created
- [ ] RLS policies active

#### 2.2 Convert organizationService.ts

**File:** `/apps/shell/src/services/organizationService.ts`

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';
import type { Organization, OrganizationBrandColors } from '@/types/organization';

const DEFAULT_BRAND_COLORS: OrganizationBrandColors = {
  primary: '#2563eb',
  secondary: '#9333ea',
};

async function getCurrentOrgId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .single();

  return data?.organization_id || null;
}

export const organizationService = {
  async getOrganization(): Promise<Organization | null> {
    const supabase = createClient();
    const orgId = await getCurrentOrgId();

    if (!orgId) return null;

    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();

    if (error) {
      console.error('Failed to fetch organization:', error);
      return null;
    }

    return {
      ...data,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postal_code,
        country: data.country,
      },
      brandColors: {
        primary: data.primary_color,
        secondary: data.secondary_color,
      },
    };
  },

  async updateOrganization(updates: Partial<Organization>): Promise<Organization> {
    const supabase = createClient();
    const orgId = await getCurrentOrgId();

    if (!orgId) throw new Error('No organization found');

    const { data, error } = await supabase
      .from('organizations')
      .update({
        name: updates.name,
        type: updates.type,
        website: updates.website,
        industry: updates.industry,
        ein: updates.ein,
        logo: updates.logo,
        mission: updates.mission,
        founded_year: updates.foundedYear,
        staff_count: updates.staffCount,
        annual_budget: updates.annualBudget,
        focus_areas: updates.focusAreas,
        street: updates.address?.street,
        city: updates.address?.city,
        state: updates.address?.state,
        postal_code: updates.address?.postalCode,
        country: updates.address?.country,
        primary_color: updates.brandColors?.primary,
        secondary_color: updates.brandColors?.secondary,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orgId)
      .select()
      .single();

    if (error) throw error;

    return this.getOrganization() as Promise<Organization>;
  },

  validateOrganization(data: Partial<Organization>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Organization name is required';
    }

    if (!data.type || data.type.trim().length === 0) {
      errors.type = 'Select an organization type';
    }

    if (!data.industry || data.industry.trim().length === 0) {
      errors.industry = 'Industry is required';
    }

    if (data.website && !/^https?:\/\/.+/i.test(data.website)) {
      errors.website = 'Please enter a valid URL (https://example.org)';
    }

    if (!data.address?.country) {
      errors.country = 'Select a country';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

export type OrganizationValidationResult = ReturnType<typeof organizationService.validateOrganization>;
```

**Deliverables:**
- [ ] organizationService converted
- [ ] getCurrentOrgId helper function working
- [ ] All methods tested
- [ ] localStorage removed

#### 2.3 Convert teamService.ts

**File:** `/apps/shell/src/services/teamService.ts`

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';
import type { TeamMember, PendingInvite, TeamRole } from '@/types/team';
import { nanoid } from 'nanoid';

async function getCurrentOrgId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .single();

  return data?.organization_id || null;
}

export const teamService = {
  async getTeamMembers(): Promise<TeamMember[]> {
    const supabase = createClient();
    const orgId = await getCurrentOrgId();

    if (!orgId) return [];

    const { data, error } = await supabase
      .from('organization_members')
      .select('*, users(*)')
      .eq('organization_id', orgId)
      .eq('status', 'active')
      .order('joined_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch team members:', error);
      return [];
    }

    return data.map(member => ({
      id: member.id,
      userId: member.user_id,
      name: member.users.name,
      email: member.users.email,
      avatar: member.users.avatar_url,
      role: member.role as TeamRole,
      status: member.status,
      joinedAt: member.joined_at,
      lastActive: member.last_active_at,
    }));
  },

  async inviteTeamMember(email: string, role: TeamRole): Promise<PendingInvite> {
    const supabase = createClient();
    const orgId = await getCurrentOrgId();
    const { data: { user } } = await supabase.auth.getUser();

    if (!orgId || !user) throw new Error('Not authenticated');

    // Generate unique token
    const token = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const { data, error } = await supabase
      .from('organization_invites')
      .insert({
        organization_id: orgId,
        email,
        role,
        invited_by: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // TODO: Send email via Vercel Edge Function
    await fetch('/api/invites/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        token,
        organizationId: orgId,
      }),
    });

    return {
      id: data.id,
      email: data.email,
      role: data.role as TeamRole,
      invitedAt: data.created_at,
      expiresAt: data.expires_at,
      status: data.status,
    };
  },

  async removeMember(userId: string): Promise<void> {
    const supabase = createClient();
    const orgId = await getCurrentOrgId();

    if (!orgId) throw new Error('No organization found');

    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('organization_id', orgId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async updateMemberRole(userId: string, role: TeamRole): Promise<void> {
    const supabase = createClient();
    const orgId = await getCurrentOrgId();

    if (!orgId) throw new Error('No organization found');

    const { error } = await supabase
      .from('organization_members')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('organization_id', orgId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async getPendingInvites(): Promise<PendingInvite[]> {
    const supabase = createClient();
    const orgId = await getCurrentOrgId();

    if (!orgId) return [];

    const { data, error } = await supabase
      .from('organization_invites')
      .select('*')
      .eq('organization_id', orgId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch invites:', error);
      return [];
    }

    return data.map(invite => ({
      id: invite.id,
      email: invite.email,
      role: invite.role as TeamRole,
      invitedAt: invite.created_at,
      expiresAt: invite.expires_at,
      status: invite.status,
    }));
  },

  async revokeInvite(inviteId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('organization_invites')
      .update({ status: 'revoked', updated_at: new Date().toISOString() })
      .eq('id', inviteId);

    if (error) throw error;
  },
};
```

**Deliverables:**
- [ ] teamService converted
- [ ] All methods tested
- [ ] Invite flow working (database only, email in next step)

#### 2.4 Email Invite System

**File:** `/apps/shell/src/app/api/invites/send/route.ts`

```typescript
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, token, organizationId } = await request.json();

    const supabase = await createClient();

    // Get organization details
    const { data: org } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single();

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Send email
    const { error } = await resend.emails.send({
      from: 'VISION Platform <noreply@vision.com>',
      to: email,
      subject: `You've been invited to join ${org.name} on VISION Platform`,
      html: `
        <h1>Welcome to VISION Platform</h1>
        <p>You've been invited to join <strong>${org.name}</strong>.</p>
        <p>Click the link below to accept your invitation:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/invites/${token}">Accept Invitation</a>
        <p>This invitation will expire in 7 days.</p>
      `,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Invite send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**File:** `/apps/shell/src/app/invites/[token]/page.tsx`

```typescript
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GlowButton, GlowCard } from '@/components/glow-ui';

export default function AcceptInvitePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [invite, setInvite] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadInvite() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('organization_invites')
        .select('*, organizations(name)')
        .eq('token', params.token as string)
        .eq('status', 'pending')
        .single();

      if (error || !data) {
        setError('Invalid or expired invitation');
        setLoading(false);
        return;
      }

      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        setError('This invitation has expired');
        setLoading(false);
        return;
      }

      setInvite(data);
      setLoading(false);
    }

    loadInvite();
  }, [params.token]);

  async function acceptInvite() {
    setLoading(true);
    const supabase = createClient();

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Redirect to signup with invite token
      router.push(`/auth/signup?invite=${params.token}`);
      return;
    }

    // Add user to organization
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: invite.organization_id,
        user_id: user.id,
        role: invite.role,
        status: 'active',
        joined_at: new Date().toISOString(),
      });

    if (memberError) {
      setError('Failed to accept invitation');
      setLoading(false);
      return;
    }

    // Mark invite as accepted
    await supabase
      .from('organization_invites')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', invite.id);

    // Redirect to dashboard
    router.push('/dashboard');
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <GlowCard>
        <h1>Invitation Error</h1>
        <p>{error}</p>
        <GlowButton onClick={() => router.push('/')}>Go Home</GlowButton>
      </GlowCard>
    );
  }

  return (
    <GlowCard>
      <h1>You've been invited!</h1>
      <p>Join <strong>{invite.organizations.name}</strong> on VISION Platform</p>
      <p>Role: {invite.role}</p>
      <GlowButton onClick={acceptInvite}>Accept Invitation</GlowButton>
    </GlowCard>
  );
}
```

**Deliverables:**
- [ ] Resend API configured
- [ ] Email sending endpoint working
- [ ] Invite acceptance page created
- [ ] Flow tested end-to-end

**Phase 2 Completion Criteria:**
- [ ] Organizations migration applied
- [ ] organizationService converted
- [ ] teamService converted
- [ ] Email invites working
- [ ] RLS policies enforced
- [ ] All tests passing

---

## PHASE 3: Notifications System (Week 3-4) - 32 hours

### Objectives
- Implement real-time notifications with Supabase Realtime
- Create notification management UI backend
- Add notification preferences

### Tasks

#### 3.1 Notifications Migration

**File:** `/supabase/migrations/20240101000004_create_notifications_tables.sql`

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'task', 'mention', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  action_label TEXT,
  metadata JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  archived BOOLEAN DEFAULT false,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_org ON public.notifications(organization_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, read) WHERE read = false;
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);
```

#### 3.2 Convert notificationService.ts

**File:** `/apps/shell/src/services/notificationService.ts`

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';
import type { Notification } from '@/types';

export const notificationService = {
  async getNotifications(unreadOnly = false): Promise<Notification[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('archived', false)
      .order('created_at', { ascending: false })
      .limit(50);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }

    return data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async markAllAsRead(): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('read', false);

    if (error) throw error;
  },

  async deleteNotification(notificationId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },

  subscribeToNotifications(callback: (notification: Notification) => void) {
    const supabase = createClient();

    // Get current user ID
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            callback(payload.new as Notification);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    });
  },
};
```

**Deliverables:**
- [ ] Notifications migration applied
- [ ] notificationService converted
- [ ] Real-time subscriptions working
- [ ] Mark as read/unread working

**Phase 3 Completion Criteria:**
- [ ] Notifications table created
- [ ] notificationService converted
- [ ] Real-time working
- [ ] All tests passing

---

## PHASE 4: Applications & Files (Week 4-6) - 56 hours

### Objectives
- Seed apps catalog database
- Implement file storage with Supabase Storage
- Convert favorites and onboarding services

### Tasks

*(Continue with detailed implementation for Phases 4-7...)*

---

## 🔍 Critical Implementation Guidelines

### 1. **RLS Policy Testing**

For EVERY table with RLS enabled, you MUST test:

```typescript
// Test: User can only access their own data
const { data } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', 'different-user-id');

// Should return empty array or error
expect(data).toBeNull() || expect(data).toHaveLength(0);
```

### 2. **Migration Rollback Strategy**

Every migration MUST have a rollback:

```sql
-- Up migration
CREATE TABLE public.example (...);

-- Down migration (add at bottom of same file)
-- To rollback: DROP TABLE public.example CASCADE;
```

### 3. **Error Handling Pattern**

```typescript
try {
  const { data, error } = await supabase.from('table').select();

  if (error) {
    console.error('Database error:', error);
    throw new Error('User-friendly error message');
  }

  return data;
} catch (error) {
  // Log to monitoring service
  console.error('Service error:', error);
  throw error;
}
```

### 4. **Type Safety**

Generate types after every migration:

```bash
npx supabase gen types typescript --local > apps/shell/src/types/supabase.ts
```

### 5. **Performance Optimization**

- Add indexes for all foreign keys
- Add indexes for frequently queried columns
- Use `.select()` to limit returned columns
- Use `.limit()` to cap result sets

### 6. **Security Checklist**

Before deploying each phase:

- [ ] All tables have RLS enabled
- [ ] All policies tested manually
- [ ] No service_role key in client code
- [ ] Environment variables secured
- [ ] API routes validate authentication
- [ ] SQL injection prevented (use parameterized queries)

---

## 📊 Progress Tracking

### Daily Checklist

- [ ] Run `npx supabase db diff` to verify migrations
- [ ] Run `pnpm build` to ensure no TypeScript errors
- [ ] Run `pnpm test` to verify all tests pass
- [ ] Update this document with completed tasks
- [ ] Commit changes with descriptive messages

### Weekly Review

- [ ] Review RLS policies for security
- [ ] Check database performance (slow query log)
- [ ] Update API documentation
- [ ] Test on staging environment
- [ ] Demo progress to stakeholders

---

## 🚨 Common Pitfalls to Avoid

1. **Don't skip RLS policies** - Every table needs them
2. **Don't use service_role in client** - Use anon key only
3. **Don't forget indexes** - Performance will degrade
4. **Don't hardcode organization IDs** - Always query dynamically
5. **Don't expose sensitive data** - Always filter in RLS
6. **Don't trust client input** - Validate everything
7. **Don't forget to test rollbacks** - You will need them
8. **Don't skip type generation** - Keep types in sync

---

## 🎯 Success Criteria

Phase is complete when:

- [ ] All migrations applied successfully
- [ ] All services converted from localStorage
- [ ] All API endpoints working
- [ ] All tests passing (unit + integration)
- [ ] RLS policies tested and verified
- [ ] Production build passes
- [ ] No console errors in dev mode
- [ ] Performance targets met (<500ms API responses)
- [ ] Security audit passed
- [ ] Documentation updated

---

## 📞 Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **Project Spec:** [SUPABASE_BACKEND_INTEGRATION_PLAN.md](./SUPABASE_BACKEND_INTEGRATION_PLAN.md)
- **Frontend Verification:** [COMPLETE_WORK_VERIFICATION_PROMPT.md](./COMPLETE_WORK_VERIFICATION_PROMPT.md)

---

## 🚀 Getting Started

1. Read [SUPABASE_BACKEND_INTEGRATION_PLAN.md](./SUPABASE_BACKEND_INTEGRATION_PLAN.md) in full
2. Set up Supabase project (local + staging + production)
3. Configure environment variables
4. Start with Phase 1, Task 1.1
5. Complete tasks sequentially
6. Test after each task
7. Commit frequently with clear messages
8. Move to next phase only after completion criteria met

---

**Document Version:** 1.0
**Last Updated:** 2025-01-23
**Status:** Ready for Implementation
**Estimated Timeline:** 7-8 weeks (2 developers)
