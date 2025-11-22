/**
 * Domain Components
 * 
 * Domain-specific components for the VISION platform
 */

// Assessment
export * from './assessment/AssessmentSection';
export * from './assessment/AssessmentQuestionBlock';
export * from './assessment/AssessmentProgressSidebar';

// Logic Model
export { LogicCanvas } from './logic/LogicCanvas';
export type { LogicCanvasProps, LogicNode as LogicCanvasNode } from './logic/LogicCanvas';
export { LogicNode } from './logic/LogicNode';
export type { LogicNodeProps } from './logic/LogicNode';
export * from './logic/Connector';
export * from './logic/NodePalette';
export * from './logic/CanvasToolbar';

// Stakeholder Mapping
export * from './stakeholders/StakeholderMapCanvas';
export * from './stakeholders/StakeholderBubble';
export * from './stakeholders/StakeholderLegend';
export * from './stakeholders/StakeholderFilters';

// Document & Grant Writing
export * from './document/DocumentEditorShell';
export * from './document/SectionSummaryPanel';
export * from './document/AISuggestionPanel';
export * from './document/WordCountIndicator';
export * from './document/TemplateSelector';

// Budget & Financial
export * from './budget/BudgetBuilder';
export * from './budget/BudgetLineItemRow';
export * from './budget/BudgetSummaryPanel';
export * from './budget/IndirectCostCalculator';

// Compliance & Reporting
export * from './compliance/RequirementChecklist';
export * from './compliance/DeadlineList';
export * from './compliance/DocumentVaultList';

// Impact & Analytics
export * from './impact/OutcomeProgressChart';
export * from './impact/FundingSourcesPieChart';
export * from './impact/KpiSparkline';

// Org & User
export * from './org/OrgSwitcher';
export * from './org/UserMenu';

