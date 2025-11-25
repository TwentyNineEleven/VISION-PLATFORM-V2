# CommunityPulse Architecture Plan

**Version:** 1.0
**Date:** November 25, 2025
**Status:** Ready for Development

---

## Section A: System Context & North Star

### Position in VISION Platform
CommunityPulse is the **strategic planning layer** for community engagement, sitting between organizational assessment (CapacityIQ) and execution (VisionFlow).

### North Star
Enable nonprofits to design intentional, equity-centered community engagement strategies in under 10 hours, with AI-generated execution materials.

### Data Flow
```
CapacityIQ (gaps) → CommunityPulse (strategy) → VisionFlow (execution) → Community Compass (analysis)
```

---

## Section B: Technical Architecture

### Database Schema

```sql
-- Core engagement strategies table
CREATE TABLE community_pulse_engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'exported', 'archived')),
  current_stage INTEGER DEFAULT 1 CHECK (current_stage BETWEEN 1 AND 7),

  -- Stage 1: Learning Goal
  learning_goal TEXT,
  goal_type TEXT CHECK (goal_type IN ('explore', 'test', 'decide')),

  -- Stage 2: Community Context
  target_population TEXT,
  estimated_participants INTEGER,
  demographics JSONB DEFAULT '{}',
  relationship_history TEXT,
  accessibility_needs JSONB DEFAULT '{}',
  cultural_considerations TEXT,

  -- Stage 3: Method Selection
  primary_method TEXT,
  secondary_methods TEXT[] DEFAULT '{}',
  method_rationale TEXT,
  ai_recommendations JSONB DEFAULT '{}',

  -- Stage 4: Strategy Design
  participation_model TEXT CHECK (participation_model IN ('informational', 'consultative', 'collaborative', 'community_controlled')),
  recruitment_plan TEXT,
  facilitation_plan JSONB DEFAULT '{}',
  questions JSONB DEFAULT '[]',
  equity_checklist JSONB DEFAULT '{}',
  risk_assessment JSONB DEFAULT '{}',

  -- Stage 5: Materials
  generated_materials JSONB DEFAULT '[]',

  -- Stage 6: Timeline
  timeline JSONB DEFAULT '{}',
  budget_estimate DECIMAL(10,2),
  start_date DATE,
  end_date DATE,

  -- Stage 7: Export
  exported_to TEXT[] DEFAULT '{}',
  exported_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Engagement methods lookup
CREATE TABLE community_pulse_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  best_for TEXT,
  group_size_min INTEGER,
  group_size_max INTEGER,
  duration_min INTEGER,
  duration_max INTEGER,
  cost_estimate_low DECIMAL(10,2),
  cost_estimate_high DECIMAL(10,2),
  equity_considerations TEXT[],
  requirements JSONB DEFAULT '{}',
  fit_scores JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated materials storage
CREATE TABLE community_pulse_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES community_pulse_engagements(id) ON DELETE CASCADE,
  material_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  version INTEGER DEFAULT 1,
  is_customized BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates library
CREATE TABLE community_pulse_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  created_by UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  method_slug TEXT,
  template_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cp_engagements_org ON community_pulse_engagements(organization_id);
CREATE INDEX idx_cp_engagements_status ON community_pulse_engagements(status);
CREATE INDEX idx_cp_materials_engagement ON community_pulse_materials(engagement_id);
CREATE INDEX idx_cp_templates_org ON community_pulse_templates(organization_id);
```

### RLS Policies

```sql
-- Enable RLS
ALTER TABLE community_pulse_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_pulse_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_pulse_templates ENABLE ROW LEVEL SECURITY;

-- Engagements: org members can view/edit their org's engagements
CREATE POLICY "Users can view own org engagements" ON community_pulse_engagements
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create engagements" ON community_pulse_engagements
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own org engagements" ON community_pulse_engagements
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete engagements" ON community_pulse_engagements
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Materials: follow engagement access
CREATE POLICY "Users can access engagement materials" ON community_pulse_materials
  FOR ALL USING (
    engagement_id IN (
      SELECT id FROM community_pulse_engagements WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

-- Templates: public or own org
CREATE POLICY "Users can view templates" ON community_pulse_templates
  FOR SELECT USING (
    is_public = TRUE OR organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/community-pulse/engagements` | List org engagements |
| POST | `/api/v1/community-pulse/engagements` | Create new engagement |
| GET | `/api/v1/community-pulse/engagements/[id]` | Get engagement details |
| PATCH | `/api/v1/community-pulse/engagements/[id]` | Update engagement |
| DELETE | `/api/v1/community-pulse/engagements/[id]` | Delete engagement |
| GET | `/api/v1/community-pulse/methods` | List all methods |
| POST | `/api/v1/community-pulse/ai/recommend-methods` | AI method recommendations |
| POST | `/api/v1/community-pulse/ai/generate-questions` | AI question generation |
| POST | `/api/v1/community-pulse/ai/generate-materials` | AI material generation |
| GET | `/api/v1/community-pulse/templates` | List templates |
| POST | `/api/v1/community-pulse/export/visionflow` | Export to VisionFlow |

---

## Section C: AI Architecture

### AI Service Structure

```typescript
// services/communityPulseAI.ts

export const communityPulseAI = {
  // Recommend engagement methods based on context
  async recommendMethods(input: {
    learningGoal: string;
    goalType: 'explore' | 'test' | 'decide';
    targetPopulation: string;
    estimatedSize: number;
    relationshipHistory: string;
    accessibilityNeeds: string[];
    timeline: string;
    budget: number;
  }): Promise<MethodRecommendation[]>;

  // Generate question protocol
  async generateQuestions(input: {
    method: string;
    learningGoal: string;
    communityContext: CommunityContext;
    questionCount: number;
  }): Promise<QuestionProtocol>;

  // Generate facilitator guide
  async generateFacilitatorGuide(input: {
    engagement: Engagement;
  }): Promise<FacilitatorGuide>;

  // Check for bias in questions
  async checkBias(input: {
    questions: string[];
    context: CommunityContext;
  }): Promise<BiasCheckResult>;
};
```

### AI Prompt Templates

**Method Recommendation Prompt:**
```
You are a community engagement expert. Recommend the top 3 methods from:
[focus_groups, listening_sessions, interviews, surveys, workshops, story_circles,
co_design, walkthroughs, world_cafe, forums, asset_mapping, photovoice,
digital_feedback, visioning, deliberative_dialogue]

Context:
- Learning Goal: {goal}
- Goal Type: {type}
- Population: {population}
- Group Size: {size}
- Trust Level: {trust}
- Accessibility: {needs}

Return JSON with: method, fit_score (0-100), rationale, timeline, budget_range, equity_notes
```

**Question Generation Prompt:**
```
Generate {count} discussion questions for a {method} engagement.

Learning Goal: {goal}
Community: {demographics}
Cultural Notes: {cultural}

Requirements:
- Open-ended, 8th grade reading level
- Sequence from rapport-building to substantive
- Include probes for short answers
- Flag any bias concerns

Return JSON: opening, core_questions[], closing, bias_flags[]
```

---

## Section D: UI/UX Specification

### Top Navigation
```
CommunityPulse | My Strategies | Templates | Methods Library | Help
```

### Page Structure

```
/community-pulse                    → Dashboard (strategy list)
/community-pulse/new                → New strategy wizard
/community-pulse/[id]               → Strategy detail/editor
/community-pulse/[id]/stage/[1-7]   → Stage-specific editing
/community-pulse/templates          → Template library
/community-pulse/methods            → Methods reference
```

### 7-Stage Progress Stepper
```
[1]━━━[2]━━━[3]━━━[4]━━━[5]━━━[6]━━━[7]
 ✓     ●     ○     ○     ○     ○     ○
Goal  Community Method Strategy Materials Timeline Export
```

### Key Components

| Component | Description |
|-----------|-------------|
| `EngagementCard` | Strategy summary card for dashboard |
| `StageWizard` | Multi-step form container |
| `MethodRecommendationCard` | AI recommendation display |
| `EquityChecklist` | Trauma-informed checklist form |
| `MaterialPreview` | Generated document preview |
| `TimelineBuilder` | Gantt-style timeline editor |

### Color Usage (2911 Bold)
- **Blue (#0047AB)**: Primary CTAs, active stage
- **Green (#047857)**: Completed stages, success states
- **Orange (#C2410C)**: Equity warnings, attention needed
- **Purple (#6D28D9)**: AI recommendations badge
- **Red (#B91C1C)**: Required fields, errors

---

## Section E: Cross-App Integrations

### CapacityIQ → CommunityPulse
```typescript
// When CapacityIQ assessment shows engagement gaps
interface CapacityIQImport {
  assessmentId: string;
  engagementScore: number;
  identifiedGaps: string[];
  stakeholderList: Stakeholder[];
  strategicPriorities: string[];
}
```

### CommunityPulse → VisionFlow
```typescript
// Export complete strategy for execution
interface VisionFlowExport {
  strategyId: string;
  title: string;
  method: string;
  timeline: Timeline;
  materials: MaterialUrl[];
  equityChecklist: EquityChecklist;
  milestones: Milestone[];
}
```

### CommunityPulse → LaunchPath
```typescript
// Export as project with tasks
interface LaunchPathExport {
  projectName: string;
  tasks: Task[];
  budget: BudgetItem[];
  dependencies: Dependency[];
}
```

### CommunityPulse → Ops360
```typescript
// Export operational logistics
interface Ops360Export {
  events: Event[];
  supplies: Supply[];
  vendors: Vendor[];
  budgetItems: BudgetItem[];
}
```

---

## Section F: Testing Strategy

### Unit Tests
- Service functions (engagement CRUD, AI calls)
- Utility functions (validation, formatting)
- Component logic

### Integration Tests
- API routes with auth
- Database operations with RLS
- AI service integration

### E2E Tests (Playwright)
- Complete strategy creation flow
- AI recommendation acceptance
- Material generation and download
- Export to VisionFlow

### RLS Tests
- Cross-org data isolation
- Role-based permissions
- Funder view access

---

## Section G: Development Roadmap

### Phase 0: Foundation (Week 1)
- [ ] Database migrations
- [ ] RLS policies
- [ ] Base types and interfaces
- [ ] Service layer skeleton

### Phase 1: Core CRUD (Week 2)
- [ ] Engagement CRUD API
- [ ] Dashboard page
- [ ] Basic strategy editor
- [ ] Methods lookup table

### Phase 2: 7-Stage Wizard (Week 3-4)
- [ ] Stage 1: Learning Goal
- [ ] Stage 2: Community Context
- [ ] Stage 3: Method Selection (with AI)
- [ ] Stage 4: Strategy Design
- [ ] Stage 5: Material Generation
- [ ] Stage 6: Timeline Builder
- [ ] Stage 7: Export

### Phase 3: AI Integration (Week 5)
- [ ] Method recommendation engine
- [ ] Question generation
- [ ] Facilitator guide generation
- [ ] Bias detection

### Phase 4: Integrations (Week 6)
- [ ] VisionFlow export
- [ ] LaunchPath export
- [ ] Ops360 export
- [ ] CapacityIQ import

### Phase 5: Polish & Testing (Week 7-8)
- [ ] E2E tests
- [ ] RLS tests
- [ ] UI polish
- [ ] Documentation

---

## Section H: Comparable Tools

| Tool | Strengths | Gaps CommunityPulse Fills |
|------|-----------|---------------------------|
| **SurveyMonkey** | Easy surveys | No method guidance, no equity framework |
| **Qualtrics** | Advanced surveys | Survey-only, expensive |
| **Bang the Table** | Civic engagement | Government-focused, no AI |
| **Social Pinpoint** | Mapping, forums | No strategy planning |
| **Mobilize** | Event management | No engagement design |

### CommunityPulse Differentiators
1. Framework-agnostic (15 methods vs survey-only)
2. AI-powered recommendations
3. Built-in equity/trauma-informed framework
4. Complete material generation
5. VISION Platform integration

---

## File Structure

```
apps/shell/src/app/community-pulse/
├── page.tsx                    # Dashboard
├── new/
│   └── page.tsx               # New strategy wizard
├── [id]/
│   ├── page.tsx               # Strategy detail
│   └── stage/
│       └── [stage]/
│           └── page.tsx       # Stage editor
├── templates/
│   └── page.tsx               # Templates library
├── methods/
│   └── page.tsx               # Methods reference
├── components/
│   ├── EngagementCard.tsx
│   ├── StageWizard.tsx
│   ├── MethodRecommendationCard.tsx
│   ├── EquityChecklist.tsx
│   ├── QuestionBuilder.tsx
│   ├── MaterialPreview.tsx
│   └── TimelineBuilder.tsx
├── services/
│   ├── engagementService.ts
│   └── communityPulseAI.ts
├── types/
│   └── index.ts
└── lib/
    ├── methods.ts             # 15 methods data
    └── prompts.ts             # AI prompt templates
```

---

## Next Steps

1. Create database migration
2. Seed engagement methods (15)
3. Build dashboard and basic CRUD
4. Implement stage wizard
5. Integrate AI services
6. Add integrations
7. Test and polish

---

**Ready for Development**
