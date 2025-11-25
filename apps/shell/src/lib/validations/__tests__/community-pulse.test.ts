/**
 * CommunityPulse Validation Schema Tests
 * Unit tests for Zod validation schemas
 */

import { describe, it, expect } from 'vitest';
import {
  createEngagementSchema,
  updateStage1Schema,
  updateStage2Schema,
  updateStage3Schema,
  updateStage4Schema,
  updateStage5Schema,
  updateStage6Schema,
  goalTypeSchema,
  participationModelSchema,
  equityChecklistSchema,
} from '../community-pulse';

describe('goalTypeSchema', () => {
  it('should accept valid goal types', () => {
    expect(goalTypeSchema.safeParse('explore').success).toBe(true);
    expect(goalTypeSchema.safeParse('test').success).toBe(true);
    expect(goalTypeSchema.safeParse('decide').success).toBe(true);
  });

  it('should reject invalid goal types', () => {
    expect(goalTypeSchema.safeParse('invalid').success).toBe(false);
    expect(goalTypeSchema.safeParse('').success).toBe(false);
    expect(goalTypeSchema.safeParse(null).success).toBe(false);
  });
});

describe('participationModelSchema', () => {
  it('should accept valid participation models', () => {
    expect(participationModelSchema.safeParse('informational').success).toBe(true);
    expect(participationModelSchema.safeParse('consultative').success).toBe(true);
    expect(participationModelSchema.safeParse('collaborative').success).toBe(true);
    expect(participationModelSchema.safeParse('community_controlled').success).toBe(true);
  });

  it('should reject invalid participation models', () => {
    expect(participationModelSchema.safeParse('advisory').success).toBe(false);
    expect(participationModelSchema.safeParse('').success).toBe(false);
  });
});

describe('createEngagementSchema', () => {
  it('should validate valid engagement creation', () => {
    const validData = {
      title: 'Community Feedback Session',
      learningGoal: 'Understand resident concerns',
      goalType: 'explore',
    };

    const result = createEngagementSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should require title', () => {
    const result = createEngagementSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('title'))).toBe(true);
    }
  });

  it('should reject empty title', () => {
    const result = createEngagementSchema.safeParse({ title: '' });
    expect(result.success).toBe(false);
  });

  it('should enforce max title length', () => {
    const longTitle = 'a'.repeat(201);
    const result = createEngagementSchema.safeParse({ title: longTitle });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('200');
    }
  });

  it('should allow optional fields to be omitted', () => {
    const result = createEngagementSchema.safeParse({ title: 'Just a title' });
    expect(result.success).toBe(true);
  });
});

describe('updateStage1Schema', () => {
  it('should validate stage 1 updates', () => {
    const validData = {
      title: 'Updated Title',
      learningGoal: 'We want to understand how residents experience...',
      goalType: 'explore' as const,
    };

    const result = updateStage1Schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should enforce learning goal max length', () => {
    const longGoal = 'a'.repeat(2001);
    const result = updateStage1Schema.safeParse({
      title: 'Title',
      learningGoal: longGoal,
    });
    expect(result.success).toBe(false);
  });
});

describe('updateStage2Schema', () => {
  it('should validate stage 2 updates', () => {
    const validData = {
      targetPopulation: 'Youth ages 16-24 in downtown area',
      estimatedParticipants: 50,
      demographics: {
        languages: ['en', 'es'],
        ageRanges: ['16-18', '19-24'],
      },
      relationshipHistory: 'First engagement with this community',
      accessibilityNeeds: {
        transportation: true,
        childcare: false,
      },
      culturalConsiderations: 'Respect religious observances',
    };

    const result = updateStage2Schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should enforce participant count bounds', () => {
    const tooFew = updateStage2Schema.safeParse({ estimatedParticipants: 0 });
    expect(tooFew.success).toBe(false);

    const tooMany = updateStage2Schema.safeParse({ estimatedParticipants: 100001 });
    expect(tooMany.success).toBe(false);

    const valid = updateStage2Schema.safeParse({ estimatedParticipants: 100 });
    expect(valid.success).toBe(true);
  });

  it('should allow partial updates', () => {
    const partial = { targetPopulation: 'Seniors in Oak Park' };
    const result = updateStage2Schema.safeParse(partial);
    expect(result.success).toBe(true);
  });
});

describe('updateStage3Schema', () => {
  it('should require primary method', () => {
    const noMethod = updateStage3Schema.safeParse({});
    expect(noMethod.success).toBe(false);

    const emptyMethod = updateStage3Schema.safeParse({ primaryMethod: '' });
    expect(emptyMethod.success).toBe(false);
  });

  it('should validate complete stage 3 data', () => {
    const validData = {
      primaryMethod: 'focus-groups',
      secondaryMethods: ['surveys', 'interviews'],
      methodRationale: 'Focus groups allow for deep discussion',
    };

    const result = updateStage3Schema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe('updateStage4Schema', () => {
  it('should validate participation model', () => {
    const validData = {
      participationModel: 'collaborative' as const,
      recruitmentPlan: 'Partner with community organizations',
    };

    const result = updateStage4Schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate equity checklist structure', () => {
    const withChecklist = {
      participationModel: 'consultative' as const,
      equityChecklist: {
        safety: {
          physicalSafety: true,
          emotionalSafety: true,
        },
        trustworthiness: {
          purposeExplained: true,
        },
        accessibility: {
          languageAccess: true,
          compensation: true,
        },
        powerDynamics: {
          dominanceManagement: true,
        },
        communityBenefit: {
          findingsShared: true,
          informedConsent: true,
        },
      },
    };

    const result = updateStage4Schema.safeParse(withChecklist);
    expect(result.success).toBe(true);
  });
});

describe('updateStage5Schema', () => {
  it('should validate generated materials', () => {
    const validData = {
      generatedMaterials: [
        {
          id: 'mat-1',
          type: 'facilitator_guide' as const,
          title: 'Session Guide',
          generatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'mat-2',
          type: 'consent_form' as const,
          title: 'Consent Form',
          url: 'https://example.com/consent.pdf',
          generatedAt: '2024-01-01T00:00:00Z',
        },
      ],
    };

    const result = updateStage5Schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid material types', () => {
    const invalidData = {
      generatedMaterials: [
        {
          id: 'mat-1',
          type: 'invalid_type',
          title: 'Invalid',
          generatedAt: '2024-01-01T00:00:00Z',
        },
      ],
    };

    const result = updateStage5Schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('updateStage6Schema', () => {
  it('should validate timeline data', () => {
    const validData = {
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      budgetEstimate: 5000,
    };

    const result = updateStage6Schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should enforce budget bounds', () => {
    const negativeBudget = updateStage6Schema.safeParse({ budgetEstimate: -100 });
    expect(negativeBudget.success).toBe(false);

    const hugeBudget = updateStage6Schema.safeParse({ budgetEstimate: 10000001 });
    expect(hugeBudget.success).toBe(false);

    const zeroBudget = updateStage6Schema.safeParse({ budgetEstimate: 0 });
    expect(zeroBudget.success).toBe(true);
  });
});

describe('equityChecklistSchema', () => {
  it('should validate complete equity checklist', () => {
    const fullChecklist = {
      safety: {
        physicalSafety: true,
        emotionalSafety: true,
        distressProtocol: false,
      },
      trustworthiness: {
        purposeExplained: true,
        useOfInputCommunicated: true,
        actionPromises: false,
      },
      accessibility: {
        languageAccess: true,
        physicalAccess: true,
        schedulingOptions: true,
        compensation: true,
      },
      powerDynamics: {
        coFacilitators: false,
        dominanceManagement: true,
        anonymousOptions: false,
      },
      communityBenefit: {
        directBenefit: true,
        findingsShared: true,
        informedConsent: true,
      },
    };

    const result = equityChecklistSchema.safeParse(fullChecklist);
    expect(result.success).toBe(true);
  });

  it('should allow partial checklist', () => {
    const partial = {
      safety: { physicalSafety: true },
    };

    const result = equityChecklistSchema.safeParse(partial);
    expect(result.success).toBe(true);
  });

  it('should allow empty checklist', () => {
    const result = equityChecklistSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
