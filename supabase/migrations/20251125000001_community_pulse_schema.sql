-- CommunityPulse Schema Migration
-- Community Engagement Strategy Builder

-- Engagement methods lookup table (15 methods)
CREATE TABLE IF NOT EXISTS community_pulse_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  best_for TEXT,
  group_size_min INTEGER,
  group_size_max INTEGER,
  duration_min INTEGER, -- minutes
  duration_max INTEGER, -- minutes
  cost_estimate_low DECIMAL(10,2),
  cost_estimate_high DECIMAL(10,2),
  equity_considerations TEXT[] DEFAULT '{}',
  requirements JSONB DEFAULT '{}',
  fit_scores JSONB DEFAULT '{}', -- {explore: 0.8, test: 0.5, decide: 0.3}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core engagement strategies table
CREATE TABLE IF NOT EXISTS community_pulse_engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- Generated materials storage
CREATE TABLE IF NOT EXISTS community_pulse_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES community_pulse_engagements(id) ON DELETE CASCADE,
  material_type TEXT NOT NULL CHECK (material_type IN (
    'facilitator_guide', 'consent_form', 'question_protocol',
    'participant_materials', 'recruitment_flyer', 'note_template',
    'follow_up_template', 'timeline', 'budget'
  )),
  title TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  version INTEGER DEFAULT 1,
  is_customized BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates library
CREATE TABLE IF NOT EXISTS community_pulse_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  method_slug TEXT,
  template_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cp_engagements_org ON community_pulse_engagements(organization_id);
CREATE INDEX IF NOT EXISTS idx_cp_engagements_status ON community_pulse_engagements(status);
CREATE INDEX IF NOT EXISTS idx_cp_engagements_created_by ON community_pulse_engagements(created_by);
CREATE INDEX IF NOT EXISTS idx_cp_materials_engagement ON community_pulse_materials(engagement_id);
CREATE INDEX IF NOT EXISTS idx_cp_templates_org ON community_pulse_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_cp_methods_slug ON community_pulse_methods(slug);

-- Update trigger for engagements
CREATE OR REPLACE FUNCTION update_cp_engagement_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cp_engagement_updated_at
  BEFORE UPDATE ON community_pulse_engagements
  FOR EACH ROW
  EXECUTE FUNCTION update_cp_engagement_updated_at();
