import type React from 'react';
import { Building2, CreditCard, LayoutGrid, Sparkles, UserPlus } from 'lucide-react';
import type { UserRole } from './auth';
import { VISION_APPS } from './vision-apps';

export type OrganizationPlan = 'Free' | 'Pro' | 'Enterprise';
export type OrganizationStatus = 'active' | 'suspended';
export type OrganizationKind = 'Nonprofit' | 'Funder' | 'Consultant';

export interface AdminStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalUsers: number;
  pendingInvites: number;
  activeApps: number;
  assignedApps: number;
  overdueInvoices: number;
}

export const mockAdminStats: AdminStats = {
  totalOrganizations: 42,
  activeOrganizations: 39,
  totalUsers: 1842,
  pendingInvites: 18,
  activeApps: 18,
  assignedApps: 146,
  overdueInvoices: 3,
};

export type AdminActivityType = 'organization' | 'user' | 'app' | 'billing' | 'cohort';

export interface AdminActivity {
  id: string;
  type: AdminActivityType;
  title: string;
  description: string;
  timestamp: Date;
  actor: string;
  entity?: string;
  icon?: React.ElementType;
  severity?: 'info' | 'warning' | 'critical';
}

export const mockAdminActivity: AdminActivity[] = [
  {
    id: 'act-org-1',
    type: 'organization',
    title: 'Beacon Literacy Lab created',
    description: 'Workspace was provisioned with the Pro plan and default apps.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    actor: 'Avery Patel',
    entity: 'Beacon Literacy Lab',
    icon: Building2,
  },
  {
    id: 'act-user-1',
    type: 'user',
    title: 'Invite sent to Maya Singh',
    description: 'Org admin for Equity Now Fund with billing reviewer access.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    actor: 'Devon Carter',
    entity: 'Equity Now Fund',
    icon: UserPlus,
  },
  {
    id: 'act-app-1',
    type: 'app',
    title: 'FundFlo enabled for Catalyst Collective',
    description: 'Org admin toggled global availability for this workspace.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    actor: 'Lena Brooks',
    entity: 'Catalyst Funders Collective',
    icon: LayoutGrid,
  },
  {
    id: 'act-bill-1',
    type: 'billing',
    title: 'Invoice INV-2042 overdue',
    description: 'Momentum Impact Lab is 12 days past due ($749).',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    actor: 'Billing System',
    entity: 'Momentum Impact Lab',
    icon: CreditCard,
    severity: 'warning',
  },
  {
    id: 'act-cohort-1',
    type: 'cohort',
    title: 'Climate Resilience cohort updated',
    description: 'Two grantees were reassigned and Ops360 added as required.',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
    actor: 'Naomi Figueroa',
    entity: 'Community Builders',
    icon: Sparkles,
  },
];

export interface AdminQuickAction {
  id: string;
  label: string;
  description: string;
  ctaLabel: string;
  href: string;
  icon: React.ElementType;
  roles?: UserRole[];
}

export const mockAdminQuickActions: AdminQuickAction[] = [
  {
    id: 'create-org',
    label: 'Create organization',
    description: 'Spin up a new workspace with starter templates and apps.',
    ctaLabel: 'Launch builder',
    href: '/dashboard/admin/organizations?create=true',
    icon: Building2,
  },
  {
    id: 'invite-user',
    label: 'Invite user',
    description: 'Send an invitation with preset role & org access.',
    ctaLabel: 'Invite',
    href: '/dashboard/admin/users?invite=true',
    icon: UserPlus,
  },
  {
    id: 'assign-apps',
    label: 'Assign apps',
    description: 'Enable or disable VISION apps for a workspace.',
    ctaLabel: 'Manage catalog',
    href: '/dashboard/admin/apps',
    icon: LayoutGrid,
  },
  {
    id: 'billing-alerts',
    label: 'Resolve billing alerts',
    description: 'Review overdue invoices and payment methods.',
    ctaLabel: 'Review billing',
    href: '/dashboard/admin/billing',
    icon: CreditCard,
  },
  {
    id: 'create-cohort',
    label: 'Create cohort',
    description: 'Group grantees for funder tracking & shared milestones.',
    ctaLabel: 'New cohort',
    href: '/dashboard/admin/cohorts?create=true',
    icon: Sparkles,
    roles: ['funder_admin'],
  },
];

export interface AdminOrganization {
  id: string;
  name: string;
  type: OrganizationKind;
  plan: OrganizationPlan;
  status: OrganizationStatus;
  region: string;
  activeApps: number;
  userCount: number;
  primaryContact: {
    name: string;
    email: string;
  };
  notes?: string;
  lastActive: Date;
  tags: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export const mockAdminOrganizations: AdminOrganization[] = [
  {
    id: 'org-hope',
    name: 'Hope Community Foundation',
    type: 'Nonprofit',
    plan: 'Pro',
    status: 'active',
    region: 'Northeast',
    activeApps: 12,
    userCount: 38,
    primaryContact: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@hopecommunity.org',
    },
    notes: 'Pilot customer for Impact Pulse + Ops360 integration.',
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000),
    tags: ['Youth', 'Education'],
    riskLevel: 'low',
  },
  {
    id: 'org-equity',
    name: 'Equity Now Fund',
    type: 'Funder',
    plan: 'Enterprise',
    status: 'active',
    region: 'West',
    activeApps: 15,
    userCount: 64,
    primaryContact: {
      name: 'Maya Singh',
      email: 'maya@equitynow.org',
    },
    notes: 'Requires quarterly billing summaries.',
    lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    tags: ['Funder', 'Equity'],
    riskLevel: 'medium',
  },
  {
    id: 'org-bridgewell',
    name: 'Bridgewell Consultants',
    type: 'Consultant',
    plan: 'Pro',
    status: 'active',
    region: 'South',
    activeApps: 9,
    userCount: 22,
    primaryContact: {
      name: 'Lena Brooks',
      email: 'lena@bridgewell.co',
    },
    lastActive: new Date(Date.now() - 9 * 60 * 60 * 1000),
    tags: ['Consultant'],
    notes: 'Supports 4 nonprofit workspaces.',
    riskLevel: 'low',
  },
  {
    id: 'org-catalyst',
    name: 'Catalyst Funders Collective',
    type: 'Funder',
    plan: 'Enterprise',
    status: 'active',
    region: 'Midwest',
    activeApps: 17,
    userCount: 41,
    primaryContact: {
      name: 'Devon Carter',
      email: 'devon@catalystfunders.org',
    },
    lastActive: new Date(Date.now() - 25 * 60 * 60 * 1000),
    tags: ['Funder', 'Cohort'],
    notes: 'Using cohort beta features.',
    riskLevel: 'low',
  },
  {
    id: 'org-momentum',
    name: 'Momentum Impact Lab',
    type: 'Nonprofit',
    plan: 'Free',
    status: 'suspended',
    region: 'Southeast',
    activeApps: 5,
    userCount: 11,
    primaryContact: {
      name: 'Ian McConnell',
      email: 'ian@momentumimpact.org',
    },
    lastActive: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    tags: ['Trial'],
    notes: 'Account paused due to billing issues.',
    riskLevel: 'high',
  },
];

export type AdminUserStatus = 'active' | 'invited' | 'suspended';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgId: string;
  orgName: string;
  lastLogin: Date | null;
  status: AdminUserStatus;
}

export const mockAdminUsers: AdminUserRecord[] = [
  {
    id: 'user-vision',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@vision-platform.ai',
    role: 'super_admin',
    orgId: 'vision-hq',
    orgName: 'VISION HQ',
    lastLogin: new Date(Date.now() - 30 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'user-hope-admin',
    name: 'Michael Chen',
    email: 'michael.chen@hopecommunity.org',
    role: 'org_admin',
    orgId: 'org-hope',
    orgName: 'Hope Community Foundation',
    lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'user-equity-admin',
    name: 'Maya Singh',
    email: 'maya@equitynow.org',
    role: 'funder_admin',
    orgId: 'org-equity',
    orgName: 'Equity Now Fund',
    lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'user-bridgewell',
    name: 'Lena Brooks',
    email: 'lena@bridgewell.co',
    role: 'member',
    orgId: 'org-bridgewell',
    orgName: 'Bridgewell Consultants',
    lastLogin: new Date(Date.now() - 26 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'user-catalyst',
    name: 'Devon Carter',
    email: 'devon@catalystfunders.org',
    role: 'org_admin',
    orgId: 'org-catalyst',
    orgName: 'Catalyst Funders Collective',
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'user-momentum',
    name: 'Ian McConnell',
    email: 'ian@momentumimpact.org',
    role: 'member',
    orgId: 'org-momentum',
    orgName: 'Momentum Impact Lab',
    lastLogin: null,
    status: 'suspended',
  },
  {
    id: 'user-catalyst-analyst',
    name: 'Tessa Wright',
    email: 'tessa@catalystfunders.org',
    role: 'viewer',
    orgId: 'org-catalyst',
    orgName: 'Catalyst Funders Collective',
    lastLogin: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: 'invited',
  },
];

export interface AdminUserInvite {
  id: string;
  email: string;
  role: UserRole;
  orgId: string;
  orgName: string;
  invitedAt: Date;
  status: 'pending' | 'expired';
}

export const mockAdminInvites: AdminUserInvite[] = [
  {
    id: 'invite-hope-1',
    email: 'finance@hopecommunity.org',
    role: 'member',
    orgId: 'org-hope',
    orgName: 'Hope Community Foundation',
    invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
  {
    id: 'invite-equity-1',
    email: 'ar@equitynow.org',
    role: 'viewer',
    orgId: 'org-equity',
    orgName: 'Equity Now Fund',
    invitedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
  {
    id: 'invite-momentum-1',
    email: 'treasurer@momentumimpact.org',
    role: 'org_admin',
    orgId: 'org-momentum',
    orgName: 'Momentum Impact Lab',
    invitedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: 'expired',
  },
];

export interface AdminAppControl {
  appId: string;
  globallyAvailable: boolean;
  betaOnly: boolean;
  featured?: boolean;
}

export const mockAdminAppControls: AdminAppControl[] = VISION_APPS.map((app, index) => ({
  appId: app.slug,
  globallyAvailable: app.status !== 'coming-soon',
  betaOnly: app.status === 'coming-soon' || index % 5 === 0,
  featured: Boolean(app.isPopular),
}));

export type OrgAppAssignmentStatus = 'enabled' | 'disabled' | 'coming-soon';

export interface OrgAppAssignmentEntry {
  appId: string;
  status: OrgAppAssignmentStatus;
  activeUsers: number;
  dataObjects: number;
  lastUsed?: Date;
}

export interface OrgAppAssignment {
  orgId: string;
  orgName: string;
  apps: OrgAppAssignmentEntry[];
}

export const mockOrgAppAssignments: OrgAppAssignment[] = [
  {
    orgId: 'org-hope',
    orgName: 'Hope Community Foundation',
    apps: [
      {
        appId: 'capacityiq',
        status: 'enabled',
        activeUsers: 36,
        dataObjects: 2100,
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        appId: 'fundflo',
        status: 'enabled',
        activeUsers: 18,
        dataObjects: 640,
        lastUsed: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        appId: 'ops360',
        status: 'enabled',
        activeUsers: 42,
        dataObjects: 3200,
        lastUsed: new Date(Date.now() - 50 * 60 * 1000),
      },
      {
        appId: 'fundingframer',
        status: 'disabled',
        activeUsers: 0,
        dataObjects: 0,
      },
      {
        appId: 'funder-portfolio-manager',
        status: 'coming-soon',
        activeUsers: 0,
        dataObjects: 0,
      },
    ],
  },
  {
    orgId: 'org-equity',
    orgName: 'Equity Now Fund',
    apps: [
      {
        appId: 'funder-portfolio-manager',
        status: 'enabled',
        activeUsers: 28,
        dataObjects: 8900,
        lastUsed: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        appId: 'metricmap',
        status: 'enabled',
        activeUsers: 19,
        dataObjects: 6400,
        lastUsed: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        appId: 'launchpath',
        status: 'disabled',
        activeUsers: 0,
        dataObjects: 0,
      },
      {
        appId: 'ops360',
        status: 'enabled',
        activeUsers: 34,
        dataObjects: 5400,
        lastUsed: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        appId: 'capacityiq',
        status: 'enabled',
        activeUsers: 31,
        dataObjects: 3000,
        lastUsed: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    ],
  },
  {
    orgId: 'org-catalyst',
    orgName: 'Catalyst Funders Collective',
    apps: [
      {
        appId: 'visionverse',
        status: 'enabled',
        activeUsers: 22,
        dataObjects: 950,
        lastUsed: new Date(Date.now() - 7 * 60 * 60 * 1000),
      },
      {
        appId: 'fundflo',
        status: 'enabled',
        activeUsers: 16,
        dataObjects: 720,
        lastUsed: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        appId: 'ops360',
        status: 'enabled',
        activeUsers: 37,
        dataObjects: 4100,
        lastUsed: new Date(Date.now() - 90 * 60 * 1000),
      },
      {
        appId: 'capacityiq',
        status: 'disabled',
        activeUsers: 0,
        dataObjects: 0,
      },
      {
        appId: 'narrateiq',
        status: 'enabled',
        activeUsers: 15,
        dataObjects: 1800,
        lastUsed: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
    ],
  },
];

export type BillingStatus = 'paid' | 'due' | 'delinquent';

export interface AdminBillingAccount {
  id: string;
  orgId: string;
  orgName: string;
  plan: OrganizationPlan;
  arr: number;
  status: BillingStatus;
  renewalDate: Date;
  paymentMethod: {
    brand: string;
    last4: string;
    expiry: string;
  };
  overdueInvoices: number;
  aiSpend: number;
}

export const mockAdminBillingAccounts: AdminBillingAccount[] = [
  {
    id: 'acct-hope',
    orgId: 'org-hope',
    orgName: 'Hope Community Foundation',
    plan: 'Pro',
    arr: 2988,
    status: 'paid',
    renewalDate: new Date('2024-05-15'),
    paymentMethod: { brand: 'Visa', last4: '4242', expiry: '04/26' },
    overdueInvoices: 0,
    aiSpend: 182.4,
  },
  {
    id: 'acct-equity',
    orgId: 'org-equity',
    orgName: 'Equity Now Fund',
    plan: 'Enterprise',
    arr: 9899,
    status: 'paid',
    renewalDate: new Date('2024-04-28'),
    paymentMethod: { brand: 'Amex', last4: '8821', expiry: '09/25' },
    overdueInvoices: 0,
    aiSpend: 742.1,
  },
  {
    id: 'acct-catalyst',
    orgId: 'org-catalyst',
    orgName: 'Catalyst Funders Collective',
    plan: 'Enterprise',
    arr: 10200,
    status: 'due',
    renewalDate: new Date('2024-03-30'),
    paymentMethod: { brand: 'Mastercard', last4: '1134', expiry: '01/27' },
    overdueInvoices: 1,
    aiSpend: 388.9,
  },
  {
    id: 'acct-momentum',
    orgId: 'org-momentum',
    orgName: 'Momentum Impact Lab',
    plan: 'Free',
    arr: 0,
    status: 'delinquent',
    renewalDate: new Date('2024-03-18'),
    paymentMethod: { brand: 'Visa', last4: '8899', expiry: '06/24' },
    overdueInvoices: 2,
    aiSpend: 42.6,
  },
];

export interface AdminBrandingSettings {
  tagline: string;
  accentColor: string;
  logoUrl?: string;
  links: {
    helpCenter?: string;
    trustCenter?: string;
    statusPage?: string;
  };
}

export interface AdminSecuritySettings {
  require2FA: boolean;
  passwordPolicy: string;
  sessionTimeoutMinutes: number;
  ssoProviders: string[];
  deviceApprovals: boolean;
  allowedDomains: string[];
}

export interface AdminNotificationPreference {
  id: string;
  label: string;
  description: string;
  roles: UserRole[];
  emailEnabled: boolean;
  inAppEnabled: boolean;
}

export interface AdminGuardrailSettings {
  allowAIDrafts: boolean;
  autoRedactPII: boolean;
  retentionWindowDays: number;
  limitExternalSharing: boolean;
  allowCohortDataExport: boolean;
  aiAssistants: string[];
}

export interface AdminSettings {
  branding: AdminBrandingSettings;
  security: AdminSecuritySettings;
  notifications: AdminNotificationPreference[];
  guardrails: AdminGuardrailSettings;
}

export const mockAdminSettings: AdminSettings = {
  branding: {
    tagline: 'Capacity-building intelligence for every organization.',
    accentColor: '#2563eb',
    links: {
      helpCenter: 'https://vision-platform.help',
      trustCenter: 'https://vision-platform.trust',
      statusPage: 'https://status.vision-platform.ai',
    },
  },
  security: {
    require2FA: true,
    passwordPolicy: 'Min 12 characters, numbers & special characters required.',
    sessionTimeoutMinutes: 60,
    ssoProviders: ['Okta', 'Azure AD'],
    deviceApprovals: true,
    allowedDomains: ['vision-platform.ai', 'hopecommunity.org'],
  },
  notifications: [
    {
      id: 'notif-users',
      label: 'User invitations',
      description: 'Notify admins when pending invitations are expiring.',
      roles: ['super_admin', 'org_admin'],
      emailEnabled: true,
      inAppEnabled: true,
    },
    {
      id: 'notif-billing',
      label: 'Billing risk',
      description: 'Alerts for delinquent accounts or expiring cards.',
      roles: ['super_admin', 'org_admin'],
      emailEnabled: true,
      inAppEnabled: true,
    },
    {
      id: 'notif-apps',
      label: 'App access changes',
      description: 'Track when apps are enabled or disabled.',
      roles: ['super_admin', 'org_admin', 'funder_admin'],
      emailEnabled: false,
      inAppEnabled: true,
    },
    {
      id: 'notif-cohorts',
      label: 'Cohort updates',
      description: 'Notify funder teams when cohorts change membership.',
      roles: ['funder_admin'],
      emailEnabled: true,
      inAppEnabled: false,
    },
  ],
  guardrails: {
    allowAIDrafts: true,
    autoRedactPII: true,
    retentionWindowDays: 90,
    limitExternalSharing: false,
    allowCohortDataExport: true,
    aiAssistants: ['Grant Copilot', 'Impact Author', 'Compliance Scout'],
  },
};

export interface PermissionMatrixRow {
  capability: string;
  description?: string;
  roles: Record<UserRole, boolean>;
}

export const mockPermissionMatrix: PermissionMatrixRow[] = [
  {
    capability: 'Access Admin Portal',
    roles: {
      super_admin: true,
      org_admin: true,
      funder_admin: true,
      member: false,
      viewer: false,
    },
  },
  {
    capability: 'Manage organizations',
    roles: {
      super_admin: true,
      org_admin: true,
      funder_admin: false,
      member: false,
      viewer: false,
    },
  },
  {
    capability: 'Manage apps & catalog',
    roles: {
      super_admin: true,
      org_admin: true,
      funder_admin: true,
      member: false,
      viewer: false,
    },
  },
  {
    capability: 'Manage billing',
    roles: {
      super_admin: true,
      org_admin: true,
      funder_admin: false,
      member: false,
      viewer: false,
    },
  },
  {
    capability: 'Create cohorts & assignments',
    roles: {
      super_admin: true,
      org_admin: false,
      funder_admin: true,
      member: false,
      viewer: false,
    },
  },
];

