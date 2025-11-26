import type React from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  Calculator,
  Coins,
  Database,
  Gauge,
  Grid3x3,
  Handshake,
  LayoutGrid,
  Map,
  Megaphone,
  PenTool,
  PencilLine,
  PieChart,
  Rocket,
  Scale,
  Sparkles,
  Workflow,
  Users,
} from 'lucide-react';
import { modulePalette, type ModuleKey } from '@/lib/vision-theme';

export type AppModuleKey = ModuleKey;
export type AppCategory =
  | 'Capacity Building'
  | 'Program Management'
  | 'Fundraising'
  | 'Impact Measurement';

export type AppStatus = 'active' | 'coming-soon' | 'available' | 'beta';
export type AppAudience = 'funder' | 'organization' | 'consultant' | 'multi';

export interface AppDefinition {
  id: string;
  slug: string;
  name: string;
  moduleKey: AppModuleKey;
  moduleLabel: string;
  primaryCategory: AppCategory;
  categories: AppCategory[];
  shortDescription: string;
  icon?: React.ElementType;
  status?: AppStatus;
  isPopular?: boolean;
  isNew?: boolean;
  launchPath?: string;
  onboardingPath?: string;
  audience?: AppAudience;
  transformationArea?: string;
  lastUsed?: Date;
  popularity?: number;
  phase?: string;
  priceLabel?: string;
}

export const APP_MODULES: { key: AppModuleKey; label: string }[] = [
  { key: 'voice', label: modulePalette.voice.label },
  { key: 'inspire', label: modulePalette.inspire.label },
  { key: 'strategize', label: modulePalette.strategize.label },
  { key: 'initiate', label: modulePalette.initiate.label },
  { key: 'operate', label: modulePalette.operate.label },
  { key: 'narrate', label: modulePalette.narrate.label },
];

export const APP_CATEGORIES: AppCategory[] = [
  'Capacity Building',
  'Program Management',
  'Fundraising',
  'Impact Measurement',
];

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000);

const APP_REGISTRY: AppDefinition[] = [
  {
    id: 'community-compass',
    slug: 'community-compass',
    name: 'Community Compass',
    icon: Map,
    moduleKey: 'voice',
    moduleLabel: modulePalette.voice.label,
    primaryCategory: 'Capacity Building',
    categories: ['Capacity Building'],
    shortDescription:
      'Gather community voice through surveys, listening tools, and needs/assets analysis.',
    status: 'active',
    isPopular: true,
    audience: 'organization',
    transformationArea: 'Community listening',
    launchPath: '/community-compass',
    lastUsed: hoursAgo(6),
    popularity: 90,
  },
  {
    id: 'stakeholdr',
    slug: 'stakeholdr',
    name: 'Stakeholdr',
    icon: Handshake,
    moduleKey: 'voice',
    moduleLabel: modulePalette.voice.label,
    primaryCategory: 'Capacity Building',
    categories: ['Capacity Building'],
    shortDescription:
      'Map stakeholders, power, and influence to design smarter engagement and partnership strategies.',
    status: 'active',
    isNew: true,
    audience: 'consultant',
    transformationArea: 'Stakeholder strategy',
    lastUsed: hoursAgo(22),
    popularity: 78,
  },
  {
    id: 'visionverse',
    slug: 'visionverse',
    name: 'VisionVerse',
    icon: Sparkles,
    moduleKey: 'inspire',
    moduleLabel: modulePalette.inspire.label,
    primaryCategory: 'Capacity Building',
    categories: ['Capacity Building', 'Program Management'],
    shortDescription:
      'Co-create clear mission, vision, and values that align your organization and community.',
    status: 'active',
    isPopular: true,
    audience: 'organization',
    transformationArea: 'Identity & alignment',
    lastUsed: hoursAgo(3),
    popularity: 96,
  },
  {
    id: 'thinkgrid',
    slug: 'thinkgrid',
    name: 'ThinkGrid',
    icon: LayoutGrid,
    moduleKey: 'inspire',
    moduleLabel: modulePalette.inspire.label,
    primaryCategory: 'Program Management',
    categories: ['Program Management', 'Capacity Building'],
    shortDescription:
      'Generate, refine, and compare new program ideas with structured concept testing and AI support.',
    status: 'active',
    audience: 'multi',
    transformationArea: 'Innovation design',
    lastUsed: hoursAgo(30),
    popularity: 82,
  },
  {
    id: 'pathwaypro',
    slug: 'pathwaypro',
    name: 'PathwayPro',
    icon: Workflow,
    moduleKey: 'strategize',
    moduleLabel: modulePalette.strategize.label,
    primaryCategory: 'Program Management',
    categories: ['Program Management'],
    shortDescription:
      'Turn ideas into logic models, theories of change, and evidence-backed impact pathways.',
    status: 'active',
    audience: 'multi',
    transformationArea: 'Program design',
    lastUsed: hoursAgo(14),
    popularity: 88,
  },
  {
    id: 'architex',
    slug: 'architex',
    name: 'Architex',
    icon: PenTool,
    moduleKey: 'strategize',
    moduleLabel: modulePalette.strategize.label,
    primaryCategory: 'Program Management',
    categories: ['Program Management', 'Capacity Building'],
    shortDescription:
      'Design program architecture, service models, and workflows that are ready to implement.',
    status: 'active',
    audience: 'organization',
    transformationArea: 'Service models',
    lastUsed: hoursAgo(40),
    popularity: 81,
  },
  {
    id: 'equiframe',
    slug: 'equiframe',
    name: 'EquiFrame',
    icon: Scale,
    moduleKey: 'strategize',
    moduleLabel: modulePalette.strategize.label,
    primaryCategory: 'Capacity Building',
    categories: ['Capacity Building', 'Program Management'],
    shortDescription:
      'Evaluate equity impacts and embed justice-centered practices across programs and strategies.',
    status: 'active',
    audience: 'organization',
    transformationArea: 'Equity strategy',
    lastUsed: hoursAgo(52),
    popularity: 76,
  },
  {
    id: 'fundflo',
    slug: 'fundflo',
    name: 'FundFlo',
    icon: Coins,
    moduleKey: 'strategize',
    moduleLabel: modulePalette.strategize.label,
    primaryCategory: 'Fundraising',
    categories: ['Fundraising', 'Program Management'],
    shortDescription:
      'Design diversified revenue models and sustainability plans tied to your programs and portfolio.',
    status: 'active',
    isPopular: true,
    audience: 'multi',
    transformationArea: 'Revenue strategy',
    lastUsed: hoursAgo(10),
    popularity: 93,
  },
  {
    id: 'launchpath',
    slug: 'launchpath',
    name: 'LaunchPath',
    icon: Rocket,
    moduleKey: 'initiate',
    moduleLabel: modulePalette.initiate.label,
    primaryCategory: 'Program Management',
    categories: ['Program Management'],
    shortDescription:
      'Translate strategy into 90-day implementation plans, milestones, and accountable owners.',
    status: 'active',
    audience: 'organization',
    transformationArea: 'Implementation',
    lastUsed: hoursAgo(5),
    popularity: 89,
  },
  {
    id: 'fundgrid',
    slug: 'fundgrid',
    name: 'FundGrid',
    icon: Calculator,
    moduleKey: 'initiate',
    moduleLabel: modulePalette.initiate.label,
    primaryCategory: 'Fundraising',
    categories: ['Fundraising', 'Program Management'],
    shortDescription:
      'Build outcome-based budgets, scenarios, and grant-ready financial plans.',
    status: 'active',
    isNew: true,
    audience: 'multi',
    transformationArea: 'Financial planning',
    lastUsed: hoursAgo(26),
    popularity: 74,
  },
  {
    id: 'ops360',
    slug: 'ops360',
    name: 'Ops360',
    icon: Activity,
    moduleKey: 'operate',
    moduleLabel: modulePalette.operate.label,
    primaryCategory: 'Program Management',
    categories: ['Program Management'],
    shortDescription:
      'Coordinate tasks, projects, and workflows to keep day-to-day execution on track.',
    status: 'active',
    isPopular: true,
    audience: 'organization',
    transformationArea: 'Delivery rhythm',
    lastUsed: hoursAgo(1.5),
    popularity: 97,
  },
  {
    id: 'metricmap',
    slug: 'metricmap',
    name: 'MetricMap',
    icon: BarChart3,
    moduleKey: 'operate',
    moduleLabel: modulePalette.operate.label,
    primaryCategory: 'Impact Measurement',
    categories: ['Impact Measurement', 'Program Management'],
    shortDescription:
      'Define KPIs, track outcomes, and visualize performance with connected dashboards.',
    status: 'active',
    audience: 'organization',
    transformationArea: 'Performance visibility',
    lastUsed: hoursAgo(9),
    popularity: 91,
  },
  {
    id: 'capacityiq',
    slug: 'capacityiq',
    name: 'CapacityIQ',
    icon: Gauge,
    moduleKey: 'operate',
    moduleLabel: modulePalette.operate.label,
    primaryCategory: 'Capacity Building',
    categories: ['Capacity Building'],
    shortDescription:
      'Assess organizational capacity, benchmark key functions, and identify priority areas for growth.',
    status: 'active',
    audience: 'multi',
    transformationArea: 'Capacity assessment',
    lastUsed: hoursAgo(15),
    popularity: 86,
  },
  {
    id: 'crm',
    slug: 'crm',
    name: 'CRM',
    icon: Users,
    moduleKey: 'operate',
    moduleLabel: modulePalette.operate.label,
    primaryCategory: 'Fundraising',
    categories: ['Fundraising', 'Program Management'],
    shortDescription:
      'Manage donors, partners, and contacts in a nonprofit-focused relationship hub.',
    status: 'active',
    audience: 'organization',
    transformationArea: 'Relationship management',
    lastUsed: hoursAgo(4),
    popularity: 84,
  },
  {
    id: 'orgdb',
    slug: 'orgdb',
    name: 'OrgDB',
    icon: Database,
    moduleKey: 'operate',
    moduleLabel: modulePalette.operate.label,
    primaryCategory: 'Program Management',
    categories: ['Program Management', 'Impact Measurement'],
    shortDescription:
      'Maintain a single structured record of programs, sites, participants, and entities.',
    status: 'active',
    audience: 'organization',
    transformationArea: 'Data operations',
    lastUsed: hoursAgo(42),
    popularity: 72,
  },
  {
    id: 'narrateiq',
    slug: 'narrateiq',
    name: 'NarrateIQ',
    icon: BookOpen,
    moduleKey: 'narrate',
    moduleLabel: modulePalette.narrate.label,
    primaryCategory: 'Impact Measurement',
    categories: ['Impact Measurement', 'Fundraising'],
    shortDescription:
      'Turn data, quotes, and media into compelling impact stories and reports.',
    status: 'active',
    isPopular: true,
    audience: 'multi',
    transformationArea: 'Reporting',
    lastUsed: hoursAgo(7),
    popularity: 92,
  },
  {
    id: 'fundingframer',
    slug: 'fundingframer',
    name: 'FundingFramer',
    icon: PencilLine,
    moduleKey: 'narrate',
    moduleLabel: modulePalette.narrate.label,
    primaryCategory: 'Fundraising',
    categories: ['Fundraising'],
    shortDescription:
      'Draft complete, aligned grant proposals using data and strategy from across the platform.',
    status: 'active',
    audience: 'multi',
    transformationArea: 'Grant writing',
    lastUsed: hoursAgo(20),
    popularity: 83,
  },
  {
    id: 'funder-portfolio-manager',
    slug: 'funder-portfolio-manager',
    name: 'Funder Portfolio Manager',
    icon: PieChart,
    moduleKey: 'operate',
    moduleLabel: modulePalette.operate.label,
    primaryCategory: 'Impact Measurement',
    categories: ['Impact Measurement', 'Capacity Building'],
    shortDescription:
      'Give funders portfolio-wide visibility, capacity scores, and cross-grantee analytics.',
    status: 'coming-soon',
    audience: 'funder',
    transformationArea: 'Portfolio analytics',
    lastUsed: undefined,
    popularity: 65,
  },
] as const;

export const VISION_APPS: AppDefinition[] = APP_REGISTRY.map((app) => ({
  ...app,
  phase: modulePalette[app.moduleKey].label,
}));

export const VISION_PHASES = APP_MODULES.map((module) => module.label);
export const VISION_APP_AUDIENCES: AppAudience[] = ['funder', 'organization', 'consultant', 'multi'];

export const getAppBySlug = (slug: string) =>
  VISION_APPS.find((app) => app.slug === slug);
