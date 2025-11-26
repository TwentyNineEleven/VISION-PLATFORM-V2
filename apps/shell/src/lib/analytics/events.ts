import { trackEvent } from './posthog';

/**
 * Analytics Event Tracking Utilities
 *
 * Provides type-safe event tracking functions for common user actions
 * and business metrics across the VISION Platform.
 *
 * Event Categories:
 * - Authentication
 * - Organization Management
 * - Document Management
 * - Team Collaboration
 * - Application Usage
 * - Feature Adoption
 */

// ============================================================================
// Authentication Events
// ============================================================================

export const authEvents = {
  signUp: (properties?: { method?: string; organizationType?: string }) => {
    trackEvent('User Signed Up', {
      category: 'Authentication',
      ...properties,
    });
  },

  signIn: (properties?: { method?: string }) => {
    trackEvent('User Signed In', {
      category: 'Authentication',
      ...properties,
    });
  },

  signOut: () => {
    trackEvent('User Signed Out', {
      category: 'Authentication',
    });
  },

  passwordReset: (step: 'requested' | 'completed') => {
    trackEvent('Password Reset', {
      category: 'Authentication',
      step,
    });
  },

  emailVerified: () => {
    trackEvent('Email Verified', {
      category: 'Authentication',
    });
  },
};

// ============================================================================
// Organization Events
// ============================================================================

export const organizationEvents = {
  created: (properties: { organizationType: string; memberCount?: number }) => {
    trackEvent('Organization Created', {
      category: 'Organization',
      ...properties,
    });
  },

  switched: (properties: { organizationId: string; organizationName: string }) => {
    trackEvent('Organization Switched', {
      category: 'Organization',
      ...properties,
    });
  },

  updated: (properties: { organizationId: string; fields: string[] }) => {
    trackEvent('Organization Updated', {
      category: 'Organization',
      ...properties,
    });
  },

  deleted: (properties: { organizationId: string }) => {
    trackEvent('Organization Deleted', {
      category: 'Organization',
      ...properties,
    });
  },

  settingsViewed: () => {
    trackEvent('Organization Settings Viewed', {
      category: 'Organization',
    });
  },
};

// ============================================================================
// Team Events
// ============================================================================

export const teamEvents = {
  memberInvited: (properties: { role: string; inviteMethod?: string }) => {
    trackEvent('Team Member Invited', {
      category: 'Team',
      ...properties,
    });
  },

  memberJoined: (properties: { role: string }) => {
    trackEvent('Team Member Joined', {
      category: 'Team',
      ...properties,
    });
  },

  memberRemoved: (properties: { role: string; removedBy: 'self' | 'admin' }) => {
    trackEvent('Team Member Removed', {
      category: 'Team',
      ...properties,
    });
  },

  roleChanged: (properties: { fromRole: string; toRole: string }) => {
    trackEvent('Team Member Role Changed', {
      category: 'Team',
      ...properties,
    });
  },
};

// ============================================================================
// Document Events
// ============================================================================

export const documentEvents = {
  uploaded: (properties: { fileType: string; fileSize: number; folderId?: string }) => {
    trackEvent('Document Uploaded', {
      category: 'Documents',
      ...properties,
    });
  },

  viewed: (properties: { documentId: string; fileType: string }) => {
    trackEvent('Document Viewed', {
      category: 'Documents',
      ...properties,
    });
  },

  downloaded: (properties: { documentId: string; fileType: string }) => {
    trackEvent('Document Downloaded', {
      category: 'Documents',
      ...properties,
    });
  },

  shared: (properties: { documentId: string; shareMethod: string }) => {
    trackEvent('Document Shared', {
      category: 'Documents',
      ...properties,
    });
  },

  deleted: (properties: { documentId: string; fileType: string }) => {
    trackEvent('Document Deleted', {
      category: 'Documents',
      ...properties,
    });
  },

  versionCreated: (properties: { documentId: string; versionNumber: number }) => {
    trackEvent('Document Version Created', {
      category: 'Documents',
      ...properties,
    });
  },

  tagAdded: (properties: { documentId: string; tag: string }) => {
    trackEvent('Document Tag Added', {
      category: 'Documents',
      ...properties,
    });
  },

  searched: (properties: { query: string; resultsCount: number }) => {
    trackEvent('Documents Searched', {
      category: 'Documents',
      ...properties,
    });
  },
};

// ============================================================================
// Folder Events
// ============================================================================

export const folderEvents = {
  created: (properties: { folderName: string; parentFolderId?: string }) => {
    trackEvent('Folder Created', {
      category: 'Folders',
      ...properties,
    });
  },

  navigated: (properties: { folderId: string; depth: number }) => {
    trackEvent('Folder Navigated', {
      category: 'Folders',
      ...properties,
    });
  },

  deleted: (properties: { folderId: string; documentCount: number }) => {
    trackEvent('Folder Deleted', {
      category: 'Folders',
      ...properties,
    });
  },
};

// ============================================================================
// Application Usage Events
// ============================================================================

export const appEvents = {
  opened: (properties: { appName: string }) => {
    trackEvent('Application Opened', {
      category: 'Applications',
      ...properties,
    });
  },

  featureUsed: (properties: { appName: string; featureName: string }) => {
    trackEvent('Feature Used', {
      category: 'Applications',
      ...properties,
    });
  },

  taskCompleted: (properties: { appName: string; taskType: string; duration?: number }) => {
    trackEvent('Task Completed', {
      category: 'Applications',
      ...properties,
    });
  },
};

// ============================================================================
// Ops360 Events
// ============================================================================

export const ops360Events = {
  projectCreated: (properties: { projectName: string; templateUsed?: string }) => {
    trackEvent('Ops360: Project Created', {
      category: 'Ops360',
      ...properties,
    });
  },

  taskCreated: (properties: { projectId: string; priority?: string; assignee?: string }) => {
    trackEvent('Ops360: Task Created', {
      category: 'Ops360',
      ...properties,
    });
  },

  taskCompleted: (properties: { projectId: string; taskId: string; duration?: number }) => {
    trackEvent('Ops360: Task Completed', {
      category: 'Ops360',
      ...properties,
    });
  },

  viewSwitched: (properties: { viewType: 'kanban' | 'list' | 'calendar' | 'gantt' }) => {
    trackEvent('Ops360: View Switched', {
      category: 'Ops360',
      ...properties,
    });
  },
};

// ============================================================================
// MetricMap Events
// ============================================================================

export const metricMapEvents = {
  metricCreated: (properties: { metricName: string; metricType: string }) => {
    trackEvent('MetricMap: Metric Created', {
      category: 'MetricMap',
      ...properties,
    });
  },

  dashboardViewed: (properties: { dashboardName: string; widgetCount: number }) => {
    trackEvent('MetricMap: Dashboard Viewed', {
      category: 'MetricMap',
      ...properties,
    });
  },

  reportExported: (properties: { reportType: string; format: string }) => {
    trackEvent('MetricMap: Report Exported', {
      category: 'MetricMap',
      ...properties,
    });
  },
};

// ============================================================================
// Community Compass Events
// ============================================================================

export const communityCompassEvents = {
  surveyCreated: (properties: { surveyName: string; questionCount: number }) => {
    trackEvent('Community Compass: Survey Created', {
      category: 'Community Compass',
      ...properties,
    });
  },

  surveyPublished: (properties: { surveyId: string; surveyName: string }) => {
    trackEvent('Community Compass: Survey Published', {
      category: 'Community Compass',
      ...properties,
    });
  },

  responseReceived: (properties: { surveyId: string; responseTime?: number }) => {
    trackEvent('Community Compass: Response Received', {
      category: 'Community Compass',
      ...properties,
    });
  },

  insightGenerated: (properties: { surveyId: string; insightType: string }) => {
    trackEvent('Community Compass: Insight Generated', {
      category: 'Community Compass',
      ...properties,
    });
  },
};

// ============================================================================
// Onboarding Events
// ============================================================================

export const onboardingEvents = {
  started: (properties?: { source?: string }) => {
    trackEvent('Onboarding Started', {
      category: 'Onboarding',
      ...properties,
    });
  },

  stepCompleted: (properties: { step: string; stepNumber: number }) => {
    trackEvent('Onboarding Step Completed', {
      category: 'Onboarding',
      ...properties,
    });
  },

  completed: (properties: { duration?: number; stepsCompleted: number }) => {
    trackEvent('Onboarding Completed', {
      category: 'Onboarding',
      ...properties,
    });
  },

  skipped: (properties: { step: string; stepNumber: number }) => {
    trackEvent('Onboarding Skipped', {
      category: 'Onboarding',
      ...properties,
    });
  },
};

// ============================================================================
// Error Events
// ============================================================================

export const errorEvents = {
  occurred: (properties: {
    errorType: string;
    errorMessage: string;
    location: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  }) => {
    trackEvent('Error Occurred', {
      category: 'Errors',
      ...properties,
    });
  },

  apiError: (properties: { endpoint: string; statusCode: number; errorMessage: string }) => {
    trackEvent('API Error', {
      category: 'Errors',
      ...properties,
    });
  },
};

// ============================================================================
// Performance Events
// ============================================================================

export const performanceEvents = {
  pageLoad: (properties: { page: string; loadTime: number }) => {
    trackEvent('Page Load', {
      category: 'Performance',
      ...properties,
    });
  },

  apiCall: (properties: { endpoint: string; duration: number; statusCode: number }) => {
    trackEvent('API Call', {
      category: 'Performance',
      ...properties,
    });
  },
};

// ============================================================================
// Feature Flags Events
// ============================================================================

export const featureFlagEvents = {
  evaluated: (properties: { flagKey: string; flagValue: boolean | string; userId: string }) => {
    trackEvent('Feature Flag Evaluated', {
      category: 'Feature Flags',
      ...properties,
    });
  },
};
