// CommunityPulse Types

export type EngagementStatus = 'draft' | 'in_progress' | 'completed' | 'exported' | 'archived';
export type GoalType = 'explore' | 'test' | 'decide';
export type ParticipationModel = 'informational' | 'consultative' | 'collaborative' | 'community_controlled';
export type MaterialType =
  | 'facilitator_guide'
  | 'consent_form'
  | 'question_protocol'
  | 'participant_materials'
  | 'recruitment_flyer'
  | 'note_template'
  | 'follow_up_template'
  | 'timeline'
  | 'budget';

export type MethodCategory = 'discussion' | 'survey' | 'workshop' | 'creative' | 'observation' | 'digital';

export interface EngagementMethod {
  id: string;
  name: string;
  slug: string;
  category: MethodCategory;
  description: string;
  bestFor: string;
  groupSizeMin: number;
  groupSizeMax: number;
  durationMin: number;
  durationMax: number;
  costEstimateLow: number;
  costEstimateHigh: number;
  equityConsiderations: string[];
  requirements: Record<string, unknown>;
  fitScores: {
    explore: number;
    test: number;
    decide: number;
  };
}

export interface Demographics {
  languages?: string[];
  ageRanges?: string[];
  geographicDistribution?: string;
  digitalAccess?: string;
}

export interface AccessibilityNeeds {
  transportation?: boolean;
  childcare?: boolean;
  interpretation?: string[];
  physicalAccess?: boolean;
  scheduling?: string;
}

export interface EquityChecklist {
  safety?: {
    physicalSafety?: boolean;
    emotionalSafety?: boolean;
    distressProtocol?: boolean;
  };
  trustworthiness?: {
    purposeExplained?: boolean;
    useOfInputCommunicated?: boolean;
    actionPromises?: boolean;
  };
  accessibility?: {
    languageAccess?: boolean;
    physicalAccess?: boolean;
    schedulingOptions?: boolean;
    compensation?: boolean;
  };
  powerDynamics?: {
    coFacilitators?: boolean;
    dominanceManagement?: boolean;
    anonymousOptions?: boolean;
  };
  communityBenefit?: {
    directBenefit?: boolean;
    findingsShared?: boolean;
    informedConsent?: boolean;
  };
}

export interface Question {
  id: string;
  type: 'opening' | 'core' | 'closing';
  question: string;
  purpose?: string;
  probes?: string[];
  estimatedTime?: number;
  equityNote?: string;
}

export interface TimelinePhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  tasks: TimelineTask[];
}

export interface TimelineTask {
  id: string;
  title: string;
  assignee?: string;
  dueDate: string;
  completed: boolean;
}

export interface GeneratedMaterial {
  id: string;
  type: MaterialType;
  title: string;
  url?: string;
  generatedAt: string;
}

export interface Engagement {
  id: string;
  organizationId: string;
  createdBy: string;
  title: string;
  status: EngagementStatus;
  currentStage: number;

  // Stage 1
  learningGoal?: string;
  goalType?: GoalType;

  // Stage 2
  targetPopulation?: string;
  estimatedParticipants?: number;
  demographics?: Demographics;
  relationshipHistory?: string;
  accessibilityNeeds?: AccessibilityNeeds;
  culturalConsiderations?: string;

  // Stage 3
  primaryMethod?: string;
  secondaryMethods?: string[];
  methodRationale?: string;
  aiRecommendations?: MethodRecommendation[];

  // Stage 4
  participationModel?: ParticipationModel;
  recruitmentPlan?: string;
  facilitationPlan?: Record<string, unknown>;
  questions?: Question[];
  equityChecklist?: EquityChecklist;
  riskAssessment?: Record<string, unknown>;

  // Stage 5
  generatedMaterials?: GeneratedMaterial[];

  // Stage 6
  timeline?: TimelinePhase[];
  budgetEstimate?: number;
  startDate?: string;
  endDate?: string;

  // Stage 7
  exportedTo?: string[];
  exportedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface MethodRecommendation {
  method: string;
  fitScore: number;
  rationale: string;
  considerations: string;
  timeline: string;
  budgetRange: string;
  equityNotes: string;
}

export interface EngagementTemplate {
  id: string;
  organizationId?: string;
  createdBy?: string;
  name: string;
  description?: string;
  methodSlug?: string;
  templateData: Partial<Engagement>;
  isPublic: boolean;
  useCount: number;
  createdAt: string;
}

export interface Material {
  id: string;
  engagementId: string;
  materialType: MaterialType;
  title: string;
  content?: string;
  fileUrl?: string;
  version: number;
  isCustomized: boolean;
  createdAt: string;
}

// Stage names for UI
export const STAGE_NAMES = [
  'Learning Goal',
  'Community Context',
  'Method Selection',
  'Strategy Design',
  'Materials',
  'Timeline',
  'Export'
] as const;

export const STAGE_DESCRIPTIONS = [
  'Define what you want to learn',
  'Understand your community',
  'Select engagement methods',
  'Design your strategy',
  'Generate materials',
  'Build your timeline',
  'Export and launch'
] as const;
