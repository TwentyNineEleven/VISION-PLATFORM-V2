# Funder Organizations Infrastructure

**Feature Type:** Infrastructure / Business Model
**Status:** Planned
**Priority:** High (Revenue Driver)
**Last Updated:** November 17, 2025
**Owner:** Platform Team

---

## Overview

The Funder Organizations infrastructure enables foundations and government agencies to operate as first-class platform customers who manage portfolios of grantee nonprofit organizations. This feature represents a **major revenue driver** with differentiated pricing based on portfolio size.

### Purpose

Enable funders to:
- Track and monitor grantee organizations
- Access portfolio analytics across all grantees
- Organize grantees into program cohorts
- Benchmark grantee performance
- Streamline reporting workflows
- Generate aggregate insights

---

## Business Context

### Revenue Model

**Funder Subscription Tiers:**
- **Starter:** Up to 10 active grantees - $500/month
- **Growth:** Up to 50 active grantees - $2,000/month
- **Enterprise:** Unlimited grantees - Custom pricing

**Key Metrics:**
- Active Grantee = relationship_status = 'active'
- Billing based on active grantee count
- Annual contracts with monthly billing

### Market Opportunity

**Target Customers:**
- Private foundations
- Community foundations
- Corporate giving programs
- Government agencies
- Intermediary organizations

**Value Proposition:**
- Real-time grantee performance monitoring
- Reduced reporting burden on grantees
- Data-driven grant-making decisions
- Portfolio-wide impact measurement
- Compliance and risk management

---

## Key Capabilities

### For Foundation Administrators

- **Organization Management**
  - Create funder organization (type='funder')
  - Configure funder settings
  - Manage program officers
  - Set data access defaults

### For Program Officers

- **Portfolio Management**
  - View all grantee organizations
  - Organize into program cohorts
  - Track relationship status
  - Monitor funding allocations

- **Data Access Control**
  - Request access to grantee data
  - Configure permission levels
  - Approve/deny access requests
  - Audit data access

- **Portfolio Analytics**
  - Compare grantees within cohorts
  - Benchmark performance metrics
  - Track capacity assessment scores
  - Monitor grant applications
  - View aggregate impact data

### For Grantee Organizations

- **Access Management**
  - Receive funder access requests
  - Approve/deny data sharing
  - Configure what data to share
  - Revoke access if needed
  - View access audit logs

- **Simplified Reporting**
  - Grant funder access once
  - Automatic data sharing
  - Reduced manual reporting
  - Real-time updates

---

## Core Components

### 1. Organization Types

**Database Enum:**
```sql
CREATE TYPE organization_type AS ENUM (
  'nonprofit',           -- Standard nonprofit customer
  'funder',              -- Foundation/funder customer
  'platform_operator'    -- Internal platform admin
);
```

**Organization Type Features:**
- `nonprofit` - Access to all standard apps
- `funder` - Access to portfolio management features
- `platform_operator` - Administrative access

### 2. Funder Settings

**Configuration per Funder:**
```typescript
interface FunderSettings {
  funder_organization_id: string
  default_access_permissions: {
    can_view_assessments: boolean
    can_view_grant_applications: boolean
    can_view_impact_data: boolean
    can_view_financials: boolean
    can_view_documents: boolean
  }
  auto_approve_access_requests: boolean
  require_cohort_assignment: boolean
  enable_portfolio_analytics: boolean
  max_grantees_allowed: number
  billing_tier: 'starter' | 'growth' | 'enterprise'
}
```

### 3. Cohort Management

**Cohort Structure:**
```typescript
interface Cohort {
  id: string
  funder_organization_id: string
  name: string
  description: string
  fiscal_year: number
  program_area: string
  target_grantees_count: number
  total_funding_allocated: number
  created_at: DateTime
}
```

**Use Cases:**
- "FY2025 Education Grants"
- "Community Development Program"
- "COVID-19 Emergency Response"
- "Capacity Building Cohort 3"

### 4. Funder-Grantee Relationships

**Relationship Structure:**
```typescript
interface FunderGranteeRelationship {
  id: string
  funder_organization_id: string
  grantee_organization_id: string
  cohort_id?: string
  relationship_status: 'pending' | 'active' | 'suspended' | 'terminated'

  // Granular permissions
  can_view_assessments: boolean
  can_view_grant_applications: boolean
  can_view_impact_data: boolean
  can_view_financials: boolean
  can_view_documents: boolean
  can_view_board_info: boolean
  can_view_staff_info: boolean

  // Metadata
  requested_at: DateTime
  approved_at?: DateTime
  suspended_at?: DateTime
  terminated_at?: DateTime
  notes: string
}
```

### 5. Portfolio Analytics

**Aggregate Metrics:**
- Total grantees by status
- Grantees per cohort
- Average capacity assessment score
- Grant application success rate
- Total impact metrics across portfolio
- Risk assessment dashboard
- Comparison benchmarks

---

## Technical Architecture

### Database Layer

**New Tables:**
- `funder_settings` - Funder configuration
- `cohorts` - Grantee groupings
- `funder_grantee_relationships` - Access permissions
- `portfolio_analytics_cache` - Materialized views

**Modified Tables:**
- `organizations` - Add `organization_type` enum

**RLS Policies:**
- Funders can only see their relationships
- Grantees can only see relationships to them
- Platform operators see all

### API Layer

**New Endpoints:**
```typescript
// Cohort management
POST   /api/cohorts
GET    /api/cohorts
GET    /api/cohorts/:id
PATCH  /api/cohorts/:id
DELETE /api/cohorts/:id

// Relationship management
POST   /api/funder-relationships
GET    /api/funder-relationships
PATCH  /api/funder-relationships/:id
DELETE /api/funder-relationships/:id

// Portfolio analytics
GET    /api/portfolio/analytics
GET    /api/portfolio/grantees
GET    /api/portfolio/cohorts/:id/analytics
```

### UI Components

**New Pages:**
- `/funder/dashboard` - Portfolio overview
- `/funder/grantees` - Grantee list
- `/funder/cohorts` - Cohort management
- `/funder/analytics` - Portfolio analytics
- `/funder/settings` - Funder configuration

**New Components:**
- `<PortfolioDashboard />` - Aggregate metrics
- `<GranteeList />` - Searchable grantee table
- `<CohortManager />` - Cohort CRUD
- `<RelationshipConfigurator />` - Permission settings
- `<PortfolioAnalytics />` - Charts and benchmarks

---

## User Workflows

### Create Funder Organization

1. Sign up for platform
2. Select "Funder/Foundation" org type
3. Configure funder settings
4. Invite program officers
5. Set default access permissions

### Request Access to Grantee

1. Navigate to "Add Grantee"
2. Search for organization by name/EIN
3. Select organization
4. Choose cohort assignment
5. Configure access permissions
6. Send access request

### Approve Access Request (Grantee)

1. Receive notification of access request
2. Review funder details
3. Review requested permissions
4. Approve or deny request
5. Customize permissions if approving
6. Confirm data sharing

### View Portfolio Analytics

1. Navigate to Portfolio Dashboard
2. View aggregate metrics
3. Filter by cohort or time period
4. Compare grantee performance
5. Drill down into individual grantees
6. Export reports

### Organize into Cohorts

1. Navigate to Cohort Management
2. Create new cohort
3. Define cohort parameters
4. Assign grantees to cohort
5. View cohort analytics
6. Compare cohort performance

---

## Security & Privacy

### Access Control

**Funder Access:**
- Funders can ONLY access grantee data with explicit permission
- Each permission is granular and configurable
- Grantees can revoke access at any time

**Grantee Control:**
- Grantees approve all access requests
- Can customize permissions per funder
- Can view access audit logs
- Can export data access reports

### Data Isolation

**RLS Enforcement:**
- Funders cannot see grantee data without relationship
- Relationships enforce permission boundaries
- No cross-funder data leakage
- Platform operators have audit access only

### Compliance

**GDPR:**
- Grantees control data sharing
- Right to revoke access
- Data access audit logs
- Data processing agreements

**SOC 2:**
- Access control monitoring
- Permission change auditing
- Regular access reviews
- Least privilege enforcement

---

## Billing Integration

### Subscription Management

**Active Grantee Count:**
```sql
SELECT COUNT(*)
FROM funder_grantee_relationships
WHERE funder_organization_id = :funder_id
  AND relationship_status = 'active';
```

**Tier Calculation:**
- Count active grantees
- Determine tier based on count
- Apply pricing from tier
- Bill monthly via Stripe

**Overage Handling:**
- Alert when approaching tier limit
- Allow temporary overage (7 days)
- Prompt upgrade or deactivate grantees
- Auto-upgrade if enabled

### Revenue Reporting

**Metrics Tracked:**
- Monthly Recurring Revenue (MRR)
- Active funders by tier
- Average grantees per funder
- Churn rate
- Upgrade/downgrade trends

---

## Implementation Status

### Phase 1: Foundation (Planned)
- [ ] Database schema and migrations
- [ ] Organization type infrastructure
- [ ] Basic relationship management

### Phase 2: Cohort Management (Planned)
- [ ] Cohort CRUD operations
- [ ] Grantee assignment
- [ ] Cohort analytics

### Phase 3: Portfolio Analytics (Planned)
- [ ] Analytics dashboard
- [ ] Benchmarking features
- [ ] Export capabilities

### Phase 4: Billing Integration (Planned)
- [ ] Tier-based billing
- [ ] Usage tracking
- [ ] Stripe integration

---

## Related Documentation

### Implementation Specs
- [.kiro/specs/infrastructure-funder-organizations/](../../../../.kiro/specs/infrastructure-funder-organizations/) - Detailed implementation specification

### Related Features
- [App Permissions](../../platform/features/app-permissions/README.md) - Permission system
- [Analytics & Reporting](../../platform/features/analytics-reporting/README.md) - Portfolio analytics
- [Security & Audit](../../platform/features/security-audit/README.md) - Access auditing

### Steering Documents
- [/documentation/general/PRD.md](/documentation/general/PRD.md) - Funder portal requirements
- [/documentation/general/ARCHITECTURE.md](/documentation/general/ARCHITECTURE.md) - Multi-tenant architecture
- [/documentation/general/SECURITY.md](/documentation/general/SECURITY.md) - Security guidelines

---

## Metrics & Success Criteria

### Adoption
- 50+ funder organizations in first year
- 70% of funders at Growth tier or above
- 500+ active grantee relationships
- 90% of grantees approve access requests

### Revenue
- $100K+ MRR from funder subscriptions
- 25% of total platform revenue
- < 5% monthly churn
- > 30% upgrade rate

### Value
- 50% reduction in grantee reporting time
- 80% of funders use portfolio analytics weekly
- 90% funder satisfaction score
- 2x increase in data-driven grant decisions

---

## Open Questions

1. Should we allow grantees to charge funders for data access?
2. What happens if a grantee organization closes their account?
3. Should we offer a free tier for small family foundations?
4. How do we handle multiple funders requesting conflicting permissions?
5. Should we build a funder marketplace for grantees to discover funders?

---

## Next Steps

1. Review and approve business model
2. Validate pricing with potential customers
3. Read detailed specification in `.kiro/specs/infrastructure-funder-organizations/`
4. Review technical design
5. Estimate implementation timeline
6. Schedule implementation sprint

---

**For detailed implementation guidance, see:**
- [Requirements Specification](../../../../.kiro/specs/infrastructure-funder-organizations/requirements.md)
- [Technical Design](../../../../.kiro/specs/infrastructure-funder-organizations/design.md)
- [Implementation Tasks](../../../../.kiro/specs/infrastructure-funder-organizations/tasks.md)
