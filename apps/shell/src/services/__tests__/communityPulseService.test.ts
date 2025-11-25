/**
 * CommunityPulse Service Tests
 * Unit tests for engagement strategy operations
 */

import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { communityPulseService } from '../communityPulseService';

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

// Mock Supabase client instance
const mockSupabaseClient = {
  from: vi.fn(),
};

// Helper to create mock query builder
function createMockQueryBuilder(data: unknown = null, error: unknown = null) {
  const builder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error }),
  };
  // For non-single queries
  builder.order.mockResolvedValue({ data: Array.isArray(data) ? data : [data], error });
  return builder;
}

describe('communityPulseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEngagements', () => {
    it('should fetch engagements for an organization', async () => {
      const mockEngagements = [
        {
          id: 'eng-1',
          organization_id: 'org-1',
          created_by: 'user-1',
          title: 'Test Engagement',
          status: 'draft',
          current_stage: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const queryBuilder = createMockQueryBuilder(mockEngagements);
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await communityPulseService.getEngagements('org-1');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('community_pulse_engagements');
      expect(queryBuilder.select).toHaveBeenCalledWith('*');
      expect(queryBuilder.eq).toHaveBeenCalledWith('organization_id', 'org-1');
      expect(queryBuilder.neq).toHaveBeenCalledWith('status', 'archived');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('eng-1');
      expect(result[0].title).toBe('Test Engagement');
    });

    it('should throw error on database failure', async () => {
      const queryBuilder = createMockQueryBuilder(null, { message: 'Database error' });
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      await expect(communityPulseService.getEngagements('org-1')).rejects.toThrow('Database error');
    });
  });

  describe('getEngagement', () => {
    it('should fetch a single engagement by ID', async () => {
      const mockEngagement = {
        id: 'eng-1',
        organization_id: 'org-1',
        created_by: 'user-1',
        title: 'Test Engagement',
        status: 'draft',
        current_stage: 1,
        learning_goal: 'Understand user needs',
        goal_type: 'explore',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const queryBuilder = createMockQueryBuilder(mockEngagement);
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await communityPulseService.getEngagement('eng-1');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('community_pulse_engagements');
      expect(queryBuilder.eq).toHaveBeenCalledWith('id', 'eng-1');
      expect(result).not.toBeNull();
      expect(result?.learningGoal).toBe('Understand user needs');
      expect(result?.goalType).toBe('explore');
    });

    it('should return null for non-existent engagement', async () => {
      const queryBuilder = createMockQueryBuilder(null, { code: 'PGRST116', message: 'Not found' });
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await communityPulseService.getEngagement('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('createEngagement', () => {
    it('should create a new engagement with default values', async () => {
      const mockCreatedEngagement = {
        id: 'eng-new',
        organization_id: 'org-1',
        created_by: 'user-1',
        title: 'New Strategy',
        status: 'draft',
        current_stage: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const queryBuilder = createMockQueryBuilder(mockCreatedEngagement);
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await communityPulseService.createEngagement('org-1', 'user-1', 'New Strategy');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('community_pulse_engagements');
      expect(queryBuilder.insert).toHaveBeenCalledWith({
        organization_id: 'org-1',
        created_by: 'user-1',
        title: 'New Strategy',
        status: 'draft',
        current_stage: 1,
      });
      expect(result.id).toBe('eng-new');
      expect(result.status).toBe('draft');
      expect(result.currentStage).toBe(1);
    });
  });

  describe('updateEngagement', () => {
    it('should update engagement fields correctly', async () => {
      const mockUpdatedEngagement = {
        id: 'eng-1',
        organization_id: 'org-1',
        created_by: 'user-1',
        title: 'Updated Title',
        status: 'in_progress',
        current_stage: 2,
        learning_goal: 'New goal',
        goal_type: 'test',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      const queryBuilder = createMockQueryBuilder(mockUpdatedEngagement);
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await communityPulseService.updateEngagement('eng-1', {
        title: 'Updated Title',
        status: 'in_progress',
        currentStage: 2,
        learningGoal: 'New goal',
        goalType: 'test',
      });

      expect(queryBuilder.update).toHaveBeenCalledWith({
        title: 'Updated Title',
        status: 'in_progress',
        current_stage: 2,
        learning_goal: 'New goal',
        goal_type: 'test',
      });
      expect(result.title).toBe('Updated Title');
      expect(result.currentStage).toBe(2);
    });

    it('should handle partial updates', async () => {
      const mockEngagement = {
        id: 'eng-1',
        organization_id: 'org-1',
        created_by: 'user-1',
        title: 'Same Title',
        status: 'draft',
        current_stage: 3,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      const queryBuilder = createMockQueryBuilder(mockEngagement);
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      await communityPulseService.updateEngagement('eng-1', {
        currentStage: 3,
      });

      expect(queryBuilder.update).toHaveBeenCalledWith({
        current_stage: 3,
      });
    });
  });

  describe('archiveEngagement', () => {
    it('should set engagement status to archived', async () => {
      const queryBuilder = createMockQueryBuilder({ id: 'eng-1' });
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      await communityPulseService.archiveEngagement('eng-1');

      expect(queryBuilder.update).toHaveBeenCalledWith({ status: 'archived' });
      expect(queryBuilder.eq).toHaveBeenCalledWith('id', 'eng-1');
    });
  });

  describe('deleteEngagement', () => {
    it('should permanently delete an engagement', async () => {
      const queryBuilder = createMockQueryBuilder(null);
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      await communityPulseService.deleteEngagement('eng-1');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('community_pulse_engagements');
      expect(queryBuilder.delete).toHaveBeenCalled();
      expect(queryBuilder.eq).toHaveBeenCalledWith('id', 'eng-1');
    });
  });

  describe('getMethods', () => {
    it('should fetch all engagement methods', async () => {
      const mockMethods = [
        {
          id: 'method-1',
          name: 'Focus Groups',
          slug: 'focus-groups',
          category: 'qualitative',
          description: 'Facilitated group discussions',
          best_for: 'Exploring complex topics',
          group_size_min: 6,
          group_size_max: 12,
          duration_min: 60,
          duration_max: 120,
          cost_estimate_low: 500,
          cost_estimate_high: 2000,
          equity_considerations: ['Ensure diverse representation'],
          requirements: {},
          fit_scores: { explore: 5, test: 3, decide: 2 },
        },
      ];

      const queryBuilder = createMockQueryBuilder(mockMethods);
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await communityPulseService.getMethods();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('community_pulse_methods');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Focus Groups');
      expect(result[0].fitScores).toEqual({ explore: 5, test: 3, decide: 2 });
    });
  });

  describe('getMethodBySlug', () => {
    it('should fetch a method by slug', async () => {
      const mockMethod = {
        id: 'method-1',
        name: 'Community Surveys',
        slug: 'community-surveys',
        category: 'quantitative',
        description: 'Structured questionnaires',
        best_for: 'Gathering broad input',
        group_size_min: 50,
        group_size_max: 1000,
        duration_min: 10,
        duration_max: 30,
        cost_estimate_low: 100,
        cost_estimate_high: 5000,
        equity_considerations: [],
        requirements: {},
        fit_scores: { explore: 2, test: 4, decide: 5 },
      };

      const queryBuilder = createMockQueryBuilder(mockMethod);
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await communityPulseService.getMethodBySlug('community-surveys');

      expect(queryBuilder.eq).toHaveBeenCalledWith('slug', 'community-surveys');
      expect(result?.name).toBe('Community Surveys');
    });

    it('should return null for non-existent method', async () => {
      const queryBuilder = createMockQueryBuilder(null, { code: 'PGRST116', message: 'Not found' });
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await communityPulseService.getMethodBySlug('invalid-slug');

      expect(result).toBeNull();
    });
  });

  describe('getMaterials', () => {
    it('should fetch materials for an engagement', async () => {
      const mockMaterials = [
        {
          id: 'mat-1',
          engagement_id: 'eng-1',
          material_type: 'facilitator_guide',
          title: 'Session Guide',
          content: '# Guide content',
          file_url: null,
          version: 1,
          is_customized: false,
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      const queryBuilder = createMockQueryBuilder(mockMaterials);
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await communityPulseService.getMaterials('eng-1');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('community_pulse_materials');
      expect(queryBuilder.eq).toHaveBeenCalledWith('engagement_id', 'eng-1');
      expect(result).toHaveLength(1);
      expect(result[0].materialType).toBe('facilitator_guide');
    });
  });

  describe('saveMaterial', () => {
    it('should save a new material', async () => {
      const mockSavedMaterial = {
        id: 'mat-new',
        engagement_id: 'eng-1',
        material_type: 'consent_form',
        title: 'Consent Document',
        content: 'Consent content here',
        file_url: null,
        version: 1,
        is_customized: false,
        created_at: '2024-01-01T00:00:00Z',
      };

      const queryBuilder = createMockQueryBuilder(mockSavedMaterial);
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      const result = await communityPulseService.saveMaterial(
        'eng-1',
        'consent_form',
        'Consent Document',
        'Consent content here'
      );

      expect(queryBuilder.insert).toHaveBeenCalledWith({
        engagement_id: 'eng-1',
        material_type: 'consent_form',
        title: 'Consent Document',
        content: 'Consent content here',
        file_url: undefined,
      });
      expect(result.materialType).toBe('consent_form');
    });
  });
});

describe('Data Transformation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should correctly transform database row to Engagement type', async () => {
    const dbRow = {
      id: 'eng-1',
      organization_id: 'org-1',
      created_by: 'user-1',
      title: 'Full Engagement',
      status: 'in_progress',
      current_stage: 4,
      learning_goal: 'Learn about community needs',
      goal_type: 'explore',
      target_population: 'Youth ages 16-24',
      estimated_participants: 50,
      demographics: { languages: ['en', 'es'] },
      relationship_history: 'New relationship',
      accessibility_needs: { transportation: true },
      cultural_considerations: 'Be mindful of cultural events',
      primary_method: 'focus-groups',
      secondary_methods: ['surveys'],
      method_rationale: 'Best for exploration',
      ai_recommendations: { score: 0.85 },
      participation_model: 'collaborative',
      recruitment_plan: 'Partner with schools',
      facilitation_plan: { steps: [] },
      questions: [{ id: 'q1', type: 'core', question: 'Tell us about...' }],
      equity_checklist: { safety: { physicalSafety: true } },
      risk_assessment: { level: 'low' },
      generated_materials: [],
      timeline: { phases: [] },
      budget_estimate: 5000,
      start_date: '2024-02-01',
      end_date: '2024-03-01',
      exported_to: ['visionflow'],
      exported_at: '2024-03-02T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    };

    const queryBuilder = createMockQueryBuilder(dbRow);
    mockSupabaseClient.from.mockReturnValue(queryBuilder);

    const result = await communityPulseService.getEngagement('eng-1');

    expect(result).toMatchObject({
      id: 'eng-1',
      organizationId: 'org-1',
      createdBy: 'user-1',
      title: 'Full Engagement',
      status: 'in_progress',
      currentStage: 4,
      learningGoal: 'Learn about community needs',
      goalType: 'explore',
      targetPopulation: 'Youth ages 16-24',
      estimatedParticipants: 50,
      primaryMethod: 'focus-groups',
      participationModel: 'collaborative',
      budgetEstimate: 5000,
    });
  });
});
