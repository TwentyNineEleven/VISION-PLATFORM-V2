/**
 * CommunityPulse Engagement Detail API
 * GET /api/v1/community-pulse/engagements/[id] - Get engagement
 * PATCH /api/v1/community-pulse/engagements/[id] - Update engagement
 * DELETE /api/v1/community-pulse/engagements/[id] - Delete engagement
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { updateEngagementSchema } from '@/lib/validations/community-pulse';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch engagement (RLS will handle authorization)
    // Note: Table types will be available after running migrations and regenerating types
    const { data, error } = await (supabase as any)
      .from('community_pulse_engagements')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Engagement not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching engagement:', error);
      return NextResponse.json(
        { error: 'Failed to fetch engagement' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Engagement API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = updateEngagementSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const updates = validation.data;

    // Convert camelCase to snake_case
    const dbUpdates: Record<string, unknown> = {};

    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.currentStage !== undefined)
      dbUpdates.current_stage = updates.currentStage;
    if (updates.learningGoal !== undefined)
      dbUpdates.learning_goal = updates.learningGoal;
    if (updates.goalType !== undefined) dbUpdates.goal_type = updates.goalType;
    if (updates.targetPopulation !== undefined)
      dbUpdates.target_population = updates.targetPopulation;
    if (updates.estimatedParticipants !== undefined)
      dbUpdates.estimated_participants = updates.estimatedParticipants;
    if (updates.demographics !== undefined)
      dbUpdates.demographics = updates.demographics;
    if (updates.relationshipHistory !== undefined)
      dbUpdates.relationship_history = updates.relationshipHistory;
    if (updates.accessibilityNeeds !== undefined)
      dbUpdates.accessibility_needs = updates.accessibilityNeeds;
    if (updates.culturalConsiderations !== undefined)
      dbUpdates.cultural_considerations = updates.culturalConsiderations;
    if (updates.primaryMethod !== undefined)
      dbUpdates.primary_method = updates.primaryMethod;
    if (updates.secondaryMethods !== undefined)
      dbUpdates.secondary_methods = updates.secondaryMethods;
    if (updates.methodRationale !== undefined)
      dbUpdates.method_rationale = updates.methodRationale;
    if (updates.participationModel !== undefined)
      dbUpdates.participation_model = updates.participationModel;
    if (updates.recruitmentPlan !== undefined)
      dbUpdates.recruitment_plan = updates.recruitmentPlan;
    if (updates.facilitationPlan !== undefined)
      dbUpdates.facilitation_plan = updates.facilitationPlan;
    if (updates.questions !== undefined) dbUpdates.questions = updates.questions;
    if (updates.equityChecklist !== undefined)
      dbUpdates.equity_checklist = updates.equityChecklist;
    if (updates.riskAssessment !== undefined)
      dbUpdates.risk_assessment = updates.riskAssessment;
    if (updates.generatedMaterials !== undefined)
      dbUpdates.generated_materials = updates.generatedMaterials;
    if (updates.timeline !== undefined) dbUpdates.timeline = updates.timeline;
    if (updates.budgetEstimate !== undefined)
      dbUpdates.budget_estimate = updates.budgetEstimate;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
    if (updates.exportedTo !== undefined)
      dbUpdates.exported_to = updates.exportedTo;
    if (updates.exportedAt !== undefined)
      dbUpdates.exported_at = updates.exportedAt;

    // Update the engagement (RLS will handle authorization)
    // Note: Table types will be available after running migrations and regenerating types
    const { data, error } = await (supabase as any)
      .from('community_pulse_engagements')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Engagement not found' },
          { status: 404 }
        );
      }
      console.error('Error updating engagement:', error);
      return NextResponse.json(
        { error: 'Failed to update engagement' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Engagement API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Soft delete by setting status to archived
    // Note: Table types will be available after running migrations and regenerating types
    const { error } = await (supabase as any)
      .from('community_pulse_engagements')
      .update({ status: 'archived' })
      .eq('id', id);

    if (error) {
      console.error('Error deleting engagement:', error);
      return NextResponse.json(
        { error: 'Failed to delete engagement' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Engagement API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
