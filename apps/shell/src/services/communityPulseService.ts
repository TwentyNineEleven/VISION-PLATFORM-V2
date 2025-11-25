/**
 * CommunityPulse Service
 *
 * Handles engagement strategy CRUD operations and method lookups.
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import type {
  Engagement,
  EngagementMethod,
  EngagementStatus,
  EngagementTemplate,
  Material,
} from '@/types/community-pulse';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function dbToEngagement(row: Record<string, unknown>): Engagement {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    createdBy: row.created_by as string,
    title: row.title as string,
    status: row.status as EngagementStatus,
    currentStage: row.current_stage as number,
    learningGoal: row.learning_goal as string | undefined,
    goalType: row.goal_type as Engagement['goalType'],
    targetPopulation: row.target_population as string | undefined,
    estimatedParticipants: row.estimated_participants as number | undefined,
    demographics: row.demographics as Engagement['demographics'],
    relationshipHistory: row.relationship_history as string | undefined,
    accessibilityNeeds: row.accessibility_needs as Engagement['accessibilityNeeds'],
    culturalConsiderations: row.cultural_considerations as string | undefined,
    primaryMethod: row.primary_method as string | undefined,
    secondaryMethods: row.secondary_methods as string[] | undefined,
    methodRationale: row.method_rationale as string | undefined,
    aiRecommendations: row.ai_recommendations as Engagement['aiRecommendations'],
    participationModel: row.participation_model as Engagement['participationModel'],
    recruitmentPlan: row.recruitment_plan as string | undefined,
    facilitationPlan: row.facilitation_plan as Record<string, unknown> | undefined,
    questions: row.questions as Engagement['questions'],
    equityChecklist: row.equity_checklist as Engagement['equityChecklist'],
    riskAssessment: row.risk_assessment as Record<string, unknown> | undefined,
    generatedMaterials: row.generated_materials as Engagement['generatedMaterials'],
    timeline: row.timeline as Engagement['timeline'],
    budgetEstimate: row.budget_estimate as number | undefined,
    startDate: row.start_date as string | undefined,
    endDate: row.end_date as string | undefined,
    exportedTo: row.exported_to as string[] | undefined,
    exportedAt: row.exported_at as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function dbToMethod(row: Record<string, unknown>): EngagementMethod {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    category: row.category as EngagementMethod['category'],
    description: row.description as string,
    bestFor: row.best_for as string,
    groupSizeMin: row.group_size_min as number,
    groupSizeMax: row.group_size_max as number,
    durationMin: row.duration_min as number,
    durationMax: row.duration_max as number,
    costEstimateLow: row.cost_estimate_low as number,
    costEstimateHigh: row.cost_estimate_high as number,
    equityConsiderations: row.equity_considerations as string[],
    requirements: row.requirements as Record<string, unknown>,
    fitScores: row.fit_scores as EngagementMethod['fitScores'],
  };
}

// ============================================================================
// ENGAGEMENT CRUD
// ============================================================================

export const communityPulseService = {
  /**
   * Get all engagements for the current organization
   */
  async getEngagements(organizationId: string): Promise<Engagement[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('community_pulse_engagements')
      .select('*')
      .eq('organization_id', organizationId)
      .neq('status', 'archived')
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(dbToEngagement);
  },

  /**
   * Get a single engagement by ID
   */
  async getEngagement(id: string): Promise<Engagement | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('community_pulse_engagements')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return dbToEngagement(data);
  },

  /**
   * Create a new engagement
   */
  async createEngagement(
    organizationId: string,
    userId: string,
    title: string
  ): Promise<Engagement> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('community_pulse_engagements')
      .insert({
        organization_id: organizationId,
        created_by: userId,
        title,
        status: 'draft',
        current_stage: 1,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbToEngagement(data);
  },

  /**
   * Update an engagement
   */
  async updateEngagement(
    id: string,
    updates: Partial<{
      title: string;
      status: EngagementStatus;
      currentStage: number;
      learningGoal: string;
      goalType: Engagement['goalType'];
      targetPopulation: string;
      estimatedParticipants: number;
      demographics: Engagement['demographics'];
      relationshipHistory: string;
      accessibilityNeeds: Engagement['accessibilityNeeds'];
      culturalConsiderations: string;
      primaryMethod: string;
      secondaryMethods: string[];
      methodRationale: string;
      aiRecommendations: Engagement['aiRecommendations'];
      participationModel: Engagement['participationModel'];
      recruitmentPlan: string;
      facilitationPlan: Record<string, unknown>;
      questions: Engagement['questions'];
      equityChecklist: Engagement['equityChecklist'];
      riskAssessment: Record<string, unknown>;
      generatedMaterials: Engagement['generatedMaterials'];
      timeline: Engagement['timeline'];
      budgetEstimate: number;
      startDate: string;
      endDate: string;
      exportedTo: string[];
      exportedAt: string;
    }>
  ): Promise<Engagement> {
    const supabase = createClient();

    // Convert camelCase to snake_case for database
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.currentStage !== undefined) dbUpdates.current_stage = updates.currentStage;
    if (updates.learningGoal !== undefined) dbUpdates.learning_goal = updates.learningGoal;
    if (updates.goalType !== undefined) dbUpdates.goal_type = updates.goalType;
    if (updates.targetPopulation !== undefined) dbUpdates.target_population = updates.targetPopulation;
    if (updates.estimatedParticipants !== undefined) dbUpdates.estimated_participants = updates.estimatedParticipants;
    if (updates.demographics !== undefined) dbUpdates.demographics = updates.demographics;
    if (updates.relationshipHistory !== undefined) dbUpdates.relationship_history = updates.relationshipHistory;
    if (updates.accessibilityNeeds !== undefined) dbUpdates.accessibility_needs = updates.accessibilityNeeds;
    if (updates.culturalConsiderations !== undefined) dbUpdates.cultural_considerations = updates.culturalConsiderations;
    if (updates.primaryMethod !== undefined) dbUpdates.primary_method = updates.primaryMethod;
    if (updates.secondaryMethods !== undefined) dbUpdates.secondary_methods = updates.secondaryMethods;
    if (updates.methodRationale !== undefined) dbUpdates.method_rationale = updates.methodRationale;
    if (updates.aiRecommendations !== undefined) dbUpdates.ai_recommendations = updates.aiRecommendations;
    if (updates.participationModel !== undefined) dbUpdates.participation_model = updates.participationModel;
    if (updates.recruitmentPlan !== undefined) dbUpdates.recruitment_plan = updates.recruitmentPlan;
    if (updates.facilitationPlan !== undefined) dbUpdates.facilitation_plan = updates.facilitationPlan;
    if (updates.questions !== undefined) dbUpdates.questions = updates.questions;
    if (updates.equityChecklist !== undefined) dbUpdates.equity_checklist = updates.equityChecklist;
    if (updates.riskAssessment !== undefined) dbUpdates.risk_assessment = updates.riskAssessment;
    if (updates.generatedMaterials !== undefined) dbUpdates.generated_materials = updates.generatedMaterials;
    if (updates.timeline !== undefined) dbUpdates.timeline = updates.timeline;
    if (updates.budgetEstimate !== undefined) dbUpdates.budget_estimate = updates.budgetEstimate;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
    if (updates.exportedTo !== undefined) dbUpdates.exported_to = updates.exportedTo;
    if (updates.exportedAt !== undefined) dbUpdates.exported_at = updates.exportedAt;

    const { data, error } = await supabase
      .from('community_pulse_engagements')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbToEngagement(data);
  },

  /**
   * Delete (archive) an engagement
   */
  async archiveEngagement(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('community_pulse_engagements')
      .update({ status: 'archived' })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  /**
   * Permanently delete an engagement
   */
  async deleteEngagement(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('community_pulse_engagements')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  // ============================================================================
  // METHODS
  // ============================================================================

  /**
   * Get all engagement methods
   */
  async getMethods(): Promise<EngagementMethod[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('community_pulse_methods')
      .select('*')
      .order('name');

    if (error) throw new Error(error.message);
    return (data || []).map(dbToMethod);
  },

  /**
   * Get a method by slug
   */
  async getMethodBySlug(slug: string): Promise<EngagementMethod | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('community_pulse_methods')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return dbToMethod(data);
  },

  // ============================================================================
  // TEMPLATES
  // ============================================================================

  /**
   * Get available templates
   */
  async getTemplates(organizationId: string): Promise<EngagementTemplate[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('community_pulse_templates')
      .select('*')
      .or(`is_public.eq.true,organization_id.eq.${organizationId}`)
      .order('use_count', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((row) => ({
      id: row.id,
      organizationId: row.organization_id,
      createdBy: row.created_by,
      name: row.name,
      description: row.description,
      methodSlug: row.method_slug,
      templateData: row.template_data,
      isPublic: row.is_public,
      useCount: row.use_count,
      createdAt: row.created_at,
    }));
  },

  // ============================================================================
  // MATERIALS
  // ============================================================================

  /**
   * Get materials for an engagement
   */
  async getMaterials(engagementId: string): Promise<Material[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('community_pulse_materials')
      .select('*')
      .eq('engagement_id', engagementId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((row) => ({
      id: row.id,
      engagementId: row.engagement_id,
      materialType: row.material_type,
      title: row.title,
      content: row.content,
      fileUrl: row.file_url,
      version: row.version,
      isCustomized: row.is_customized,
      createdAt: row.created_at,
    }));
  },

  /**
   * Save a generated material
   */
  async saveMaterial(
    engagementId: string,
    materialType: Material['materialType'],
    title: string,
    content?: string,
    fileUrl?: string
  ): Promise<Material> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('community_pulse_materials')
      .insert({
        engagement_id: engagementId,
        material_type: materialType,
        title,
        content,
        file_url: fileUrl,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      engagementId: data.engagement_id,
      materialType: data.material_type,
      title: data.title,
      content: data.content,
      fileUrl: data.file_url,
      version: data.version,
      isCustomized: data.is_customized,
      createdAt: data.created_at,
    };
  },
};

export default communityPulseService;
