# CommunityCompass - Complete PRD v1.1
## Product Requirements Document with Technical Specifications

**VOICE of the Community Module | VISION Platform**

---

| Field | Value |
|-------|-------|
| **Version** | 1.1 (Complete Technical Edition) |
| **Status** | Ready for Development |
| **Owner** | TwentyNine Eleven Impact Partners, LLC |
| **Last Updated** | November 24, 2025 |
| **Platform** | VISION Platform - VOICE of the Community Module |
| **Pricing** | $49/month (direct) \| Included in funder license |
| **Timeline** | Phase 3, Sprint 2 (Weeks 11-12) |

---

## Document Structure

**Sections 1-14**: [See Original PRD Document]
- Executive Summary through End-to-End Workflow Map

**Sections 15-23**: [New Technical Specifications - This Document]

15. [Technical Architecture Specification](#15-technical-architecture-specification)
16. [API Contract Specifications](#16-api-contract-specifications)
17. [Event-Driven Integration Architecture](#17-event-driven-integration-architecture)
18. [Frontend Component Library Specification](#18-frontend-component-library-specification)
19. [Test Strategy & Test Cases](#19-test-strategy--test-cases)
20. [Analytics & Instrumentation Plan](#20-analytics--instrumentation-plan)
21. [Error Handling & Edge Cases](#21-error-handling--edge-cases)
22. [Deployment & DevOps Plan](#22-deployment--devops-plan)
23. [Performance Optimization Strategy](#23-performance-optimization-strategy)

---

## 15. Technical Architecture Specification

### 15.1 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VISION Platform Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   AppShell   │  │  Auth System │  │  Data Warehouse│            │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CommunityCompass Application                    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    Frontend Layer (Next.js 15)              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │   │
│  │  │ Screen 1 │  │ Screen 2 │  │ Screen 3 │  │ Screen 4 │   │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                │                                    │
│                                ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              Application Service Layer                      │   │
│  │  • Assessment Manager Service                              │   │
│  │  • AI Generation Service                                   │   │
│  │  • Profile Compiler Service                                │   │
│  │  • Export Service                                          │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                              │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Supabase    │  │  Claude API  │  │   Vercel     │             │
│  │  PostgreSQL  │  │  (Sonnet 4)  │  │   Hosting    │             │
│  │  + RLS       │  │              │  │              │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  S3 Storage  │  │  CloudWatch  │  │  EventBridge │             │
│  │  (Documents) │  │  (Monitoring)│  │  (Events)    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

### 15.2 Technology Stack (Research-Backed)

**Research Source**: Best practices from Vercel, Supabase, and enterprise SaaS architectures (2025)

#### Frontend Stack
```json
{
  "framework": "Next.js 15 (App Router)",
  "language": "TypeScript 5.3+",
  "styling": "Tailwind CSS 4 + Glow UI",
  "stateManagement": "TanStack Query + Zustand",
  "formHandling": "React Hook Form + Zod",
  "aiIntegration": "Direct Claude API calls"
}
```

**Rationale**: 
- Next.js 15 App Router provides server components for optimal performance
- TypeScript ensures type safety across complex data models
- TanStack Query handles server state with caching and optimistic updates
- Zod provides runtime validation matching database constraints

#### Backend Stack
```json
{
  "database": "Supabase PostgreSQL 15",
  "auth": "Supabase Auth (JWT)",
  "storage": "Supabase Storage (S3-compatible)",
  "realtime": "Supabase Realtime (WebSockets)",
  "serverless": "Next.js API Routes + Vercel Functions",
  "security": "Row-Level Security (RLS) policies"
}
```

**Rationale**:
- Supabase provides PostgreSQL with built-in RLS for multi-tenancy
- JWT auth integrates seamlessly with Next.js middleware
- Serverless functions eliminate infrastructure management
- RLS policies enforce tenant isolation at database level

#### AI Stack
```json
{
  "primaryModel": "Claude Sonnet 4 (claude-sonnet-4-20250514)",
  "apiProvider": "Anthropic API (direct)",
  "embeddings": "OpenAI text-embedding-3-small",
  "vectorStorage": "pgvector extension in PostgreSQL",
  "rateLimit": "Token bucket algorithm (user-level)"
}
```

**Rationale**:
- Claude Sonnet 4 provides best quality for community-focused content
- Direct API calls simpler than complex orchestration (LangChain)
- pgvector enables semantic search for past assessments
- User-level rate limiting prevents abuse

### 15.3 Data Flow Architecture

**Create Assessment Flow**:
```
User Input (Target Population)
    ↓
Frontend Validation (Zod Schema)
    ↓
API Route: POST /api/assessments
    ↓
Insert to community_assessments table (Supabase)
    ↓
Trigger AI Generation (Claude API)
    ↓
Store Chips in statement_chips table
    ↓
Return to Frontend (TanStack Query cache)
    ↓
Render UI with Selection State
```

**AI Generation Flow**:
```
User Clicks "Generate Chips"
    ↓
Frontend: POST /api/ai/generate-chips
    ↓
API Route: Extract context from database
    ↓
Build prompt with population + question
    ↓
Call Claude API with streaming
    ↓
Stream chunks back to frontend
    ↓
Parse and validate responses
    ↓
Bulk insert to statement_chips
    ↓
Emit event: chips_generated
    ↓
Update UI with new chips
```

### 15.4 Security Architecture

**Multi-Tenant Isolation**:
```sql
-- Every query automatically filtered by organization_id
-- Set via Supabase auth context
SET app.current_org = '[org_id_from_jwt]';

-- RLS policy enforcement
CREATE POLICY tenant_isolation ON community_assessments
    FOR ALL
    USING (organization_id = current_setting('app.current_org')::uuid);
```

**Authentication Flow**:
```
1. User logs in → Supabase Auth
2. JWT token includes: user_id, org_id, role
3. Next.js middleware validates token
4. Supabase client automatically applies RLS
5. All queries filtered by organization_id
```

**Data Access Patterns**:

| User Role | Own Assessments | Org Assessments | Other Org |
|-----------|----------------|-----------------|-----------|
| Org Admin | Full CRUD | Full CRUD | No Access |
| Staff | Full CRUD | Read Only | No Access |
| Volunteer | No Access | No Access | No Access |
| Board | No Access | Read Only | No Access |
| Funder | No Access | Read Published | Via Grant Relationship |

### 15.5 Caching Strategy

**Browser Cache**:
```typescript
// TanStack Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
```

**Server Cache**:
- Next.js route cache: 60 seconds for GET endpoints
- Supabase connection pooling: pgBouncer
- CDN cache: Static assets (images, CSS, JS)

**Invalidation Strategy**:
```typescript
// After mutation, invalidate related queries
await updateAssessment.mutateAsync(data);
queryClient.invalidateQueries(['assessment', assessmentId]);
queryClient.invalidateQueries(['assessments']); // List view
```

### 15.6 Error Handling Architecture

**Error Hierarchy**:
```
ApplicationError (Base)
├── ValidationError (400)
│   ├── SchemaValidationError
│   └── BusinessRuleError
├── AuthenticationError (401)
├── AuthorizationError (403)
├── NotFoundError (404)
├── ConflictError (409)
├── RateLimitError (429)
├── AIServiceError (502)
│   ├── AITimeoutError
│   └── AIHallucinationError
└── DatabaseError (500)
    ├── ConnectionError
    └── ConstraintError
```

**Error Response Format**:
```typescript
{
  error: {
    code: "VALIDATION_ERROR",
    message: "Target population is required",
    details: {
      field: "description",
      constraint: "minLength",
      expected: 10,
      received: 5
    },
    timestamp: "2025-11-24T10:30:00Z",
    requestId: "req_abc123"
  }
}
```

---

## 16. API Contract Specifications

### 16.1 REST API Standards

**Base URL**: `https://platform.visionimpacthub.com/api/community-compass`

**Authentication**: Bearer token in Authorization header
```
Authorization: Bearer <jwt_token>
```

**Headers**:
```
Content-Type: application/json
X-Org-ID: <organization_uuid>
X-Request-ID: <unique_request_id>
```

### 16.2 Assessment Endpoints

#### Create Assessment
```http
POST /api/assessments
Content-Type: application/json

Request Body:
{
  "title": "Youth Services Community Assessment",
  "targetPopulation": {
    "description": "Youth ages 14-18 in foster care in DC",
    "geographicArea": "Washington, DC",
    "populationSize": "500-1000"
  }
}

Response (201 Created):
{
  "assessment": {
    "id": "uuid",
    "organizationId": "uuid",
    "title": "Youth Services Community Assessment",
    "status": "draft",
    "currentScreen": 1,
    "createdAt": "2025-11-24T10:00:00Z",
    "updatedAt": "2025-11-24T10:00:00Z"
  }
}

Errors:
- 400: Validation error (missing required fields)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (user lacks permission)
- 429: Rate limit exceeded
```

#### Get Assessment
```http
GET /api/assessments/{assessmentId}

Response (200 OK):
{
  "assessment": {
    "id": "uuid",
    "organizationId": "uuid",
    "title": "Youth Services Community Assessment",
    "status": "in_progress",
    "currentScreen": 2,
    "targetPopulation": {
      "description": "Youth ages 14-18 in foster care in DC",
      "geographicArea": "Washington, DC"
    },
    "focusStatement": {
      "content": "Youth in foster care...",
      "version": 1,
      "generatedBy": "ai_edited",
      "wordCount": 247
    },
    "chips": {
      "experiences": [...],
      "barriers": [...],
      "urgency": [...],
      "aspirations": [...],
      "strengths": [...]
    },
    "createdAt": "2025-11-24T10:00:00Z",
    "updatedAt": "2025-11-24T10:15:00Z"
  }
}

Errors:
- 401: Unauthorized
- 403: Forbidden (not your organization's assessment)
- 404: Assessment not found
```

#### Update Assessment
```http
PATCH /api/assessments/{assessmentId}
Content-Type: application/json

Request Body:
{
  "title": "Updated Title",
  "currentScreen": 3,
  "metadata": {
    "lastEditedSection": "empathy-map"
  }
}

Response (200 OK):
{
  "assessment": { /* updated assessment */ }
}

Errors:
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden (not your assessment)
- 404: Assessment not found
- 409: Conflict (concurrent edit detected)
```

#### List Assessments
```http
GET /api/assessments?status=draft&limit=20&offset=0

Response (200 OK):
{
  "assessments": [
    {
      "id": "uuid",
      "title": "Youth Services Assessment",
      "status": "draft",
      "currentScreen": 2,
      "createdAt": "2025-11-24T10:00:00Z",
      "updatedAt": "2025-11-24T10:15:00Z"
    },
    ...
  ],
  "pagination": {
    "total": 47,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}

Query Parameters:
- status: draft|in_progress|completed
- limit: 1-100 (default: 20)
- offset: 0+ (default: 0)
- sortBy: createdAt|updatedAt|title
- sortOrder: asc|desc (default: desc)
```

### 16.3 AI Generation Endpoints

#### Generate Chips
```http
POST /api/ai/generate-chips
Content-Type: application/json

Request Body:
{
  "assessmentId": "uuid",
  "questionCategory": "experiences",
  "targetPopulation": "Youth ages 14-18 in foster care in DC",
  "existingContext": {
    "selectedChips": [...],
    "customStatements": [...]
  }
}

Response (200 OK) - Streaming:
{
  "chips": [
    {
      "id": "uuid",
      "text": "Navigate complex system relationships...",
      "confidence": 0.87,
      "sourceCitation": "Casey Family Programs, 2024"
    },
    ...
  ],
  "metadata": {
    "model": "claude-sonnet-4-20250514",
    "tokensUsed": 1247,
    "generationTime": 4.2
  }
}

Errors:
- 400: Invalid category or missing context
- 401: Unauthorized
- 403: Forbidden
- 429: Rate limit exceeded
- 502: AI service error
- 504: AI service timeout
```

#### Generate Focus Statement
```http
POST /api/ai/generate-focus-statement
Content-Type: application/json

Request Body:
{
  "assessmentId": "uuid",
  "selectedChips": {
    "experiences": ["chip1", "chip2"],
    "barriers": ["chip3", "chip4"],
    "urgency": ["chip5"],
    "aspirations": ["chip6", "chip7"],
    "strengths": ["chip8", "chip9"]
  },
  "targetPopulation": "Youth ages 14-18 in foster care in DC"
}

Response (200 OK):
{
  "focusStatement": {
    "content": "Youth in foster care between the ages of 14-18...",
    "wordCount": 247,
    "version": 1,
    "generatedBy": "ai"
  },
  "metadata": {
    "model": "claude-sonnet-4-20250514",
    "tokensUsed": 2341,
    "generationTime": 8.7
  }
}

Errors:
- 400: Insufficient chips selected (minimum 5 total)
- 401: Unauthorized
- 403: Forbidden
- 429: Rate limit exceeded
- 502: AI service error
```

#### Generate Personas
```http
POST /api/ai/generate-personas
Content-Type: application/json

Request Body:
{
  "assessmentId": "uuid",
  "count": 3,
  "diversityRequirements": {
    "ageRange": true,
    "circumstances": true,
    "goals": true
  }
}

Response (200 OK):
{
  "personas": [
    {
      "id": "uuid",
      "namePlaceholder": "Profile A",
      "ageRange": "14-16 years old",
      "lifeSituation": "...",
      "goals": [...],
      "barriers": [...],
      "strengths": [...],
      "supportSystems": "...",
      "motivations": "...",
      "narrative": "...",
      "programImplications": "..."
    },
    ...
  ],
  "metadata": {
    "model": "claude-sonnet-4-20250514",
    "tokensUsed": 5432,
    "generationTime": 15.3
  }
}

Errors:
- 400: Invalid count (must be 3-6)
- 401: Unauthorized
- 403: Forbidden
- 429: Rate limit exceeded
- 502: AI service error
```

### 16.4 Chip Management Endpoints

#### Select Chips
```http
POST /api/assessments/{assessmentId}/chips/select
Content-Type: application/json

Request Body:
{
  "chipIds": ["uuid1", "uuid2", "uuid3"],
  "questionCategory": "experiences"
}

Response (200 OK):
{
  "success": true,
  "updatedChips": [
    {
      "id": "uuid1",
      "text": "...",
      "isSelected": true
    },
    ...
  ]
}
```

#### Add Custom Chip
```http
POST /api/assessments/{assessmentId}/chips
Content-Type: application/json

Request Body:
{
  "questionCategory": "experiences",
  "text": "Experience multi-generational trauma effects",
  "isAiGenerated": false
}

Response (201 Created):
{
  "chip": {
    "id": "uuid",
    "assessmentId": "uuid",
    "questionCategory": "experiences",
    "text": "Experience multi-generational trauma effects",
    "isAiGenerated": false,
    "isSelected": true,
    "createdAt": "2025-11-24T10:30:00Z"
  }
}

Errors:
- 400: Text too long (>200 chars) or empty
- 401: Unauthorized
- 403: Forbidden
- 429: Rate limit exceeded
```

### 16.5 Profile & Export Endpoints

#### Generate Community Profile
```http
POST /api/assessments/{assessmentId}/profile
Content-Type: application/json

Request Body:
{
  "includeExecutiveSummary": true,
  "includeDemographics": true,
  "includeDataSources": true,
  "format": "structured" // or "narrative"
}

Response (200 OK):
{
  "profile": {
    "id": "uuid",
    "assessmentId": "uuid",
    "title": "Youth Services Community Profile",
    "executiveSummary": "...",
    "sections": {
      "targetPopulation": {...},
      "focusStatement": {...},
      "empathyMap": {...},
      "needsAssessment": {...},
      "personas": [...]
    },
    "metadata": {
      "generatedAt": "2025-11-24T10:45:00Z",
      "version": 1
    }
  }
}

Errors:
- 400: Assessment not complete enough
- 401: Unauthorized
- 403: Forbidden
- 404: Assessment not found
```

#### Export Profile
```http
GET /api/assessments/{assessmentId}/export?format=pdf

Query Parameters:
- format: pdf|docx|markdown|json
- includeVisuals: true|false
- template: standard|grant|board

Response (200 OK):
{
  "downloadUrl": "https://storage.visionimpacthub.com/exports/uuid.pdf",
  "expiresAt": "2025-11-24T12:00:00Z",
  "metadata": {
    "format": "pdf",
    "fileSize": 1024576,
    "pageCount": 12
  }
}

Errors:
- 400: Invalid format or template
- 401: Unauthorized
- 403: Forbidden
- 404: Assessment not found
- 500: Export generation failed
```

### 16.6 Deep Research Endpoints (Premium)

#### Request Deep Research
```http
POST /api/assessments/{assessmentId}/deep-research
Content-Type: application/json

Request Body:
{
  "researchType": "trends", // or policy, demographics, etc.
  "query": "Foster care trends in DC 2020-2025",
  "geographicArea": "Washington, DC",
  "timeframe": {
    "start": "2020-01-01",
    "end": "2025-11-24"
  }
}

Response (202 Accepted):
{
  "researchId": "uuid",
  "status": "processing",
  "estimatedCompletionTime": 30 // seconds
}

Errors:
- 400: Invalid research type or query
- 401: Unauthorized
- 403: Premium feature not enabled
- 429: Rate limit exceeded
```

#### Get Research Results
```http
GET /api/assessments/{assessmentId}/deep-research/{researchId}

Response (200 OK):
{
  "research": {
    "id": "uuid",
    "researchType": "trends",
    "query": "Foster care trends in DC 2020-2025",
    "status": "completed",
    "results": {
      "executiveSummary": "...",
      "sections": [
        {
          "title": "Population Trends",
          "content": "...",
          "citations": [...]
        },
        ...
      ],
      "citations": [
        {
          "source": "DC Child and Family Services Agency",
          "title": "Annual Foster Care Report 2024",
          "url": "https://...",
          "publishedDate": "2024-06-01",
          "confidence": 0.95
        },
        ...
      ]
    },
    "metadata": {
      "generatedAt": "2025-11-24T11:00:00Z",
      "tokensUsed": 8432,
      "generationTime": 28.4
    }
  }
}

Response (202 Accepted) if still processing:
{
  "researchId": "uuid",
  "status": "processing",
  "progress": 65
}

Errors:
- 401: Unauthorized
- 403: Premium feature not enabled
- 404: Research not found
```

---

## 17. Event-Driven Integration Architecture

### 17.1 Event System Overview

CommunityCompass emits events to the VISION Platform event bus (AWS EventBridge) for cross-app integration and analytics.

**Event Flow**:
```
CommunityCompass Action
    ↓
Emit Event to EventBridge
    ↓
EventBridge Router
    ├→ Data Warehouse (store)
    ├→ Analytics Suite (metrics)
    ├→ CRM (stakeholder linking)
    ├→ FundingFramer (narrative sync)
    └→ Notification Service (user alerts)
```

### 17.2 Event Schema Standard

All events follow this structure:
```typescript
interface PlatformEvent {
  eventId: string; // UUID
  eventType: string; // e.g., "communitycompass.assessment.created"
  eventVersion: string; // e.g., "1.0"
  timestamp: string; // ISO 8601
  source: {
    app: "communitycompass";
    organizationId: string;
    userId: string;
  };
  data: any; // Event-specific payload
  metadata: {
    correlationId?: string; // Link related events
    causationId?: string; // Parent event that caused this
    traceId?: string; // Full request trace
  };
}
```

### 17.3 CommunityCompass Event Catalog

#### Assessment Lifecycle Events

**Assessment Created**
```typescript
{
  eventType: "communitycompass.assessment.created",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    title: string;
    targetPopulation: {
      description: string;
      geographicArea: string;
    };
    createdAt: string;
  }
}
```

**Target Population Defined**
```typescript
{
  eventType: "communitycompass.population.defined",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    population: {
      description: string;
      geographicArea: string;
      demographics: object;
    }
  }
}

// Triggers:
// - CRM: Create stakeholder category for this population
// - Analytics: Track population types being assessed
```

**Focus Statement Generated**
```typescript
{
  eventType: "communitycompass.focus_statement.generated",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    focusStatement: {
      content: string;
      wordCount: number;
      version: number;
    };
    generatedBy: "ai" | "user" | "ai_edited";
  }
}

// Triggers:
// - FundingFramer: Available for grant narrative auto-population
// - Data Warehouse: Store versioned statement
```

**Focus Statement Finalized**
```typescript
{
  eventType: "communitycompass.focus_statement.finalized",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    finalFocusStatement: string;
    finalizedAt: string;
  }
}
```

#### Chip Selection Events

**Chips Generated**
```typescript
{
  eventType: "communitycompass.chips.generated",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    questionCategory: string;
    chips: Array<{
      chipId: string;
      text: string;
      confidence: number;
      source?: string;
    }>;
    model: string;
    tokensUsed: number;
  }
}

// Triggers:
// - Analytics: Track AI generation quality metrics
// - Cost Tracking: Monitor token usage
```

**Chip Selected**
```typescript
{
  eventType: "communitycompass.chip.selected",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    chipId: string;
    questionCategory: string;
    chipText: string;
    isAiGenerated: boolean;
  }
}

// Triggers:
// - Analytics: Track which chips users select most
// - AI Training: Feedback loop for chip quality
```

**Custom Chip Added**
```typescript
{
  eventType: "communitycompass.chip.custom_added",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    chipId: string;
    questionCategory: string;
    chipText: string;
  }
}

// Triggers:
// - Analytics: Track what AI missed (improvement signals)
// - AI Training: Add to future training data
```

#### Needs Assessment Events

**Need Added**
```typescript
{
  eventType: "communitycompass.need.added",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    needId: string;
    need: {
      title: string;
      category: string;
      urgencyLevel: string;
      impactLevel: string;
      evidenceLevel: string;
    };
    isAiSuggested: boolean;
  }
}

// Triggers:
// - OrgDB: Create linkable need for program mapping
// - PathwayPro: Available for logic model development
// - FundingFramer: Auto-populate program justification
```

**Needs Assessment Completed**
```typescript
{
  eventType: "communitycompass.needs_assessment.completed",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    needsCount: number;
    needsByCategory: Record<string, number>;
    priorityDistribution: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    completedAt: string;
  }
}

// Triggers:
// - Analytics: Track assessment comprehensiveness
// - OrgDB: Bulk import needs for program design
```

#### Profile & Persona Events

**Community Profile Published**
```typescript
{
  eventType: "communitycompass.profile.published",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    profileId: string;
    title: string;
    publishedAt: string;
    version: number;
  }
}

// Triggers:
// - Data Warehouse: Store final profile
// - Notification Service: Alert team members
// - Funder Portal: Make visible to funders (if relationship exists)
```

**Personas Generated**
```typescript
{
  eventType: "communitycompass.personas.generated",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    personas: Array<{
      personaId: string;
      namePlaceholder: string;
      ageRange: string;
    }>;
    personaCount: number;
  }
}

// Triggers:
// - CRM: Create persona-based stakeholder segments
// - Communications: Available for targeted messaging
```

#### Export & Share Events

**Profile Exported**
```typescript
{
  eventType: "communitycompass.profile.exported",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    profileId: string;
    format: "pdf" | "docx" | "markdown" | "json";
    exportedBy: string;
    exportedAt: string;
  }
}

// Triggers:
// - Analytics: Track export usage patterns
// - Storage: Log document generation for audit
```

**Profile Shared**
```typescript
{
  eventType: "communitycompass.profile.shared",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    profileId: string;
    sharedWith: string[]; // Array of user IDs or emails
    shareType: "view" | "edit";
    sharedBy: string;
    sharedAt: string;
  }
}

// Triggers:
// - Permissions: Grant access to specified users
// - Notification Service: Email share notifications
```

#### Deep Research Events (Premium)

**Research Requested**
```typescript
{
  eventType: "communitycompass.research.requested",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    researchId: string;
    researchType: string;
    query: string;
    requestedBy: string;
  }
}

// Triggers:
// - Analytics: Track premium feature usage
// - Cost Tracking: Monitor API costs
```

**Research Completed**
```typescript
{
  eventType: "communitycompass.research.completed",
  eventVersion: "1.0",
  data: {
    assessmentId: string;
    researchId: string;
    researchType: string;
    citationCount: number;
    tokensUsed: number;
    completedAt: string;
  }
}

// Triggers:
// - Notification Service: Alert user research is ready
// - Data Warehouse: Store research results
```

### 17.4 Event Routing Rules

**EventBridge Rules**:
```yaml
# Rule: Route to Data Warehouse
- name: communitycompass-to-datawarehouse
  pattern:
    source: [communitycompass]
    detail-type: 
      - "communitycompass.assessment.*"
      - "communitycompass.profile.*"
      - "communitycompass.need.*"
  targets:
    - arn: arn:aws:lambda:us-east-1:123456:function:datawarehouse-ingest

# Rule: Route to CRM
- name: communitycompass-to-crm
  pattern:
    source: [communitycompass]
    detail-type:
      - "communitycompass.population.defined"
      - "communitycompass.personas.generated"
  targets:
    - arn: arn:aws:lambda:us-east-1:123456:function:crm-sync

# Rule: Route to FundingFramer
- name: communitycompass-to-fundingframer
  pattern:
    source: [communitycompass]
    detail-type:
      - "communitycompass.focus_statement.finalized"
      - "communitycompass.needs_assessment.completed"
  targets:
    - arn: arn:aws:lambda:us-east-1:123456:function:fundingframer-sync

# Rule: Route to Analytics
- name: communitycompass-analytics
  pattern:
    source: [communitycompass]
  targets:
    - arn: arn:aws:lambda:us-east-1:123456:function:analytics-ingest
```

### 17.5 Event Replay & Debugging

**Event Store**:
- All events stored in `platform_events` table
- Retention: 90 days in hot storage, 2 years in cold storage
- Queryable by: eventType, organizationId, assessmentId, timestamp

**Replay Capability**:
```http
POST /api/admin/events/replay
Content-Type: application/json

{
  "eventIds": ["uuid1", "uuid2"],
  "targetApps": ["datawarehouse", "crm"]
}
```

---

## 18. Frontend Component Library Specification

### 18.1 Component Hierarchy

```
CommunityCompass App
├── Layout Components
│   ├── AssessmentShell
│   ├── ProgressIndicator
│   └── ActionBar
├── Screen Components
│   ├── TargetPopulationScreen
│   ├── EmpathyMapScreen
│   ├── NeedsAssessmentScreen
│   ├── ProfileBuilderScreen
│   ├── PersonaScreen
│   └── DeepResearchScreen
├── Feature Components
│   ├── ChipGenerator
│   ├── ChipSelector
│   ├── FocusStatementEditor
│   ├── EmpathyQuadrant
│   ├── NeedCard
│   └── PersonaCard
├── Form Components
│   ├── PopulationInput
│   ├── RichTextEditor
│   ├── CategorySelector
│   └── PriorityMatrix
└── Shared Components (from Glow UI)
    ├── Button
    ├── Card
    ├── Input
    ├── Select
    ├── Toast
    └── Modal
```

### 18.2 Core Component Specifications

#### AssessmentShell Component

**Purpose**: Wrapper layout for all assessment screens

**Props**:
```typescript
interface AssessmentShellProps {
  assessmentId: string;
  currentScreen: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  onScreenChange?: (screen: number) => void;
  onSaveDraft?: () => Promise<void>;
}
```

**Usage**:
```tsx
<AssessmentShell
  assessmentId={assessmentId}
  currentScreen={2}
  onScreenChange={handleScreenChange}
  onSaveDraft={handleSaveDraft}
>
  <EmpathyMapScreen />
</AssessmentShell>
```

**Features**:
- Progress indicator showing 6 steps
- Auto-save every 60 seconds
- Navigation controls (Previous/Next)
- Draft save indicator
- Exit confirmation on unsaved changes

---

#### ChipGenerator Component

**Purpose**: Generate and display AI-generated chips for selection

**Props**:
```typescript
interface ChipGeneratorProps {
  assessmentId: string;
  questionCategory: 'experiences' | 'barriers' | 'urgency' | 'aspirations' | 'strengths';
  questionText: string;
  targetPopulation: string;
  existingChips?: Chip[];
  onChipsGenerated?: (chips: Chip[]) => void;
  maxChips?: number; // default: 5
}

interface Chip {
  id: string;
  text: string;
  isAiGenerated: boolean;
  isSelected: boolean;
  confidence?: number;
  sourceCitation?: string;
}
```

**Usage**:
```tsx
<ChipGenerator
  assessmentId={assessmentId}
  questionCategory="experiences"
  questionText="What are they experiencing in their daily lives?"
  targetPopulation={targetPopulation}
  onChipsGenerated={handleChipsGenerated}
/>
```

**States**:
- `idle`: Before generation
- `generating`: API call in progress (loading spinner)
- `success`: Chips displayed
- `error`: Error message with retry button

**UI Elements**:
- Loading indicator during generation
- 5 chips displayed as selectable buttons
- "+ Add your own" button
- Retry button on error
- Token usage display (for admins)

---

#### ChipSelector Component

**Purpose**: Display and manage chip selection

**Props**:
```typescript
interface ChipSelectorProps {
  chips: Chip[];
  onChipToggle: (chipId: string) => void;
  onChipAdd: (text: string) => void;
  onChipEdit: (chipId: string, newText: string) => void;
  onChipDelete: (chipId: string) => void;
  allowCustom?: boolean; // default: true
  maxCustomLength?: number; // default: 200
}
```

**Usage**:
```tsx
<ChipSelector
  chips={experienceChips}
  onChipToggle={handleToggle}
  onChipAdd={handleAdd}
  onChipEdit={handleEdit}
  onChipDelete={handleDelete}
/>
```

**Interactions**:
- Click chip to select/deselect
- Selected chips show checkmark and accent color
- Hover shows tooltip with confidence score (if AI-generated)
- Custom chips have dotted border
- Edit icon appears on hover (custom chips only)
- Delete icon appears on hover (custom chips only)

---

#### FocusStatementEditor Component

**Purpose**: Rich text editor for Community Focus Statement

**Props**:
```typescript
interface FocusStatementEditorProps {
  assessmentId: string;
  initialContent?: string;
  onSave: (content: string) => Promise<void>;
  onRegenerate?: () => Promise<string>;
  showWordCount?: boolean; // default: true
  minWords?: number; // default: 150
  maxWords?: number; // default: 300
}
```

**Usage**:
```tsx
<FocusStatementEditor
  assessmentId={assessmentId}
  initialContent={focusStatement}
  onSave={handleSave}
  onRegenerate={handleRegenerate}
  showWordCount={true}
/>
```

**Features**:
- Rich text editing (bold, italic, lists)
- Word count indicator
- Save button (disabled if no changes)
- Regenerate button
- Version history dropdown
- AI suggestions as inline comments (optional)
- Auto-save draft after 3 seconds of inactivity

---

#### EmpathyQuadrant Component

**Purpose**: Single quadrant of empathy map with chip generation

**Props**:
```typescript
interface EmpathyQuadrantProps {
  assessmentId: string;
  quadrant: 'pain' | 'feelings' | 'influences' | 'intentions';
  title: string;
  prompt: string;
  chips: Chip[];
  onChipToggle: (chipId: string) => void;
  onChipAdd: (text: string) => void;
  onGenerateChips: () => Promise<Chip[]>;
}
```

**Usage**:
```tsx
<EmpathyQuadrant
  assessmentId={assessmentId}
  quadrant="pain"
  title="Pain"
  prompt="What causes frustration, stress, or hardship?"
  chips={painChips}
  onChipToggle={handleToggle}
  onChipAdd={handleAdd}
  onGenerateChips={handleGenerate}
/>
```

**Layout**:
```
┌─────────────────────────────────┐
│ Pain                            │
│ What causes frustration, stress│
│ or hardship?                    │
│                                 │
│ [Generate Chips Button]         │
│                                 │
│ ┌───────────┐ ┌───────────┐   │
│ │  Chip 1   │ │  Chip 2   │   │
│ └───────────┘ └───────────┘   │
│                                 │
│ [+ Add Insight]                 │
└─────────────────────────────────┘
```

---

#### NeedCard Component

**Purpose**: Display and edit a single community need

**Props**:
```typescript
interface NeedCardProps {
  need: Need;
  onUpdate: (need: Partial<Need>) => void;
  onDelete: () => void;
  isAiSuggested: boolean;
}

interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
  impactLevel: 'transformational' | 'significant' | 'moderate' | 'minor';
  evidenceLevel: 'strong' | 'moderate' | 'emerging' | 'assumed';
  confidenceLevel: 'high' | 'medium' | 'low';
  themeGroup?: string;
}
```

**Usage**:
```tsx
<NeedCard
  need={need}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
  isAiSuggested={need.isAiSuggested}
/>
```

**Visual Design**:
- Card with category color accent
- Title (editable on click)
- Description (expandable)
- 4 attribute indicators (Urgency, Impact, Evidence, Confidence)
- Theme tag (if assigned)
- AI badge (if AI-suggested)
- Edit/Delete actions (hover)

---

#### PersonaCard Component

**Purpose**: Display a community member persona

**Props**:
```typescript
interface PersonaCardProps {
  persona: Persona;
  onEdit: (persona: Partial<Persona>) => void;
  onDelete: () => void;
  onRegenerate: () => Promise<Persona>;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

interface Persona {
  id: string;
  namePlaceholder: string;
  ageRange: string;
  lifeSituation: string;
  goals: string[];
  barriers: string[];
  strengths: string[];
  supportSystems: string;
  motivations: string;
  narrative: string;
  programImplications: string;
}
```

**Usage**:
```tsx
<PersonaCard
  persona={persona}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onRegenerate={handleRegenerate}
  isExpanded={expandedId === persona.id}
  onToggleExpand={() => toggleExpand(persona.id)}
/>
```

**States**:
- Collapsed: Shows name, age range, life situation summary
- Expanded: Shows all fields with edit capabilities

---

### 18.3 Shared Component Usage

#### Glow UI Components

CommunityCompass uses the Glow UI design system with custom configurations:

**Button Variants**:
```tsx
// Primary action (Generate, Save, Next)
<Button variant="primary" size="lg">Generate Chips</Button>

// Secondary action (Cancel, Previous)
<Button variant="secondary">Cancel</Button>

// Danger action (Delete)
<Button variant="danger" size="sm">Delete</Button>

// Ghost action (Edit, More)
<Button variant="ghost">Edit</Button>
```

**Input Components**:
```tsx
// Text input with validation
<Input
  label="Target Population"
  placeholder="Describe the community you serve..."
  value={population}
  onChange={setPopulation}
  error={errors.population}
  required
/>

// Select dropdown
<Select
  label="Category"
  options={categories}
  value={selectedCategory}
  onChange={setSelectedCategory}
/>

// Rich text editor
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Enter text..."
/>
```

**Feedback Components**:
```tsx
// Toast notification
toast.success('Focus statement saved successfully');
toast.error('Failed to generate chips. Please try again.');
toast.info('Draft saved automatically');

// Modal dialog
<Modal
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  title="Delete Assessment?"
  actions={[
    <Button variant="danger" onClick={handleDelete}>Delete</Button>,
    <Button variant="secondary" onClick={closeModal}>Cancel</Button>
  ]}
>
  This action cannot be undone.
</Modal>
```

### 18.4 Responsive Design Patterns

All components must be responsive following these breakpoints:

```typescript
// Tailwind breakpoints
const breakpoints = {
  sm: '640px',  // Mobile landscape
  md: '768px',  // Tablet
  lg: '1024px', // Desktop
  xl: '1280px', // Large desktop
  '2xl': '1536px' // Extra large
};
```

**Mobile (< 768px)**:
- Single column layout
- Stacked chips (full width)
- Collapsible sections
- Bottom action bar (sticky)

**Tablet (768px - 1024px)**:
- Two column layout for chips
- Side-by-side empathy quadrants (2x2 grid)
- Expanded action bar

**Desktop (> 1024px)**:
- Multi-column layouts
- 3-4 chips per row
- Side-by-side content areas
- Persistent sidebar navigation

---

## 19. Test Strategy & Test Cases

### 19.1 Testing Pyramid

```
                    ┌─────────────┐
                    │  E2E Tests  │  ← 10% of tests
                    │   (Playwright)│
                    └─────────────┘
                ┌─────────────────────┐
                │ Integration Tests   │  ← 30% of tests
                │  (API + Database)   │
                └─────────────────────┘
        ┌───────────────────────────────────┐
        │      Unit Tests (Vitest)          │  ← 60% of tests
        │  Components, Utils, Services      │
        └───────────────────────────────────┘
```

### 19.2 Unit Tests

**Target Coverage**: 80%+ for business logic

**Test Framework**: Vitest + React Testing Library

#### Component Tests

**ChipSelector Component**:
```typescript
// tests/components/ChipSelector.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ChipSelector } from '@/components/ChipSelector';

describe('ChipSelector', () => {
  const mockChips = [
    { id: '1', text: 'Experience A', isSelected: false, isAiGenerated: true },
    { id: '2', text: 'Experience B', isSelected: true, isAiGenerated: true },
    { id: '3', text: 'Custom Experience', isSelected: false, isAiGenerated: false },
  ];

  it('renders all chips', () => {
    render(<ChipSelector chips={mockChips} onChipToggle={() => {}} />);
    
    expect(screen.getByText('Experience A')).toBeInTheDocument();
    expect(screen.getByText('Experience B')).toBeInTheDocument();
    expect(screen.getByText('Custom Experience')).toBeInTheDocument();
  });

  it('highlights selected chips', () => {
    render(<ChipSelector chips={mockChips} onChipToggle={() => {}} />);
    
    const selectedChip = screen.getByText('Experience B').closest('button');
    expect(selectedChip).toHaveClass('bg-blue-600'); // Selected state
  });

  it('calls onChipToggle when chip is clicked', () => {
    const mockToggle = vi.fn();
    render(<ChipSelector chips={mockChips} onChipToggle={mockToggle} />);
    
    fireEvent.click(screen.getByText('Experience A'));
    
    expect(mockToggle).toHaveBeenCalledWith('1');
  });

  it('shows custom chip indicator for user-generated chips', () => {
    render(<ChipSelector chips={mockChips} onChipToggle={() => {}} />);
    
    const customChip = screen.getByText('Custom Experience').closest('button');
    expect(customChip).toHaveClass('border-dashed'); // Custom indicator
  });

  it('allows adding custom chip', async () => {
    const mockAdd = vi.fn();
    render(<ChipSelector chips={[]} onChipAdd={mockAdd} />);
    
    fireEvent.click(screen.getByText('+ Add your own'));
    
    const input = screen.getByPlaceholderText('Enter custom insight...');
    fireEvent.change(input, { target: { value: 'New custom chip' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(mockAdd).toHaveBeenCalledWith('New custom chip');
  });

  it('enforces max length on custom chips', () => {
    render(<ChipSelector chips={[]} onChipAdd={() => {}} maxCustomLength={50} />);
    
    fireEvent.click(screen.getByText('+ Add your own'));
    
    const input = screen.getByPlaceholderText('Enter custom insight...');
    const longText = 'a'.repeat(51);
    fireEvent.change(input, { target: { value: longText } });
    
    expect(screen.getByText(/50 character limit/i)).toBeInTheDocument();
  });
});
```

**FocusStatementEditor Component**:
```typescript
// tests/components/FocusStatementEditor.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FocusStatementEditor } from '@/components/FocusStatementEditor';

describe('FocusStatementEditor', () => {
  it('displays initial content', () => {
    const initialContent = 'Youth in foster care face unique challenges...';
    render(<FocusStatementEditor initialContent={initialContent} onSave={() => {}} />);
    
    expect(screen.getByText(initialContent)).toBeInTheDocument();
  });

  it('shows word count', () => {
    const content = 'word '.repeat(150); // 150 words
    render(<FocusStatementEditor initialContent={content} onSave={() => {}} />);
    
    expect(screen.getByText(/150 words/i)).toBeInTheDocument();
  });

  it('warns when below minimum word count', () => {
    const content = 'word '.repeat(50); // Only 50 words
    render(<FocusStatementEditor initialContent={content} onSave={() => {}} minWords={150} />);
    
    expect(screen.getByText(/at least 150 words/i)).toBeInTheDocument();
  });

  it('auto-saves after 3 seconds of inactivity', async () => {
    const mockSave = vi.fn();
    render(<FocusStatementEditor initialContent="" onSave={mockSave} />);
    
    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: 'New content' } });
    
    await waitFor(() => expect(mockSave).toHaveBeenCalled(), { timeout: 3500 });
  });

  it('regenerates focus statement on button click', async () => {
    const mockRegenerate = vi.fn().mockResolvedValue('New focus statement...');
    render(<FocusStatementEditor initialContent="Old content" onRegenerate={mockRegenerate} />);
    
    fireEvent.click(screen.getByText(/regenerate/i));
    
    await waitFor(() => {
      expect(mockRegenerate).toHaveBeenCalled();
      expect(screen.getByText('New focus statement...')).toBeInTheDocument();
    });
  });
});
```

#### Service/Util Tests

**Chip Generation Service**:
```typescript
// tests/services/chipGeneration.test.ts
import { generateChips } from '@/services/chipGeneration';
import { ClaudeAPIError } from '@/lib/errors';

// Mock Claude API
vi.mock('@/lib/claude', () => ({
  callClaude: vi.fn(),
}));

describe('generateChips', () => {
  it('generates exactly 5 chips for valid input', async () => {
    const result = await generateChips({
      assessmentId: 'test-id',
      questionCategory: 'experiences',
      targetPopulation: 'Youth in foster care',
    });
    
    expect(result.chips).toHaveLength(5);
    expect(result.chips.every(c => c.text.length > 0)).toBe(true);
  });

  it('throws error if population is too vague', async () => {
    await expect(
      generateChips({
        assessmentId: 'test-id',
        questionCategory: 'experiences',
        targetPopulation: 'people', // Too vague
      })
    ).rejects.toThrow('Target population is too vague');
  });

  it('retries on API timeout', async () => {
    const mockCall = vi.mocked(callClaude);
    mockCall.mockRejectedValueOnce(new Error('Timeout'));
    mockCall.mockResolvedValueOnce({ chips: [...] });
    
    const result = await generateChips({ /* ... */ });
    
    expect(mockCall).toHaveBeenCalledTimes(2);
    expect(result.chips).toBeDefined();
  });

  it('includes confidence scores', async () => {
    const result = await generateChips({ /* ... */ });
    
    expect(result.chips.every(c => c.confidence >= 0 && c.confidence <= 1)).toBe(true);
  });

  it('filters out inappropriate content', async () => {
    // Mock response with inappropriate chip
    const mockCall = vi.mocked(callClaude);
    mockCall.mockResolvedValue({
      chips: [
        { text: 'Normal chip' },
        { text: 'Stereotypical chip about disadvantaged people' }, // Should be filtered
        { text: 'Another normal chip' },
      ],
    });
    
    const result = await generateChips({ /* ... */ });
    
    expect(result.chips).toHaveLength(2); // Inappropriate one filtered out
  });
});
```

### 19.3 Integration Tests

**API Route Tests**:
```typescript
// tests/api/assessments.test.ts
import { POST, GET, PATCH } from '@/app/api/assessments/route';
import { createMockRequest, createMockUser } from '@/tests/helpers';

describe('POST /api/assessments', () => {
  it('creates assessment with valid data', async () => {
    const request = createMockRequest({
      method: 'POST',
      body: {
        title: 'Youth Services Assessment',
        targetPopulation: {
          description: 'Youth ages 14-18 in foster care',
        },
      },
      user: createMockUser({ role: 'org_admin' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.assessment.id).toBeDefined();
    expect(data.assessment.title).toBe('Youth Services Assessment');
  });

  it('validates required fields', async () => {
    const request = createMockRequest({
      method: 'POST',
      body: {
        title: '', // Empty title
      },
      user: createMockUser(),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error.code).toBe('VALIDATION_ERROR');
    expect(data.error.details.field).toBe('title');
  });

  it('enforces organization isolation', async () => {
    const user = createMockUser({ organizationId: 'org-1' });
    const request = createMockRequest({
      method: 'POST',
      body: { /* valid data */ },
      user,
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(data.assessment.organizationId).toBe('org-1');
    
    // Try to access from different org
    const otherUser = createMockUser({ organizationId: 'org-2' });
    const getRequest = createMockRequest({
      method: 'GET',
      params: { assessmentId: data.assessment.id },
      user: otherUser,
    });
    
    const getResponse = await GET(getRequest);
    expect(getResponse.status).toBe(403); // Forbidden
  });

  it('rate limits AI generation', async () => {
    const user = createMockUser();
    
    // Make 10 rapid requests
    const requests = Array(10).fill(null).map(() =>
      POST(createMockRequest({
        method: 'POST',
        path: '/api/ai/generate-chips',
        body: { /* valid data */ },
        user,
      }))
    );
    
    const responses = await Promise.all(requests);
    
    // Some should be rate limited
    expect(responses.some(r => r.status === 429)).toBe(true);
  });
});
```

**Database Tests**:
```typescript
// tests/db/assessments.test.ts
import { createAssessment, getAssessment } from '@/lib/db/assessments';
import { createTestOrg, createTestUser, cleanupTestData } from '@/tests/helpers';

describe('Assessment Database Operations', () => {
  let orgId: string;
  let userId: string;

  beforeEach(async () => {
    orgId = await createTestOrg();
    userId = await createTestUser(orgId);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  it('creates assessment with RLS enforcement', async () => {
    const assessment = await createAssessment({
      organizationId: orgId,
      userId,
      title: 'Test Assessment',
      targetPopulation: 'Youth in DC',
    });
    
    expect(assessment.id).toBeDefined();
    expect(assessment.organizationId).toBe(orgId);
  });

  it('prevents cross-org access', async () => {
    const assessment = await createAssessment({
      organizationId: orgId,
      userId,
      title: 'Test Assessment',
    });
    
    // Create different org/user
    const otherOrgId = await createTestOrg();
    const otherUserId = await createTestUser(otherOrgId);
    
    // Try to access first org's assessment
    await expect(
      getAssessment(assessment.id, otherUserId, otherOrgId)
    ).rejects.toThrow('Assessment not found');
  });

  it('cascades delete to related records', async () => {
    const assessment = await createAssessment({ /* ... */ });
    
    // Add chips
    await addChips(assessment.id, [
      { text: 'Chip 1', questionCategory: 'experiences' },
      { text: 'Chip 2', questionCategory: 'experiences' },
    ]);
    
    // Delete assessment
    await deleteAssessment(assessment.id);
    
    // Verify chips also deleted
    const chips = await getChips(assessment.id);
    expect(chips).toHaveLength(0);
  });
});
```

### 19.4 End-to-End Tests

**Critical User Journey**:
```typescript
// e2e/assessment-creation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Complete Assessment Creation Flow', () => {
  test('user can create assessment from start to finish', async ({ page }) => {
    // Login
    await page.goto('/signin');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to CommunityCompass
    await page.goto('/applications/communitycompass');
    await page.click('text=Start New Assessment');
    
    // Screen 1: Target Population
    await page.fill('[name="title"]', 'E2E Test Assessment');
    await page.fill(
      '[name="targetPopulation"]',
      'Youth ages 14-18 in foster care in Washington, DC'
    );
    
    await page.click('text=Generate Chips');
    await expect(page.locator('[data-testid="chip"]')).toHaveCount(5);
    
    // Select 3 chips for "Experiences"
    await page.click('[data-testid="chip"]:nth-of-type(1)');
    await page.click('[data-testid="chip"]:nth-of-type(3)');
    await page.click('[data-testid="chip"]:nth-of-type(5)');
    
    // Add custom chip
    await page.click('text=+ Add your own');
    await page.fill('[data-testid="custom-chip-input"]', 'Navigate school transitions');
    await page.press('[data-testid="custom-chip-input"]', 'Enter');
    
    // Repeat for other questions...
    // (Abbreviated for brevity)
    
    // Generate Focus Statement
    await page.click('text=Generate Focus Statement');
    await expect(page.locator('[data-testid="focus-statement"]')).toBeVisible();
    
    // Verify word count
    const wordCount = await page.locator('[data-testid="word-count"]').textContent();
    expect(parseInt(wordCount!)).toBeGreaterThanOrEqual(150);
    
    // Navigate to Screen 2
    await page.click('text=Next');
    
    // Screen 2: Empathy Map
    await expect(page.locator('text=Empathy Map')).toBeVisible();
    
    // Generate chips for all 4 quadrants
    const quadrants = ['pain', 'feelings', 'influences', 'intentions'];
    for (const quadrant of quadrants) {
      await page.click(`[data-testid="generate-${quadrant}"]`);
      await expect(page.locator(`[data-testid="${quadrant}-chip"]`)).toHaveCount(5);
      
      // Select 2-3 chips per quadrant
      await page.click(`[data-testid="${quadrant}-chip"]:nth-of-type(1)`);
      await page.click(`[data-testid="${quadrant}-chip"]:nth-of-type(2)`);
    }
    
    // Generate Empathy Narrative
    await page.click('text=Generate Narrative');
    await expect(page.locator('[data-testid="empathy-narrative"]')).toBeVisible();
    
    // Continue through remaining screens...
    await page.click('text=Next');
    
    // Final verification
    await page.goto('/applications/communitycompass/assessments');
    await expect(page.locator('text=E2E Test Assessment')).toBeVisible();
  });

  test('prevents navigation without saving changes', async ({ page }) => {
    // Create assessment and make edits
    await page.goto('/applications/communitycompass/assessment/test-id');
    await page.fill('[data-testid="focus-statement"]', 'Modified content');
    
    // Try to navigate away
    await page.click('text=Dashboard');
    
    // Expect confirmation dialog
    await expect(page.locator('text=You have unsaved changes')).toBeVisible();
    
    // Cancel navigation
    await page.click('text=Cancel');
    await expect(page).toHaveURL(/assessment\/test-id/);
  });

  test('auto-saves draft every 60 seconds', async ({ page }) => {
    await page.goto('/applications/communitycompass/assessment/test-id');
    
    // Make a change
    await page.fill('[data-testid="focus-statement"]', 'Auto-save test');
    
    // Wait for auto-save indicator
    await expect(page.locator('text=Draft saved')).toBeVisible({ timeout: 65000 });
    
    // Refresh page and verify content persisted
    await page.reload();
    await expect(page.locator('[data-testid="focus-statement"]')).toHaveValue('Auto-save test');
  });
});
```

**AI Generation Tests**:
```typescript
// e2e/ai-generation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('AI Generation Quality', () => {
  test('generates diverse, non-stereotypical chips', async ({ page }) => {
    await page.goto('/applications/communitycompass/assessment/test-id');
    
    // Generate chips
    await page.click('[data-testid="generate-experiences"]');
    
    // Get all chip texts
    const chips = await page.locator('[data-testid="chip"]').allTextContents();
    
    // Verify no stereotypical language
    const stereotypicalPhrases = ['disadvantaged', 'at-risk', 'underprivileged'];
    for (const phrase of stereotypicalPhrases) {
      expect(chips.every(c => !c.toLowerCase().includes(phrase))).toBe(true);
    }
    
    // Verify diversity (no exact duplicates)
    const uniqueChips = new Set(chips);
    expect(uniqueChips.size).toBe(chips.length);
  });

  test('handles AI service timeout gracefully', async ({ page }) => {
    // Mock slow AI response
    await page.route('**/api/ai/generate-chips', route => {
      setTimeout(() => route.fulfill({ status: 504 }), 1000);
    });
    
    await page.goto('/applications/communitycompass/assessment/test-id');
    await page.click('[data-testid="generate-experiences"]');
    
    // Expect error message with retry option
    await expect(page.locator('text=Unable to generate suggestions')).toBeVisible();
    await expect(page.locator('text=Retry')).toBeVisible();
    
    // Verify user can still add manual chips
    await page.click('text=+ Add your own');
    await expect(page.locator('[data-testid="custom-chip-input"]')).toBeVisible();
  });
});
```

### 19.5 Accessibility Tests

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Compliance', () => {
  test('assessment screens meet WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/applications/communitycompass/assessment/test-id');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works throughout app', async ({ page }) => {
    await page.goto('/applications/communitycompass/assessment/test-id');
    
    // Tab through all interactive elements
    await page.keyboard.press('Tab'); // Focus on first chip
    await expect(page.locator('[data-testid="chip"]:first-child')).toBeFocused();
    
    // Select chip with Enter
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-testid="chip"]:first-child')).toHaveClass(/selected/);
    
    // Navigate to Next button
    let tabCount = 0;
    while (tabCount < 20) {
      await page.keyboard.press('Tab');
      const nextButton = page.locator('text=Next');
      if (await nextButton.isFocused()) break;
      tabCount++;
    }
    
    expect(tabCount).toBeLessThan(20); // Ensure Next button is reachable
  });

  test('screen reader landmarks are present', async ({ page }) => {
    await page.goto('/applications/communitycompass/assessment/test-id');
    
    // Verify ARIA landmarks
    await expect(page.locator('[role="main"]')).toBeVisible();
    await expect(page.locator('[role="navigation"]')).toBeVisible();
    
    // Verify heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Only one h1
    
    // Verify form labels
    const inputs = await page.locator('input, textarea, select').all();
    for (const input of inputs) {
      const hasLabel = await input.evaluate(el => {
        return el.hasAttribute('aria-label') || 
               el.hasAttribute('aria-labelledby') ||
               !!document.querySelector(`label[for="${el.id}"]`);
      });
      expect(hasLabel).toBe(true);
    }
  });
});
```

### 19.6 Performance Tests

```typescript
// tests/performance/load-test.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Benchmarks', () => {
  test('assessment screens load in under 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/applications/communitycompass/assessment/test-id');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });

  test('AI chip generation completes in under 5 seconds', async ({ page }) => {
    await page.goto('/applications/communitycompass/assessment/test-id');
    
    const startTime = Date.now();
    await page.click('[data-testid="generate-experiences"]');
    await page.waitForSelector('[data-testid="chip"]');
    const generationTime = Date.now() - startTime;
    
    expect(generationTime).toBeLessThan(5000);
  });

  test('handles large assessments without lag', async ({ page }) => {
    // Create assessment with 100+ chips
    await page.goto('/applications/communitycompass/assessment/large-test-id');
    
    // Measure scroll performance
    const metrics = await page.evaluate(() => {
      performance.mark('scroll-start');
      window.scrollTo(0, document.body.scrollHeight);
      performance.mark('scroll-end');
      performance.measure('scroll', 'scroll-start', 'scroll-end');
      return performance.getEntriesByName('scroll')[0].duration;
    });
    
    expect(metrics).toBeLessThan(100); // Under 100ms for smooth scroll
  });
});
```

### 19.7 Test Coverage Requirements

| Category | Target Coverage | Critical Areas |
|----------|----------------|----------------|
| **Unit Tests** | 80%+ | Business logic, utilities, validations |
| **Component Tests** | 75%+ | All interactive components |
| **Integration Tests** | 60%+ | API routes, database operations |
| **E2E Tests** | Critical paths only | Assessment creation, AI generation |
| **Accessibility** | 100% | WCAG 2.1 AA compliance |

**Continuous Integration**:
- All tests run on every pull request
- Must pass before merge to main
- Performance tests run nightly
- Accessibility tests run on every commit
- Coverage reports uploaded to Codecov

---

## 20. Analytics & Instrumentation Plan

### 20.1 Analytics Goals

1. **Product Usage**: Understand how users interact with CommunityCompass
2. **Feature Adoption**: Track which features are most valuable
3. **AI Quality**: Measure AI-generated content acceptance rates
4. **Conversion**: Monitor premium feature upgrade rates
5. **Performance**: Identify bottlenecks and optimize

### 20.2 Event Tracking Plan

**Analytics Provider**: Mixpanel (recommended) or PostHog

#### Core Events

**User Journey Events**:
```typescript
// Assessment created
analytics.track('Assessment Created', {
  assessmentId: string;
  organizationId: string;
  organizationType: 'nonprofit' | 'funder' | 'consultant';
  userRole: string;
  timestamp: Date;
});

// Screen completed
analytics.track('Screen Completed', {
  assessmentId: string;
  screenNumber: 1 | 2 | 3 | 4 | 5 | 6;
  timeSpent: number; // seconds
  timestamp: Date;
});

// Assessment completed
analytics.track('Assessment Completed', {
  assessmentId: string;
  totalTime: number; // minutes
  screenProgression: number[]; // Time per screen
  timestamp: Date;
});
```

**AI Interaction Events**:
```typescript
// AI generation requested
analytics.track('AI Generation Requested', {
  feature: 'chips' | 'focus_statement' | 'empathy_narrative' | 'personas' | 'research';
  assessmentId: string;
  context: {
    questionCategory?: string;
    targetPopulation: string;
  };
  timestamp: Date;
});

// AI generation completed
analytics.track('AI Generation Completed', {
  feature: string;
  assessmentId: string;
  generationTime: number; // seconds
  tokensUsed: number;
  chipCount?: number;
  timestamp: Date;
});

// AI content accepted
analytics.track('AI Content Accepted', {
  feature: string;
  assessmentId: string;
  contentType: 'chip' | 'statement' | 'narrative' | 'persona';
  acceptanceType: 'full' | 'edited' | 'rejected';
  timestamp: Date;
});

// Chip selection
analytics.track('Chip Selected', {
  assessmentId: string;
  chipId: string;
  chipText: string;
  questionCategory: string;
  isAiGenerated: boolean;
  selectionOrder: number; // 1st, 2nd, 3rd chip selected
  timestamp: Date;
});

// Custom chip added
analytics.track('Custom Chip Added', {
  assessmentId: string;
  questionCategory: string;
  chipText: string;
  timestamp: Date;
});
```

**Feature Usage Events**:
```typescript
// Export generated
analytics.track('Profile Exported', {
  assessmentId: string;
  profileId: string;
  format: 'pdf' | 'docx' | 'markdown' | 'json';
  includeVisuals: boolean;
  template: string;
  timestamp: Date;
});

// Deep research requested (premium)
analytics.track('Deep Research Requested', {
  assessmentId: string;
  researchType: string;
  isPremiumUser: boolean;
  timestamp: Date;
});

// Assessment shared
analytics.track('Assessment Shared', {
  assessmentId: string;
  shareType: 'view' | 'edit';
  recipientCount: number;
  timestamp: Date;
});
```

**Engagement Events**:
```typescript
// Edit made
analytics.track('Content Edited', {
  assessmentId: string;
  contentType: 'focus_statement' | 'chip' | 'need' | 'persona';
  editType: 'create' | 'update' | 'delete';
  timestamp: Date;
});

// Draft auto-saved
analytics.track('Draft Auto Saved', {
  assessmentId: string;
  currentScreen: number;
  timestamp: Date;
});

// Navigation
analytics.track('Screen Navigated', {
  fromScreen: number;
  toScreen: number;
  navigationType: 'next' | 'previous' | 'jump';
  timestamp: Date;
});
```

### 20.3 User Properties

```typescript
// Set on login/signup
analytics.identify(userId, {
  organizationId: string;
  organizationType: 'nonprofit' | 'funder' | 'consultant';
  organizationSize: string;
  role: string;
  isPremium: boolean;
  accountCreatedAt: Date;
});

// Update on subscription change
analytics.people.set({
  isPremium: true;
  premiumUpgradedAt: Date;
});
```

### 20.4 Funnel Analysis

**Assessment Completion Funnel**:
```
Step 1: Assessment Created → 100%
Step 2: Population Defined → ~95%
Step 3: Screen 1 Completed → ~85%
Step 4: Screen 2 Started → ~75%
Step 5: Screen 2 Completed → ~70%
Step 6: Screen 3 Started → ~65%
Step 7: Assessment Completed → ~60%
```

**Target**: 70%+ completion rate

**Conversion Funnel (Premium)**:
```
Step 1: Viewed Deep Research → 100%
Step 2: Clicked "Upgrade" → ~15%
Step 3: Viewed Pricing → ~80%
Step 4: Started Checkout → ~50%
Step 5: Completed Purchase → ~90%
```

**Target**: 5-7% overall conversion from view to purchase

### 20.5 Key Metrics Dashboard

**Product Metrics**:
- Monthly Active Users (MAU)
- Assessments Created (per month)
- Assessments Completed (per month)
- Average Time to Complete Assessment
- Completion Rate by Screen
- Return User Rate (30-day)

**AI Quality Metrics**:
- Chip Acceptance Rate (% chips selected without edit)
- Focus Statement Acceptance Rate (% accepted with minor/no edits)
- Custom Chip Ratio (custom chips / total chips)
- AI Generation Success Rate (% successful API calls)
- Average Confidence Score (for AI-generated content)

**Engagement Metrics**:
- Average Session Duration
- Screens per Session
- Edit Actions per Assessment
- Share Rate (% assessments shared)
- Export Rate (% completed assessments exported)

**Premium Metrics**:
- Deep Research Requests (free users)
- Deep Research Usage (premium users)
- Upgrade Conversion Rate
- Premium Churn Rate
- Average Revenue Per User (ARPU)

### 20.6 Instrumentation Implementation

**Frontend Tracking**:
```typescript
// lib/analytics.ts
import mixpanel from 'mixpanel-browser';

export const analytics = {
  init: () => {
    if (typeof window !== 'undefined') {
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!);
    }
  },

  identify: (userId: string, traits: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      mixpanel.identify(userId);
      mixpanel.people.set(traits);
    }
  },

  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      mixpanel.track(event, {
        ...properties,
        timestamp: new Date().toISOString(),
        appName: 'communitycompass',
        environment: process.env.NODE_ENV,
      });
    }
  },

  page: (pageName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      mixpanel.track_pageview({
        ...properties,
        pageName,
      });
    }
  },
};
```

**Usage in Components**:
```typescript
// components/ChipSelector.tsx
import { analytics } from '@/lib/analytics';

function ChipSelector({ chips, onChipToggle, assessmentId }) {
  const handleChipClick = (chip: Chip) => {
    analytics.track('Chip Selected', {
      assessmentId,
      chipId: chip.id,
      chipText: chip.text,
      questionCategory: chip.questionCategory,
      isAiGenerated: chip.isAiGenerated,
    });
    
    onChipToggle(chip.id);
  };

  // ...
}
```

**Backend Tracking**:
```typescript
// api/ai/generate-chips/route.ts
import { trackEvent } from '@/lib/analytics/server';

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const result = await generateChips(data);
    
    await trackEvent('AI Generation Completed', {
      feature: 'chips',
      assessmentId: data.assessmentId,
      generationTime: (Date.now() - startTime) / 1000,
      tokensUsed: result.metadata.tokensUsed,
      chipCount: result.chips.length,
    });
    
    return Response.json(result);
  } catch (error) {
    await trackEvent('AI Generation Failed', {
      feature: 'chips',
      assessmentId: data.assessmentId,
      error: error.message,
      generationTime: (Date.now() - startTime) / 1000,
    });
    
    throw error;
  }
}
```

### 20.7 Privacy & Compliance

**PII Protection**:
- Never track actual community population descriptions
- Hash user emails before sending to analytics
- Anonymize assessment content
- Comply with GDPR data deletion requests

**Data Retention**:
- Raw analytics events: 2 years
- Aggregated metrics: Indefinite
- User data deletable on request

---

## 21. Error Handling & Edge Cases

### 21.1 Error Classification

All errors categorized by:
- **Severity**: Critical / High / Medium / Low
- **Type**: User Error / System Error / AI Error / Integration Error
- **Recoverability**: Recoverable / Partially Recoverable / Fatal

### 21.2 User Input Errors

**Empty Required Field**:
```typescript
Error: {
  code: 'VALIDATION_ERROR',
  severity: 'LOW',
  type: 'USER_ERROR',
  message: 'Target population is required',
  field: 'targetPopulation',
  recovery: 'RECOVERABLE'
}

UI Response:
- Red border on input field
- Inline error message below field
- Focus returned to field
- No data persisted
```

**Population Too Vague**:
```typescript
Error: {
  code: 'POPULATION_TOO_VAGUE',
  severity: 'MEDIUM',
  type: 'USER_ERROR',
  message: 'Please be more specific about your target community',
  suggestions: [
    'Add age range or demographics',
    'Specify geographic location',
    'Include unique circumstances',
  ],
  recovery: 'RECOVERABLE'
}

UI Response:
- Yellow warning banner
- Helpful examples displayed
- User can proceed anyway (soft validation)
- Warning logged for analysis
```

**Custom Chip Too Long**:
```typescript
Error: {
  code: 'CONTENT_TOO_LONG',
  severity: 'LOW',
  type: 'USER_ERROR',
  message: 'Custom insight must be 200 characters or less',
  currentLength: 237,
  maxLength: 200,
  recovery: 'RECOVERABLE'
}

UI Response:
- Character counter turns red
- Submit button disabled
- Real-time character count
- Truncation suggested
```

**Duplicate Assessment Title**:
```typescript
Error: {
  code: 'DUPLICATE_TITLE',
  severity: 'LOW',
  type: 'USER_ERROR',
  message: 'An assessment with this title already exists',
  existingAssessmentId: 'uuid',
  recovery: 'RECOVERABLE'
}

UI Response:
- Inline error message
- Link to existing assessment
- Suggestion to modify title
- Auto-suggest: "Youth Services Assessment (2)"
```

### 21.3 AI Service Errors

**API Timeout**:
```typescript
Error: {
  code: 'AI_TIMEOUT',
  severity: 'HIGH',
  type: 'AI_ERROR',
  message: 'AI service took too long to respond',
  timeout: 30000, // ms
  recovery: 'RECOVERABLE'
}

UI Response:
- Toast notification: "Generation taking longer than expected..."
- Retry button
- Manual entry option highlighted
- Error logged with context
```

**Rate Limit Exceeded**:
```typescript
Error: {
  code: 'AI_RATE_LIMIT',
  severity: 'HIGH',
  type: 'AI_ERROR',
  message: 'Too many AI requests. Please wait before trying again.',
  retryAfter: 60, // seconds
  recovery: 'PARTIALLY_RECOVERABLE'
}

UI Response:
- Error modal
- Countdown timer showing retry availability
- Manual entry option available immediately
- Premium upgrade CTA (if applicable)
```

**Content Moderation Failure**:
```typescript
Error: {
  code: 'AI_MODERATION_FAILED',
  severity: 'HIGH',
  type: 'AI_ERROR',
  message: 'Unable to verify content safety',
  recovery: 'RECOVERABLE'
}

UI Response:
- Chips not displayed
- Error message: "Please try again or add insights manually"
- Manual entry emphasized
- Incident logged for review
```

**Hallucination Detected (Deep Research)**:
```typescript
Error: {
  code: 'AI_LOW_CONFIDENCE',
  severity: 'MEDIUM',
  type: 'AI_ERROR',
  message: 'Unable to verify some claims',
  lowConfidenceItems: [
    { claim: '...', confidence: 0.45 },
  ],
  recovery: 'PARTIALLY_RECOVERABLE'
}

UI Response:
- Warning banner on research results
- Low-confidence items flagged
- Citations required for all claims
- User can mark as verified or request regeneration
```

### 21.4 Database Errors

**Connection Failure**:
```typescript
Error: {
  code: 'DB_CONNECTION_ERROR',
  severity: 'CRITICAL',
  type: 'SYSTEM_ERROR',
  message: 'Unable to connect to database',
  recovery: 'FATAL'
}

UI Response:
- Full-page error screen
- "Service temporarily unavailable" message
- Retry button
- Support contact information
- Automatic retry after 30 seconds
```

**Concurrent Edit Conflict**:
```typescript
Error: {
  code: 'DB_CONFLICT',
  severity: 'MEDIUM',
  type: 'SYSTEM_ERROR',
  message: 'This assessment was modified by another user',
  conflictingUser: 'Jane Doe',
  conflictingTimestamp: Date,
  recovery: 'PARTIALLY_RECOVERABLE'
}

UI Response:
- Modal dialog showing conflict
- Side-by-side comparison (your version vs current)
- Options: Keep yours / Keep theirs / Merge manually
- Changes auto-saved as separate draft
```

**RLS Policy Violation**:
```typescript
Error: {
  code: 'DB_AUTHORIZATION_ERROR',
  severity: 'HIGH',
  type: 'SYSTEM_ERROR',
  message: 'You do not have permission to access this resource',
  recovery: 'FATAL'
}

UI Response:
- Redirect to 403 error page
- Clear message about lack of permissions
- Contact org admin button
- Logged for security audit
```

### 21.5 Integration Errors

**Event Bus Failure**:
```typescript
Error: {
  code: 'EVENT_BUS_ERROR',
  severity: 'MEDIUM',
  type: 'INTEGRATION_ERROR',
  message: 'Unable to sync with other apps',
  recovery: 'PARTIALLY_RECOVERABLE'
}

UI Response:
- Warning banner: "Changes saved locally but not synced"
- Assessment still usable
- Background retry every 30 seconds
- Manual sync button available
```

**Export Generation Failure**:
```typescript
Error: {
  code: 'EXPORT_ERROR',
  severity: 'MEDIUM',
  type: 'INTEGRATION_ERROR',
  message: 'Failed to generate PDF export',
  recovery: 'RECOVERABLE'
}

UI Response:
- Toast notification with error
- Retry button
- Alternative formats offered (DOCX, JSON)
- Support ticket auto-created if repeated failures
```

### 21.6 Edge Cases

**Zero Chips Selected**:
```typescript
// User tries to proceed without selecting any chips

Handling:
- Warning message: "Consider selecting at least 3 insights for richer assessment"
- Allow proceeding (no hard block)
- Generate focus statement with note about limited data
- Log as analytics event (low engagement signal)
```

**All Chips Rejected**:
```typescript
// User deselects all AI-generated chips and adds only custom

Handling:
- Proceed normally (user preference respected)
- Track custom chip ratio for AI improvement
- No negative messaging (avoid discouraging manual input)
- Custom chips given equal weight in synthesis
```

**Extremely Long Assessment Time**:
```typescript
// User leaves assessment open for multiple days

Handling:
- Auto-save continues to work
- Session timeout after 24 hours of inactivity
- Gentle reminder notification after 1 hour idle
- All work preserved in draft
```

**Empty Focus Statement**:
```typescript
// AI generates empty or very short focus statement

Handling:
- Show error: "Unable to generate statement. Add more context?"
- Suggest selecting more chips
- Offer manual writing option
- Log as AI quality issue
```

**Premium Feature Access from Free User**:
```typescript
// Free user tries to access Deep Research

Handling:
- Show premium feature modal
- Clear explanation of premium benefits
- Pricing information
- "Upgrade Now" CTA
- "Learn More" secondary CTA
```

**Assessment Deleted Mid-Session**:
```typescript
// Assessment deleted by admin while user is editing

Handling:
- Detect on next save attempt
- Modal: "This assessment has been deleted"
- Offer to create new assessment with current content
- Save current work as draft (auto-recovery)
```

### 21.7 Error Recovery Strategies

**Automatic Retry**:
```typescript
// For transient errors (network, timeout)

async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

**Graceful Degradation**:
```typescript
// If AI service unavailable, fall back to manual entry

try {
  const chips = await generateChips(params);
  return chips;
} catch (error) {
  logger.error('AI generation failed', error);
  
  // Show manual entry form instead
  return {
    chips: [],
    fallbackMode: true,
    message: 'AI unavailable. Please add insights manually.',
  };
}
```

**Circuit Breaker**:
```typescript
// Prevent cascading failures from repeated AI errors

class CircuitBreaker {
  failures = 0;
  threshold = 5;
  resetTimeout = 60000; // 1 minute
  state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN

  async execute(fn) {
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is OPEN');
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      setTimeout(() => {
        this.state = 'HALF_OPEN';
        this.failures = 0;
      }, this.resetTimeout);
    }
  }

  onSuccess() {
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
    }
    this.failures = 0;
  }
}
```

---

## 22. Deployment & DevOps Plan

### 22.1 Infrastructure Architecture

**Hosting**: Vercel (Next.js optimized)

```
Production Environment:
├── Frontend: Vercel Edge Network
│   ├── Static assets: CDN-cached
│   ├── SSR pages: Edge functions
│   └── API routes: Serverless functions (AWS Lambda)
├── Database: Supabase (AWS us-east-1)
│   ├── PostgreSQL 15
│   ├── Connection pooling: pgBouncer
│   └── Backups: Daily automated
├── AI Services: Claude API (direct)
│   └── Rate limiting: Redis (Upstash)
├── File Storage: Supabase Storage (S3)
│   └── Exports, uploads
└── Monitoring: Vercel Analytics + Sentry
```

### 22.2 Environment Configuration

**Environments**:
1. **Local Development**: `localhost:3000`
2. **Preview/Staging**: `preview-*.vercel.app` (per-PR)
3. **Production**: `platform.visionimpacthub.com/communitycompass`

**Environment Variables**:
```bash
# .env.local (development)
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development

DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

REDIS_URL=redis://localhost:6379

MIXPANEL_TOKEN=abc123...
SENTRY_DSN=https://...

# Feature flags
NEXT_PUBLIC_ENABLE_DEEP_RESEARCH=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

```bash
# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

NEXT_PUBLIC_APP_URL=https://platform.visionimpacthub.com
NEXT_PUBLIC_ENVIRONMENT=production

DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

REDIS_URL=redis://production.upstash.io:6379

MIXPANEL_TOKEN=xyz789...
SENTRY_DSN=https://...

# Feature flags
NEXT_PUBLIC_ENABLE_DEEP_RESEARCH=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 22.3 CI/CD Pipeline

**GitHub Actions Workflow**:
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  pull_request:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Lint
        run: pnpm lint
      
      - name: Type check
        run: pnpm type-check
      
      - name: Unit tests
        run: pnpm test:unit
      
      - name: Integration tests
        run: pnpm test:integration
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Playwright
        run: pnpm exec playwright install --with-deps
      
      - name: Run E2E tests
        run: pnpm test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  deploy-preview:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_SCOPE }}

  deploy-production:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_SCOPE }}
      
      - name: Run smoke tests
        run: pnpm test:smoke
        env:
          APP_URL: https://platform.visionimpacthub.com
```

### 22.4 Database Migrations

**Migration Strategy**: Backward-compatible migrations only

```bash
# Create migration
pnpm supabase migration new add_confidence_column

# Generated migration file:
-- migrations/20251124120000_add_confidence_column.sql

-- Add column (nullable initially for compatibility)
ALTER TABLE statement_chips
ADD COLUMN IF NOT EXISTS confidence DECIMAL(3,2);

-- Backfill existing data
UPDATE statement_chips
SET confidence = 0.85
WHERE is_ai_generated = true AND confidence IS NULL;

-- Make non-nullable after backfill
ALTER TABLE statement_chips
ALTER COLUMN confidence SET DEFAULT 0.85;
```

**Migration Deployment**:
```bash
# Apply migrations (run before deploy)
pnpm supabase db push

# Verify migrations
pnpm supabase db diff
```

**Rollback Plan**:
```bash
# Revert last migration
pnpm supabase db reset --version [previous_version]

# Revert specific migration
pnpm supabase migration revert [migration_name]
```

### 22.5 Deployment Checklist

**Pre-Deployment**:
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review approved (2+ reviewers)
- [ ] Database migrations tested in staging
- [ ] Environment variables updated in Vercel
- [ ] Feature flags configured
- [ ] Changelog updated
- [ ] Documentation updated
- [ ] Performance benchmarks met
- [ ] Security scan passed (Snyk, npm audit)
- [ ] Accessibility audit passed (axe)

**Deployment Steps**:
1. **Database Migration**: Run migrations first
2. **Backend Deploy**: API routes and serverless functions
3. **Frontend Deploy**: Static assets and SSR pages
4. **Smoke Tests**: Automated health checks
5. **Monitor Metrics**: Watch error rates and performance

**Post-Deployment**:
- [ ] Verify all critical paths working
- [ ] Check error tracking dashboard (Sentry)
- [ ] Monitor performance metrics (Vercel Analytics)
- [ ] Review user feedback (first 24 hours)
- [ ] Check AI API usage/costs
- [ ] Verify analytics events firing
- [ ] Test premium features
- [ ] Confirm funder portal access (if applicable)

**Rollback Triggers**:
- Error rate > 5%
- Critical feature completely broken
- Database data loss detected
- Security vulnerability discovered
- AI service integration failure

**Rollback Process**:
1. Immediate: Revert Vercel deployment to previous version
2. Within 5 minutes: Verify rollback successful
3. Database: Revert migrations if necessary (rare)
4. Communication: Notify team and users if needed
5. Post-Mortem: Document incident and root cause

### 22.6 Monitoring & Alerting

**Health Checks**:
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database
    await supabase.from('community_assessments').select('id').limit(1);
    
    // Check AI service
    const aiHealth = await checkClaudeAPI();
    
    // Check Redis
    const redisHealth = await redis.ping();
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
        aiService: aiHealth ? 'ok' : 'degraded',
        cache: redisHealth ? 'ok' : 'degraded',
      },
    });
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        error: error.message,
      },
      { status: 503 }
    );
  }
}
```

**Alerts** (via Sentry + PagerDuty):
- **Critical**: Error rate > 5%, Database down, AI service down
- **High**: Response time > 5s (P95), Failed deployments
- **Medium**: Error rate > 1%, Memory usage > 80%
- **Low**: Disk usage > 70%, Cache miss rate > 50%

**Metrics Dashboard** (Vercel Analytics + Custom):
- Requests per minute
- Error rate
- P50/P95/P99 response times
- AI API calls & costs
- Database connection pool usage
- Cache hit/miss ratios
- User session duration
- Assessment completion rates

### 22.7 Backup & Disaster Recovery

**Database Backups**:
- **Automated**: Daily full backups (Supabase)
- **Retention**: 30 days rolling
- **Recovery Time Objective (RTO)**: < 1 hour
- **Recovery Point Objective (RPO)**: < 24 hours

**Point-in-Time Recovery**:
```bash
# Restore database to specific timestamp
supabase db restore --timestamp "2025-11-24T10:00:00Z"
```

**Disaster Recovery Plan**:
1. **Database Failure**: Restore from Supabase backup
2. **Vercel Failure**: Redeploy to alternative platform (Netlify)
3. **AI Service Failure**: Graceful degradation to manual entry
4. **Complete System Failure**: Follow documented DR runbook

---

## 23. Performance Optimization Strategy

### 23.1 Performance Targets

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Time to First Byte (TTFB) | < 200ms | < 500ms |
| First Contentful Paint (FCP) | < 1.0s | < 2.0s |
| Largest Contentful Paint (LCP) | < 1.5s | < 2.5s |
| Time to Interactive (TTI) | < 2.0s | < 3.5s |
| Cumulative Layout Shift (CLS) | < 0.1 | < 0.25 |
| API Response Time (P95) | < 500ms | < 1.5s |
| AI Generation Time | < 5s | < 10s |

### 23.2 Frontend Optimization

**Code Splitting**:
```typescript
// Lazy load screens
const EmpathyMapScreen = dynamic(() => import('./EmpathyMapScreen'), {
  loading: () => <LoadingSkeleton />,
});

// Lazy load modals
const PremiumModal = dynamic(() => import('./PremiumModal'), {
  ssr: false,
});
```

**Image Optimization**:
```tsx
import Image from 'next/image';

<Image
  src="/empathy-map-illustration.png"
  alt="Empathy Map"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

**Bundle Size Optimization**:
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'lib',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};
```

### 23.3 API Optimization

**Database Query Optimization**:
```sql
-- Add indexes for common queries
CREATE INDEX idx_assessments_org_status 
ON community_assessments(organization_id, status);

CREATE INDEX idx_chips_assessment_selected 
ON statement_chips(assessment_id, is_selected);

-- Use materialized views for complex aggregations
CREATE MATERIALIZED VIEW assessment_completion_stats AS
SELECT 
  organization_id,
  COUNT(*) as total_assessments,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
  AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) as avg_completion_time
FROM community_assessments
GROUP BY organization_id;

-- Refresh stats hourly
CREATE INDEX ON assessment_completion_stats(organization_id);
```

**Response Caching**:
```typescript
// Cache GET requests with stale-while-revalidate
export async function GET(request: Request) {
  const assessmentId = getAssessmentId(request);
  
  const assessment = await getAssessment(assessmentId);
  
  return Response.json(assessment, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

**API Route Response Compression**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const response = NextResponse.next();
  
  // Enable compression for API responses
  if (request.url.includes('/api/')) {
    response.headers.set('Content-Encoding', 'gzip');
  }
  
  return response;
}
```

### 23.4 AI Service Optimization

**Token Usage Reduction**:
```typescript
// Optimize prompts to reduce token count

// Before (verbose):
const prompt = `
You are an AI assistant helping nonprofit organizations understand their communities.
The organization has provided the following information about their target population: ${population}.
Based on this information, please generate 5 single-sentence insights about what this population experiences in their daily lives.
Each insight should be between 10 and 25 words.
Use asset-based, trauma-informed language.
Avoid stereotypes.
`;

// After (concise):
const prompt = `
Target population: ${population}

Generate 5 single-sentence insights (10-25 words each) about their daily experiences.
Use asset-based, trauma-informed language. Avoid stereotypes.
`;
```

**Response Caching**:
```typescript
// Cache AI responses for identical requests
async function generateChipsWithCache(params) {
  const cacheKey = `chips:${hashParams(params)}`;
  
  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Generate if not cached
  const chips = await generateChips(params);
  
  // Cache for 7 days
  await redis.setex(cacheKey, 7 * 24 * 60 * 60, JSON.stringify(chips));
  
  return chips;
}
```

**Streaming Responses**:
```typescript
// Stream AI responses for better perceived performance
export async function POST(request: Request) {
  const data = await request.json();
  
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  
  // Start AI generation
  callClaudeStreaming(data, async (chunk) => {
    await writer.write(
      new TextEncoder().encode(`data: ${JSON.stringify(chunk)}\n\n`)
    );
  });
  
  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
```

### 23.5 Database Optimization

**Connection Pooling**:
```typescript
// lib/db.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: {
      pooler: {
        connectionString: process.env.DATABASE_POOLER_URL,
      },
    },
    auth: {
      persistSession: false,
    },
  }
);
```

**Prepared Statements**:
```typescript
// Reuse prepared statements for common queries
const getAssessmentStmt = supabase
  .from('community_assessments')
  .select('*')
  .eq('id', ':id');

// Execute with parameters
const result = await getAssessmentStmt.eq('id', assessmentId);
```

**Batch Operations**:
```typescript
// Insert multiple chips in single query
async function saveChips(chips: Chip[]) {
  await supabase
    .from('statement_chips')
    .insert(chips); // Single batch insert
}
```

### 23.6 Monitoring & Profiling

**Performance Monitoring**:
```typescript
// lib/monitoring.ts
export function trackPerformance(metricName: string, value: number) {
  // Send to Vercel Analytics
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', {
      name: 'performance_metric',
      data: {
        metric: metricName,
        value: Math.round(value),
      },
    });
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metricName}: ${value}ms`);
  }
}

// Usage
const startTime = performance.now();
await generateChips(params);
trackPerformance('ai_generation_time', performance.now() - startTime);
```

**Lighthouse CI Integration**:
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000/
            http://localhost:3000/applications/communitycompass
          budgetPath: ./budget.json
          uploadArtifacts: true
```

**Budget Configuration**:
```json
// budget.json
{
  "path": "applications/communitycompass",
  "timings": [
    {
      "metric": "first-contentful-paint",
      "budget": 1000
    },
    {
      "metric": "interactive",
      "budget": 2000
    }
  ],
  "resourceSizes": [
    {
      "resourceType": "script",
      "budget": 300
    },
    {
      "resourceType": "stylesheet",
      "budget": 100
    }
  ]
}
```

---

## Appendix D: Implementation Timeline

### Phase 1: Foundation (Week 11)

**Days 1-2: Database Setup**
- [ ] Run database migrations
- [ ] Set up RLS policies
- [ ] Create indexes
- [ ] Seed test data

**Days 3-5: API Development**
- [ ] Implement assessment CRUD endpoints
- [ ] Implement chip management endpoints
- [ ] Set up AI service integration
- [ ] Add rate limiting

**Days 6-7: Frontend Integration**
- [ ] Connect Screen 1 to real APIs
- [ ] Implement auto-save
- [ ] Add error handling
- [ ] Test end-to-end flow

### Phase 2: Core Features (Week 12)

**Days 1-3: Remaining Screens**
- [ ] Integrate Screens 2-4
- [ ] Implement export functionality
- [ ] Add profile compilation
- [ ] Test complete workflow

**Days 4-5: AI Quality**
- [ ] Refine AI prompts
- [ ] Test content quality
- [ ] Implement content moderation
- [ ] Optimize token usage

**Days 6-7: Testing & Polish**
- [ ] Run full test suite
- [ ] Fix critical bugs
- [ ] Performance optimization
- [ ] Accessibility audit

### Phase 3: Launch Preparation (Post Week 12)

**Beta Launch**
- [ ] Deploy to staging
- [ ] Invite 10-20 beta testers
- [ ] Collect feedback
- [ ] Iterate on UX

**Production Launch**
- [ ] Final QA pass
- [ ] Deploy to production
- [ ] Monitor metrics closely
- [ ] Support early users

---

## Appendix E: Success Criteria Checklist

### Technical Acceptance
- [ ] All 6 screens functional
- [ ] 80%+ test coverage
- [ ] WCAG 2.1 AA compliance
- [ ] Performance targets met
- [ ] Security audit passed

### User Acceptance
- [ ] 70%+ assessment completion rate
- [ ] 75%+ AI chip acceptance rate
- [ ] 80%+ focus statement acceptance
- [ ] < 45 minutes average completion time
- [ ] 4.0+/5.0 user satisfaction

### Business Acceptance
- [ ] Successfully integrated with Data Warehouse
- [ ] Events flowing to platform event bus
- [ ] Analytics tracking working
- [ ] Premium features functional
- [ ] Funder access working (if applicable)

---

## Document Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Nov 24, 2025 | Initial PRD | TwentyNine Eleven |
| 1.1 | Nov 24, 2025 | Added technical specifications (Sections 15-23) | Claude PM |

---

**End of Complete PRD v1.1**

*This document is now comprehensive and ready for implementation. All technical, operational, and strategic aspects have been specified to enterprise-grade standards.*