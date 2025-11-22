import type React from 'react';
import { App, AppStatus } from '@/components/dashboard/AppLauncher';
import {
  Activity,
  BarChart3,
  BookOpen,
  Calculator,
  Coins,
  Database,
  FileText,
  Gauge,
  Grid3x3,
  Handshake,
  LayoutGrid,
  Map,
  Megaphone,
  PencilLine,
  PieChart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';
import { VISION_APPS, type AppCategory } from './vision-apps';
import { formatDistanceToNow } from 'date-fns';
import type { UserRole } from './auth';

/**
 * Mock Data for VISION Platform Dashboard
 * Sample apps, notifications, and user data
 */

const visionStatusToAppStatus = (status?: App['status'] | 'beta'): AppStatus => {
  if (status === 'coming-soon') return 'coming-soon';
  if (status === 'restricted') return 'restricted';
  if (status === 'beta') return 'beta';
  if (status === 'available') return 'available';
  return 'active';
};

const badgeRotation = ['Popular', 'New', 'Essential'] as const;

const categorySlug = (category: AppCategory) => {
  switch (category) {
    case 'Capacity Building':
      return 'Capacity Building';
    case 'Program Management':
      return 'Program Management';
    case 'Fundraising':
      return 'Fundraising';
    case 'Impact Measurement':
      return 'Impact Measurement';
    default:
      return category;
  }
};

const fallbackIcons: Record<string, React.ElementType> = {
  thinkgrid: LayoutGrid,
  fundflo: Coins,
  launchpath: Rocket,
  fundgrid: Calculator,
  ops360: Activity,
  metricmap: BarChart3,
  orgdb: Database,
  narrateiq: BookOpen,
  'funder-portfolio-manager': PieChart,
};

export const mockApps: App[] = VISION_APPS.map((app, index) => {
  const mappedStatus = visionStatusToAppStatus(app.status as any);
  const icon = (app.icon || fallbackIcons[app.slug] || Grid3x3) as React.ComponentType<{
    size?: number | string;
  }>;
  const primaryCategory = categorySlug(app.primaryCategory);
  const lastUsed =
    mappedStatus === 'active'
      ? app.lastUsed || new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000)
      : undefined;
  const statusBadge =
    app.status === 'coming-soon'
      ? { label: 'Planned', variant: 'warning' as const }
      : undefined;
  const derivedBadge =
    app.isPopular ? { label: 'Popular', variant: 'success' as const } :
    app.isNew ? { label: 'New', variant: 'info' as const } :
    statusBadge;
  const fallbackBadge = badgeRotation[index % badgeRotation.length];
  const badgeVariant =
    derivedBadge?.variant ||
    (fallbackBadge === 'Popular'
      ? 'success'
      : fallbackBadge === 'New'
        ? 'info'
        : 'warning');

  return {
    id: app.slug,
    slug: app.slug,
    name: app.name,
    description: app.shortDescription,
    shortDescription: app.shortDescription,
    icon,
    status: mappedStatus,
    moduleKey: app.moduleKey,
    moduleLabel: app.moduleLabel,
    primaryCategory,
    categories: app.categories || [app.primaryCategory],
    launchPath: app.launchPath || `/apps/${app.slug}`,
    onboardingPath: app.onboardingPath,
    phase: app.moduleLabel,
    audience: app.audience,
    transformationArea: app.transformationArea || app.primaryCategory,
    isFavorite: index < 4,
    lastUsed,
    badge: derivedBadge?.label || fallbackBadge,
    badgeVariant: badgeVariant,
    popularity: app.popularity,
    isNew: app.isNew,
    isPopular: app.isPopular,
  };
});

export interface Notification {
  id: string;
  type: 'system' | 'organization' | 'application' | 'personal';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority?: 'high' | 'medium' | 'low';
  actionUrl?: string;
  actionLabel?: string;
  icon?: React.ElementType;
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'application',
    title: 'CapacityIQ assessment completed',
    message: 'Your organization capacity assessment is ready. View results and recommendations.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    priority: 'high',
    actionUrl: '/applications/capacityiq',
    actionLabel: 'View Results',
    icon: BarChart3,
  },
  {
    id: '2',
    type: 'organization',
    title: 'New team member invited',
    message: 'Michael Chen has been invited to join Hope Community Foundation.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: false,
    priority: 'medium',
    actionUrl: '/settings/team',
    actionLabel: 'View Team',
    icon: Users,
  },
  {
    id: '3',
    type: 'application',
    title: 'FundingFramer: Draft ready for review',
    message: 'Your grant application draft is ready for review and submission.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: false,
    priority: 'medium',
    actionUrl: '/applications/fundingframer',
    actionLabel: 'Review Draft',
    icon: PencilLine,
  },
  {
    id: '4',
    type: 'system',
    title: 'Platform maintenance scheduled',
    message: 'Scheduled maintenance this weekend from 2:00 AM - 4:00 AM EST.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    priority: 'low',
    icon: Wrench,
  },
  {
    id: '5',
    type: 'application',
    title: 'Campaign Builder: Campaign launched',
    message: 'Your fundraising campaign "Spring Appeal 2024" has been successfully launched.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
    priority: 'medium',
    actionUrl: '/applications/campaign-builder',
    actionLabel: 'View Campaign',
    icon: Megaphone,
  },
  {
    id: '6',
    type: 'personal',
    title: 'Profile update successful',
    message: 'Your profile information has been updated successfully.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    read: true,
    priority: 'low',
    icon: ShieldCheck,
  },
];

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  roleKey?: UserRole;
  organization: string;
}

export const mockUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@hopecommunity.org',
  avatar: undefined,
  role: 'Executive Director',
  roleKey: 'super_admin',
  organization: 'Hope Community Foundation',
};

export const mockOrganization = {
  name: 'Hope Community Foundation',
  memberCount: 8,
  activeAppsCount: 4,
  totalAppsCount: 16,
};

export const getRecentApps = (apps: App[], count: number = 4): App[] => {
  return apps
    .filter((app) => app.lastUsed)
    .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
    .slice(0, count);
};

export const getFavoriteApps = (apps: App[]): App[] => {
  return apps.filter((app) => app.isFavorite);
};

export const getActiveApps = (apps: App[]): App[] => {
  return apps.filter((app) => app.status === 'active');
};

export const getUnreadNotificationCount = (notifications: Notification[]): number => {
  return notifications.filter((n) => !n.read).length;
};

export const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
};

export interface DashboardDocument {
  id: string;
  name: string;
  updatedAt: Date;
  owner: string;
}

export const mockDocuments: DashboardDocument[] = [
  {
    id: 'plan-1',
    name: 'Strategic Plan Draft v2',
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    owner: 'Ava Thompson',
  },
  {
    id: 'proposal-ffa',
    name: 'FundingFramer Proposal - Youth Outreach',
    updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    owner: 'Jordan Lee',
  },
  {
    id: 'report-impact',
    name: 'Impact Pulse Q1 Report',
    updatedAt: new Date(Date.now() - 32 * 60 * 60 * 1000),
    owner: 'Sarah Johnson',
  },
  {
    id: 'deck-stake',
    name: 'Stakeholdr Journey Map',
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    owner: 'Taylor Kim',
  },
];

export const formatUpdated = (date: Date) =>
  `Updated ${formatDistanceToNow(date, { addSuffix: true })}`;

export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

export const mockTimezones: TimezoneOption[] = [
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)', offset: 'UTC-05:00' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)', offset: 'UTC-06:00' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)', offset: 'UTC-07:00' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)', offset: 'UTC-08:00' },
  { value: 'Europe/London', label: 'London', offset: 'UTC+00:00' },
  { value: 'Europe/Berlin', label: 'Berlin', offset: 'UTC+01:00' },
  { value: 'Asia/Kolkata', label: 'India Standard Time', offset: 'UTC+05:30' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time', offset: 'UTC+09:00' },
];

export interface OrganizationType {
  value: string;
  label: string;
  description?: string;
}

export const mockOrganizationTypes: OrganizationType[] = [
  { value: 'nonprofit', label: 'Nonprofit', description: '501(c)(3) and community orgs' },
  { value: 'foundation', label: 'Foundation', description: 'Private and public foundations' },
  { value: 'consultant', label: 'Consultant', description: 'Advisors supporting organizations' },
  { value: 'funder', label: 'Funder', description: 'Grantmakers and philanthropic teams' },
  { value: 'other', label: 'Other', description: 'Networks, coalitions, and more' },
];

export interface CountryOption {
  code: string;
  name: string;
}

export const mockCountries: CountryOption[] = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'IN', name: 'India' },
];

export type TeamRole = 'Owner' | 'Admin' | 'Editor' | 'Viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatar?: string;
  joinedAt: Date;
  status?: 'active' | 'invited' | 'inactive';
}

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@hopecommunity.org',
    role: 'Owner',
    joinedAt: new Date('2023-04-12'),
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  {
    id: 'tm-2',
    name: 'Michael Chen',
    email: 'michael.chen@hopecommunity.org',
    role: 'Admin',
    joinedAt: new Date('2023-07-02'),
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'tm-3',
    name: 'Ava Thompson',
    email: 'ava.thompson@hopecommunity.org',
    role: 'Editor',
    joinedAt: new Date('2024-01-18'),
    avatar: 'https://i.pravatar.cc/150?img=48',
  },
  {
    id: 'tm-4',
    name: 'Jordan Lee',
    email: 'jordan.lee@hopecommunity.org',
    role: 'Viewer',
    joinedAt: new Date('2024-02-05'),
    avatar: 'https://i.pravatar.cc/150?img=21',
  },
];

export interface PendingInvite {
  id: string;
  email: string;
  role: TeamRole;
  invitedAt: Date;
  status: 'pending' | 'accepted' | 'expired';
}

export const mockPendingInvites: PendingInvite[] = [
  {
    id: 'inv-1',
    email: 'dana.rivers@hopecommunity.org',
    role: 'Editor',
    invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
  {
    id: 'inv-2',
    email: 'leo.ramirez@hopecommunity.org',
    role: 'Viewer',
    invitedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
];

export interface BillingHistoryEntry {
  id: string;
  invoiceNumber: string;
  date: Date;
  amount: number;
  status: 'paid' | 'due';
  downloadUrl?: string;
}

export const mockBillingHistory: BillingHistoryEntry[] = [
  {
    id: 'inv-1001',
    invoiceNumber: 'INV-1001',
    date: new Date('2024-01-15'),
    amount: 249,
    status: 'paid',
    downloadUrl: '#',
  },
  {
    id: 'inv-1002',
    invoiceNumber: 'INV-1002',
    date: new Date('2024-02-15'),
    amount: 249,
    status: 'paid',
    downloadUrl: '#',
  },
  {
    id: 'inv-1003',
    invoiceNumber: 'INV-1003',
    date: new Date('2024-03-15'),
    amount: 249,
    status: 'due',
    downloadUrl: '#',
  },
];

export interface AIUsageBreakdown {
  appId: string;
  appName: string;
  tokens: number;
  cost: number;
  change?: number;
}

export interface AIUsageData {
  periodLabel: string;
  totalTokens: number;
  totalCost: number;
  monthOverMonth: number;
  byApp: AIUsageBreakdown[];
}

export const mockAIUsageData: AIUsageData = {
  periodLabel: 'Last 30 days',
  totalTokens: 1250000,
  totalCost: 183.4,
  monthOverMonth: -8,
  byApp: [
    { appId: 'capacityiq', appName: 'CapacityIQ', tokens: 420000, cost: 58.2, change: 6 },
    { appId: 'fundingframer', appName: 'FundingFramer', tokens: 360000, cost: 52.1, change: -4 },
    { appId: 'impact-pulse', appName: 'Impact Pulse', tokens: 240000, cost: 36.8, change: 2 },
    { appId: 'mission-vision-studio', appName: 'Mission Vision Studio', tokens: 130000, cost: 18.6 },
  ],
};

export interface Grantee {
  id: string;
  name: string;
  focusArea: string;
  status: 'on-track' | 'at-risk' | 'off-track';
  capacityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastCheckIn: Date;
  cohortId?: string;
}

export const mockGrantees: Grantee[] = [
  {
    id: 'gr-1',
    name: 'Hope Community Foundation',
    focusArea: 'Youth Empowerment',
    status: 'on-track',
    capacityScore: 86,
    riskLevel: 'low',
    lastCheckIn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    cohortId: 'cohort-1',
  },
  {
    id: 'gr-2',
    name: 'Bright Futures Initiative',
    focusArea: 'Education Access',
    status: 'at-risk',
    capacityScore: 62,
    riskLevel: 'medium',
    lastCheckIn: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    cohortId: 'cohort-2',
  },
  {
    id: 'gr-3',
    name: 'Green Horizon Alliance',
    focusArea: 'Climate Resilience',
    status: 'off-track',
    capacityScore: 48,
    riskLevel: 'high',
    lastCheckIn: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    cohortId: 'cohort-2',
  },
  {
    id: 'gr-4',
    name: 'Community Health Partners',
    focusArea: 'Health Equity',
    status: 'on-track',
    capacityScore: 79,
    riskLevel: 'low',
    lastCheckIn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    cohortId: 'cohort-3',
  },
];

export interface Cohort {
  id: string;
  name: string;
  createdAt: Date;
  memberCount: number;
  focus: string;
}

export const mockCohorts: Cohort[] = [
  {
    id: 'cohort-1',
    name: 'Innovation Lab 2024',
    createdAt: new Date('2024-02-01'),
    memberCount: 12,
    focus: 'Innovation pilots',
  },
  {
    id: 'cohort-2',
    name: 'Community Builders',
    createdAt: new Date('2023-11-15'),
    memberCount: 18,
    focus: 'Community engagement',
  },
  {
    id: 'cohort-3',
    name: 'Impact Measurement Guild',
    createdAt: new Date('2023-08-20'),
    memberCount: 9,
    focus: 'Measurement and reporting',
  },
];

export type SearchResultType = 'document' | 'app' | 'action';

export interface SearchResult {
  type: SearchResultType;
  title: string;
  category?: string;
  app?: string;
  url: string;
  badge?: string;
  description?: string;
  group?: string;
}

export const mockSearchResults: SearchResult[] = [
  {
    type: 'document',
    title: 'Grant Application 2024',
    category: 'Grant',
    app: 'FundingFramer',
    url: '/applications/fundingframer/documents/1',
    badge: 'Grant',
    group: 'Documents',
  },
  {
    type: 'document',
    title: 'Impact Report Q1',
    category: 'Impact',
    app: 'Impact Pulse',
    url: '/applications/impact-pulse/reports/q1',
    badge: 'Impact',
    group: 'Documents',
  },
  {
    type: 'app',
    title: 'CapacityIQ',
    category: 'Assessment',
    url: '/applications/capacityiq',
    badge: 'Popular',
    group: 'Applications',
  },
  {
    type: 'app',
    title: 'Stakeholdr',
    category: 'Stakeholders',
    url: '/applications/stakeholdr',
    badge: 'New',
    group: 'Applications',
  },
  {
    type: 'action',
    title: 'Create new proposal',
    category: 'Quick Action',
    url: '/applications/fundingframer/new',
    badge: 'Action',
    group: 'Quick Actions',
  },
  {
    type: 'action',
    title: 'Start new assessment',
    category: 'Quick Action',
    url: '/applications/capacityiq/create',
    badge: 'Action',
    group: 'Quick Actions',
  },
  {
    type: 'document',
    title: 'Board Update Deck',
    category: 'Presentation',
    app: 'Impact Narrator',
    url: '/applications/impact-narrator/decks/board-update',
    badge: 'Deck',
    group: 'Recent',
  },
];

export interface UserProfileSettings {
  displayName: string;
  email: string;
  phone?: string;
  title?: string;
  timezone?: string;
  avatar?: string;
  notificationPreferences: {
    productUpdates: boolean;
    securityAlerts: boolean;
    weeklySummary: boolean;
    channels: string[];
  };
}

export const mockProfileSettings: UserProfileSettings = {
  displayName: 'Sarah Johnson',
  email: 'sarah.johnson@hopecommunity.org',
  phone: '+1 (415) 555-1234',
  title: 'Executive Director',
  timezone: 'America/New_York',
  avatar: undefined,
  notificationPreferences: {
    productUpdates: true,
    securityAlerts: true,
    weeklySummary: false,
    channels: ['email', 'push'],
  },
};

export interface OrganizationSettings {
  name: string;
  type: string;
  ein?: string;
  website?: string;
  logo?: string;
  industry?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  mission?: string;
  foundedYear?: number;
  staffCount?: number;
  annualBudget?: string;
  focusAreas?: string[];
  brandColors?: {
    primary: string;
    secondary: string;
  };
}

export const mockOrganizationSettings: OrganizationSettings = {
  name: 'Hope Community Foundation',
  type: 'nonprofit',
  industry: 'Education & Youth',
  ein: '12-3456789',
  website: 'https://hopecommunity.org',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'US',
  },
  mission:
    'Empower youth through education access, mentorship, and community partnerships.',
  foundedYear: 2010,
  staffCount: 24,
  annualBudget: '$3.2M',
  focusAreas: ['Youth empowerment', 'Education', 'Community engagement'],
  brandColors: {
    primary: '#2563eb',
    secondary: '#9333ea',
  },
};

export interface AppSubscription {
  appId: string;
  activeUsers: number;
  dataObjects: number;
  lastUsed?: Date;
  status: 'active' | 'inactive' | 'coming-soon';
}

export const mockAppSubscriptions: AppSubscription[] = mockApps.map((app, index) => ({
  appId: app.id,
  activeUsers: 8 + index * 2,
  dataObjects: 1200 + index * 150,
  lastUsed: app.lastUsed,
  status: app.status === 'coming-soon' ? 'coming-soon' : 'active',
}));

export interface CurrentPlan {
  name: string;
  cadence: 'monthly' | 'annual';
  price: string;
  nextBillingDate: Date;
  paymentMethod: {
    brand: string;
    last4: string;
    expiry: string;
  };
}

export const mockCurrentPlan: CurrentPlan = {
  name: 'Pro',
  cadence: 'monthly',
  price: '$249/mo',
  nextBillingDate: new Date('2024-04-15'),
  paymentMethod: {
    brand: 'Visa',
    last4: '4242',
    expiry: '04/26',
  },
};

export interface PortfolioHealthPoint {
  label: string;
  value: number;
}

export interface FunderActivity {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'update' | 'risk' | 'milestone';
}

export const mockPortfolioHealthData: PortfolioHealthPoint[] = [
  { label: 'Capacity', value: 78 },
  { label: 'Funding', value: 68 },
  { label: 'Impact', value: 72 },
  { label: 'Engagement', value: 81 },
];

export const mockFunderActivities: FunderActivity[] = [
  {
    id: 'act-1',
    title: 'Grant application submitted',
    description: 'Bright Futures Initiative submitted a Q2 capacity-building proposal.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: 'update',
  },
  {
    id: 'act-2',
    title: 'Risk flagged: off-track grantee',
    description: 'Green Horizon Alliance missed the last reporting milestone.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    type: 'risk',
  },
  {
    id: 'act-3',
    title: 'Milestone achieved',
    description: 'Hope Community Foundation reached 90% of outreach goal.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: 'milestone',
  },
];

/**
 * Mock Files for File Management Page
 */
export interface FileItem {
  id: string;
  name: string;
  type: string; // MIME type
  category: 'report' | 'grant' | 'financial' | 'media' | 'governance' | 'policy' | 'other';
  size: number; // bytes
  uploaded_by: string;
  uploaded_at: string;
  url: string;
}

export const mockFiles: FileItem[] = [
  {
    id: 'file-1',
    name: '2024_Annual_Report.pdf',
    type: 'application/pdf',
    category: 'report',
    size: 2456789,
    uploaded_by: 'Sarah Johnson',
    uploaded_at: '2024-11-15',
    url: '#',
  },
  {
    id: 'file-2',
    name: 'Grant_Application_Draft.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'grant',
    size: 1234567,
    uploaded_by: 'Michael Chen',
    uploaded_at: '2024-11-18',
    url: '#',
  },
  {
    id: 'file-3',
    name: 'Budget_FY2024.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    category: 'financial',
    size: 987654,
    uploaded_by: 'Emily Rodriguez',
    uploaded_at: '2024-11-10',
    url: '#',
  },
  {
    id: 'file-4',
    name: 'Program_Photos.zip',
    type: 'application/zip',
    category: 'media',
    size: 15678901,
    uploaded_by: 'David Park',
    uploaded_at: '2024-11-05',
    url: '#',
  },
  {
    id: 'file-5',
    name: 'Board_Meeting_Minutes.pdf',
    type: 'application/pdf',
    category: 'governance',
    size: 543210,
    uploaded_by: 'Sarah Johnson',
    uploaded_at: '2024-11-12',
    url: '#',
  },
  {
    id: 'file-6',
    name: 'Strategic_Plan_2024-2027.pdf',
    type: 'application/pdf',
    category: 'policy',
    size: 3456789,
    uploaded_by: 'Ava Thompson',
    uploaded_at: '2024-11-08',
    url: '#',
  },
  {
    id: 'file-7',
    name: 'Donor_Database_Export.csv',
    type: 'text/csv',
    category: 'financial',
    size: 876543,
    uploaded_by: 'Jordan Lee',
    uploaded_at: '2024-11-14',
    url: '#',
  },
  {
    id: 'file-8',
    name: 'Impact_Measurement_Framework.pptx',
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    category: 'report',
    size: 5678901,
    uploaded_by: 'Sarah Johnson',
    uploaded_at: '2024-11-01',
    url: '#',
  },
];

export const fileCategories = [
  { value: 'report', label: 'Reports' },
  { value: 'grant', label: 'Grants' },
  { value: 'financial', label: 'Financial' },
  { value: 'media', label: 'Media' },
  { value: 'governance', label: 'Governance' },
  { value: 'policy', label: 'Policies' },
  { value: 'other', label: 'Other' },
];

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
