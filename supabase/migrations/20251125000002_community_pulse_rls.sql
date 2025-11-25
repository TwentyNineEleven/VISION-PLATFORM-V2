-- CommunityPulse RLS Policies

-- Enable RLS on all tables
ALTER TABLE community_pulse_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_pulse_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_pulse_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_pulse_templates ENABLE ROW LEVEL SECURITY;

-- Methods: Everyone can read (public lookup table)
CREATE POLICY "Anyone can view methods"
  ON community_pulse_methods FOR SELECT
  USING (true);

-- Engagements: Org members can view their org's engagements
CREATE POLICY "Users can view own org engagements"
  ON community_pulse_engagements FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create engagements"
  ON community_pulse_engagements FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own org engagements"
  ON community_pulse_engagements FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete engagements"
  ON community_pulse_engagements FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Materials: Follow engagement access
CREATE POLICY "Users can view engagement materials"
  ON community_pulse_materials FOR SELECT
  USING (
    engagement_id IN (
      SELECT id FROM community_pulse_engagements WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create engagement materials"
  ON community_pulse_materials FOR INSERT
  WITH CHECK (
    engagement_id IN (
      SELECT id FROM community_pulse_engagements WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update engagement materials"
  ON community_pulse_materials FOR UPDATE
  USING (
    engagement_id IN (
      SELECT id FROM community_pulse_engagements WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete engagement materials"
  ON community_pulse_materials FOR DELETE
  USING (
    engagement_id IN (
      SELECT id FROM community_pulse_engagements WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

-- Templates: Public or own org
CREATE POLICY "Users can view public or own org templates"
  ON community_pulse_templates FOR SELECT
  USING (
    is_public = true
    OR organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create templates"
  ON community_pulse_templates FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own org templates"
  ON community_pulse_templates FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own org templates"
  ON community_pulse_templates FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );
