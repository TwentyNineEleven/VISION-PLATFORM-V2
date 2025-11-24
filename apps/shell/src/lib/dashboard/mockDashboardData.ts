/**
 * Mock Dashboard Data
 *
 * Structured sample data for the VISION Platform dashboard experience.
 * Each record references the centralized app metadata (via appId) to keep
 * iconography, colors, and routing consistent across the UI.
 */

export type TaskStatus = 'overdue' | 'due-today' | 'upcoming';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Organization {
  id: string;
  name: string;
  lastLogin: string; // ISO string
  activeAppCount: number;
}

export interface Kpi {
  id: string;
  label: string;
  value: number;
  sublabel: string;
  href: string;
  semantic: 'info' | 'warning' | 'error' | 'success';
}

export interface Task {
  id: string;
  title: string;
  appId: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  context?: string;
}

export interface Deadline {
  id: string;
  title: string;
  appId: string;
  dueDate: string; // YYYY-MM-DD
  type: 'report' | 'grant';
}

export interface Approval {
  id: string;
  title: string;
  appId: string;
  requestedBy: string;
  requestedAt: string; // ISO string
}

export interface AppActivity {
  appId: string;
  href: string;
  lastUsed?: string; // ISO string
  pinnedBy?: 'user' | 'funder';
  note?: string;
}

export interface AppItem {
  id: string;
  name: string;
  description: string;
  href: string;
  lastUsed?: string;
  pinnedBy?: 'user' | 'funder';
  note?: string;
}

export interface RecommendedApp {
  appId: string;
  description: string;
  href: string;
  contextAppId?: string;
}

export type DocumentType = 'doc' | 'report' | 'plan' | 'proposal';

export interface Document {
  id: string;
  title: string;
  appId: string;
  type: DocumentType;
  updatedAt: string; // ISO string
  updatedBy: string;
}

export interface TransformationArea {
  phase: 'VOICE' | 'INSPIRE' | 'STRATEGIZE' | 'INITIATE' | 'OPERATE' | 'NARRATE';
  label: string;
  activeApps: number;
}

// ---------------------------------------------------------------------------
// Mocked user + org
// ---------------------------------------------------------------------------

export const currentUser: User = {
  id: 'user_123',
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: 'Program Director',
};

export const currentOrg: Organization = {
  id: 'org_hope_cf',
  name: 'Hope Community Foundation',
  lastLogin: '2025-11-19T14:32:00Z',
  activeAppCount: 17,
};

// ---------------------------------------------------------------------------
// KPIs
// ---------------------------------------------------------------------------

export const kpis: Kpi[] = [
  {
    id: 'activeApps',
    label: 'Active Apps',
    value: 17,
    sublabel: 'Used this week',
    href: '/applications',
    semantic: 'info',
  },
  {
    id: 'pendingRequests',
    label: 'Requests Pending',
    value: 2,
    sublabel: 'Awaiting your review',
    href: '/ops360/requests',
    semantic: 'warning',
  },
  {
    id: 'unreadAlerts',
    label: 'Unread Alerts',
    value: 4,
    sublabel: 'Across all workspaces',
    href: '/notifications',
    semantic: 'error',
  },
  {
    id: 'capacityScore',
    label: 'Capacity Score',
    value: 78,
    sublabel: 'Updated 10 days ago',
    href: '/apps/capacityiq',
    semantic: 'success',
  },
];

// ---------------------------------------------------------------------------
// Workstream Data
// ---------------------------------------------------------------------------

export const tasksToday: Task[] = [
  {
    id: 'task_1',
    title: 'Finalize logic model for Youth Aftercare',
    appId: 'pathwaypro',
    dueDate: '2025-11-22',
    status: 'due-today',
    context: 'STRATEGIZE THE MODEL',
  },
  {
    id: 'task_2',
    title: 'Approve revised KPI set for Housing Stabilization',
    appId: 'metricmap',
    dueDate: '2025-11-23',
    status: 'upcoming',
    context: 'OPERATE SYSTEMS',
  },
  {
    id: 'task_3',
    title: 'Complete stakeholder mapping for Q4 engagement',
    appId: 'stakeholdr',
    dueDate: '2025-11-20',
    status: 'overdue',
    context: 'VOICE OF THE COMMUNITY',
  },
  {
    id: 'task_4',
    title: 'Review community survey results summary',
    appId: 'community-compass',
    dueDate: '2025-11-25',
    status: 'upcoming',
    context: 'VOICE OF THE COMMUNITY',
  },
  {
    id: 'task_5',
    title: 'Draft grant proposal for Youth Workforce Pathways',
    appId: 'fundingframer',
    dueDate: '2025-11-24',
    status: 'upcoming',
    context: 'NARRATE IMPACT',
  },
];

export const upcomingDeadlines: Deadline[] = [
  {
    id: 'deadline_1',
    title: 'OVSJG Capacity Cohort – Q4 report',
    appId: 'narrateiq',
    dueDate: '2025-11-30',
    type: 'report',
  },
  {
    id: 'deadline_2',
    title: 'DC Housing Trust – renewal grant',
    appId: 'fundingframer',
    dueDate: '2025-12-05',
    type: 'grant',
  },
  {
    id: 'deadline_3',
    title: 'Annual Impact Report to Board',
    appId: 'narrateiq',
    dueDate: '2025-12-15',
    type: 'report',
  },
];

export const approvals: Approval[] = [
  {
    id: 'approval_1',
    title: "Review grant draft: 'Youth Workforce Pathways'",
    appId: 'fundingframer',
    requestedBy: 'Maya Patel',
    requestedAt: '2025-11-20T16:12:00Z',
  },
  {
    id: 'approval_2',
    title: 'Approve budget allocation for Ops360 project',
    appId: 'ops360',
    requestedBy: 'Jordan Lee',
    requestedAt: '2025-11-21T09:30:00Z',
  },
];

// ---------------------------------------------------------------------------
// Apps
// ---------------------------------------------------------------------------

export const recentApps: AppActivity[] = [
  {
    appId: 'ops360',
    href: '/apps/ops360',
    lastUsed: '2025-11-21T13:05:00Z',
  },
  {
    appId: 'metricmap',
    href: '/apps/metricmap',
    lastUsed: '2025-11-20T18:45:00Z',
  },
  {
    appId: 'fundingframer',
    href: '/apps/fundingframer',
    lastUsed: '2025-11-19T10:02:00Z',
  },
  {
    appId: 'pathwaypro',
    href: '/apps/pathwaypro',
    lastUsed: '2025-11-18T15:20:00Z',
  },
];

export const favoriteApps: AppActivity[] = [
  {
    appId: 'community-compass',
    href: '/apps/community-compass',
    pinnedBy: 'user',
    note: 'Pinned by you',
  },
  {
    appId: 'stakeholdr',
    href: '/apps/stakeholdr',
    pinnedBy: 'funder',
    note: 'Funder recommended',
  },
  {
    appId: 'capacityiq',
    href: '/apps/capacityiq',
    pinnedBy: 'user',
  },
];

export const recommendedApp: RecommendedApp = {
  appId: 'pathwaypro',
  href: '/apps/pathwaypro',
  description:
    'You recently completed a community survey in Community Compass. Use PathwayPro next to translate findings into a logic model.',
  contextAppId: 'community-compass',
};

// ---------------------------------------------------------------------------
// Documents & Activity
// ---------------------------------------------------------------------------

export const recentDocuments: Document[] = [
  {
    id: 'doc_1',
    title: 'Strategic Plan – Housing Stability 2025–2028',
    appId: 'narrateiq',
    type: 'plan',
    updatedAt: '2025-11-19T17:30:00Z',
    updatedBy: 'Maya Patel',
  },
  {
    id: 'doc_2',
    title: 'OVSJG Capacity Assessment Summary',
    appId: 'capacityiq',
    type: 'report',
    updatedAt: '2025-11-18T12:05:00Z',
    updatedBy: 'System',
  },
  {
    id: 'doc_3',
    title: 'Youth Workforce Pathways – Grant Draft v3',
    appId: 'fundingframer',
    type: 'proposal',
    updatedAt: '2025-11-17T14:22:00Z',
    updatedBy: 'Jordan Lee',
  },
  {
    id: 'doc_4',
    title: 'Q4 Stakeholder Engagement Report',
    appId: 'stakeholdr',
    type: 'report',
    updatedAt: '2025-11-16T10:15:00Z',
    updatedBy: 'Sarah Johnson',
  },
];

export const transformationSnapshot: TransformationArea[] = [
  { phase: 'VOICE', activeApps: 2, label: 'Listening & stakeholders' },
  { phase: 'INSPIRE', activeApps: 1, label: 'Mission & vision' },
  { phase: 'STRATEGIZE', activeApps: 3, label: 'Program design' },
  { phase: 'INITIATE', activeApps: 1, label: '90-day plans' },
  { phase: 'OPERATE', activeApps: 2, label: 'Ops & KPIs' },
  { phase: 'NARRATE', activeApps: 1, label: 'Grants & stories' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDueDate(dateString: string, status?: TaskStatus): string {
  const date = new Date(dateString + 'T00:00:00Z');
  const today = new Date();
  const diffDays = Math.floor((date.getTime() - today.getTime()) / 86400000);

  if (status === 'overdue') return 'Overdue';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays < 7) return `Due in ${diffDays} days`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
