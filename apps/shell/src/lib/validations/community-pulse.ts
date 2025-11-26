/**
 * CommunityPulse Validation Schemas
 * Zod schemas for form validation and API request/response
 */

import { z } from 'zod';

// Enums
export const goalTypeSchema = z.enum(['explore', 'test', 'decide']);
export const participationModelSchema = z.enum([
  'informational',
  'consultative',
  'collaborative',
  'community_controlled',
]);
export const engagementStatusSchema = z.enum([
  'draft',
  'in_progress',
  'completed',
  'exported',
  'archived',
]);
export const materialTypeSchema = z.enum([
  'facilitator_guide',
  'consent_form',
  'question_protocol',
  'participant_materials',
  'recruitment_flyer',
  'note_template',
  'follow_up_template',
  'timeline',
  'budget',
]);

// Demographics
export const demographicsSchema = z.object({
  languages: z.array(z.string()).optional(),
  ageRanges: z.array(z.string()).optional(),
  geographicDistribution: z.string().optional(),
  digitalAccess: z.string().optional(),
});

// Accessibility Needs
export const accessibilityNeedsSchema = z.object({
  transportation: z.boolean().optional(),
  childcare: z.boolean().optional(),
  interpretation: z.array(z.string()).optional(),
  physicalAccess: z.boolean().optional(),
  scheduling: z.string().optional(),
});

// Equity Checklist
export const equityChecklistSchema = z.object({
  safety: z
    .object({
      physicalSafety: z.boolean().optional(),
      emotionalSafety: z.boolean().optional(),
      distressProtocol: z.boolean().optional(),
    })
    .optional(),
  trustworthiness: z
    .object({
      purposeExplained: z.boolean().optional(),
      useOfInputCommunicated: z.boolean().optional(),
      actionPromises: z.boolean().optional(),
    })
    .optional(),
  accessibility: z
    .object({
      languageAccess: z.boolean().optional(),
      physicalAccess: z.boolean().optional(),
      schedulingOptions: z.boolean().optional(),
      compensation: z.boolean().optional(),
    })
    .optional(),
  powerDynamics: z
    .object({
      coFacilitators: z.boolean().optional(),
      dominanceManagement: z.boolean().optional(),
      anonymousOptions: z.boolean().optional(),
    })
    .optional(),
  communityBenefit: z
    .object({
      directBenefit: z.boolean().optional(),
      findingsShared: z.boolean().optional(),
      informedConsent: z.boolean().optional(),
    })
    .optional(),
});

// Question
export const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['opening', 'core', 'closing']),
  question: z.string().min(1, 'Question is required'),
  purpose: z.string().optional(),
  probes: z.array(z.string()).optional(),
  estimatedTime: z.number().optional(),
  equityNote: z.string().optional(),
});

// Create Engagement
export const createEngagementSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  learningGoal: z.string().max(2000).optional(),
  goalType: goalTypeSchema.optional(),
});

// Update Engagement - Stage 1
export const updateStage1Schema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  learningGoal: z.string().max(2000).optional(),
  goalType: goalTypeSchema.optional(),
});

// Update Engagement - Stage 2
export const updateStage2Schema = z.object({
  targetPopulation: z.string().max(1000).optional(),
  estimatedParticipants: z.number().min(1).max(100000).optional(),
  demographics: demographicsSchema.optional(),
  relationshipHistory: z.string().max(2000).optional(),
  accessibilityNeeds: accessibilityNeedsSchema.optional(),
  culturalConsiderations: z.string().max(2000).optional(),
});

// Update Engagement - Stage 3
export const updateStage3Schema = z.object({
  primaryMethod: z.string().min(1, 'Please select a method'),
  secondaryMethods: z.array(z.string()).optional(),
  methodRationale: z.string().max(2000).optional(),
});

// Update Engagement - Stage 4
export const updateStage4Schema = z.object({
  participationModel: participationModelSchema,
  recruitmentPlan: z.string().max(5000).optional(),
  facilitationPlan: z.record(z.unknown()).optional(),
  questions: z.array(questionSchema).optional(),
  equityChecklist: equityChecklistSchema.optional(),
  riskAssessment: z.record(z.unknown()).optional(),
});

// Update Engagement - Stage 5 (Materials)
export const updateStage5Schema = z.object({
  generatedMaterials: z
    .array(
      z.object({
        id: z.string(),
        type: materialTypeSchema,
        title: z.string(),
        url: z.string().optional(),
        generatedAt: z.string(),
      })
    )
    .optional(),
});

// Update Engagement - Stage 6 (Timeline)
export const updateStage6Schema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budgetEstimate: z.number().min(0).max(10000000).optional(),
  timeline: z.record(z.unknown()).optional(),
});

// Update Engagement - Stage 7 (Export)
export const updateStage7Schema = z.object({
  status: engagementStatusSchema.optional(),
  exportedTo: z.array(z.string()).optional(),
  exportedAt: z.string().optional(),
});

// Full engagement update (for generic updates)
export const updateEngagementSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: engagementStatusSchema.optional(),
  currentStage: z.number().min(1).max(7).optional(),
  learningGoal: z.string().max(2000).optional(),
  goalType: goalTypeSchema.optional(),
  targetPopulation: z.string().max(1000).optional(),
  estimatedParticipants: z.number().min(1).max(100000).optional(),
  demographics: demographicsSchema.optional(),
  relationshipHistory: z.string().max(2000).optional(),
  accessibilityNeeds: accessibilityNeedsSchema.optional(),
  culturalConsiderations: z.string().max(2000).optional(),
  primaryMethod: z.string().optional(),
  secondaryMethods: z.array(z.string()).optional(),
  methodRationale: z.string().max(2000).optional(),
  participationModel: participationModelSchema.optional(),
  recruitmentPlan: z.string().max(5000).optional(),
  facilitationPlan: z.record(z.unknown()).optional(),
  questions: z.array(questionSchema).optional(),
  equityChecklist: equityChecklistSchema.optional(),
  riskAssessment: z.record(z.unknown()).optional(),
  generatedMaterials: z.array(z.unknown()).optional(),
  timeline: z.record(z.unknown()).optional(),
  budgetEstimate: z.number().min(0).max(10000000).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  exportedTo: z.array(z.string()).optional(),
  exportedAt: z.string().optional(),
});

// Template schemas
export const createTemplateSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be less than 200 characters'),
  description: z.string().max(1000).optional(),
  methodSlug: z.string().optional(),
  templateData: z.record(z.unknown()),
  isPublic: z.boolean().default(false),
});

// Type exports
export type CreateEngagementInput = z.infer<typeof createEngagementSchema>;
export type UpdateEngagementInput = z.infer<typeof updateEngagementSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
