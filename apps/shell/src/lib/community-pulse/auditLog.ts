/**
 * CommunityPulse Audit Logging
 * Track user actions for compliance and debugging
 */

import { createClient } from '@/lib/supabase/client';

// ============================================================================
// TYPES
// ============================================================================

export type AuditAction =
  | 'engagement.created'
  | 'engagement.updated'
  | 'engagement.deleted'
  | 'engagement.archived'
  | 'engagement.exported'
  | 'engagement.stage_completed'
  | 'material.generated'
  | 'material.downloaded'
  | 'material.deleted'
  | 'template.created'
  | 'template.used'
  | 'method.selected';

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  userId: string;
  action: AuditAction;
  resourceType: 'engagement' | 'material' | 'template' | 'method';
  resourceId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface CreateAuditLogInput {
  action: AuditAction;
  resourceType: AuditLogEntry['resourceType'];
  resourceId: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// AUDIT LOG SERVICE
// ============================================================================

/**
 * Create an audit log entry
 */
export async function createAuditLog(
  organizationId: string,
  userId: string,
  input: CreateAuditLogInput
): Promise<AuditLogEntry | null> {
  try {
    const supabase = createClient();

    // Get client info for audit trail
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : undefined;

    // Note: Table types will be available after running migrations and regenerating types
    const { data, error } = await (supabase as any)
      .from('community_pulse_audit_logs')
      .insert({
        organization_id: organizationId,
        user_id: userId,
        action: input.action,
        resource_type: input.resourceType,
        resource_id: input.resourceId,
        metadata: input.metadata || {},
        user_agent: userAgent,
      })
      .select()
      .single();

    if (error) {
      // Don't throw - audit logging should not break the main flow
      console.error('Audit log error:', error);
      return null;
    }

    return {
      id: data.id,
      organizationId: data.organization_id,
      userId: data.user_id,
      action: data.action,
      resourceType: data.resource_type,
      resourceId: data.resource_id,
      metadata: data.metadata,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error('Audit log error:', err);
    return null;
  }
}

/**
 * Get audit logs for an engagement
 */
export async function getEngagementAuditLogs(
  organizationId: string,
  engagementId: string,
  limit = 50
): Promise<AuditLogEntry[]> {
  const supabase = createClient();

  // Note: Table types will be available after running migrations and regenerating types
  const { data, error } = await (supabase as any)
    .from('community_pulse_audit_logs')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('resource_id', engagementId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }

  return (data || []).map((row: Record<string, unknown>): AuditLogEntry => ({
    id: row.id as string,
    organizationId: row.organization_id as string,
    userId: row.user_id as string,
    action: row.action as AuditAction,
    resourceType: row.resource_type as AuditLogEntry['resourceType'],
    resourceId: row.resource_id as string,
    metadata: row.metadata as Record<string, unknown>,
    ipAddress: row.ip_address as string | undefined,
    userAgent: row.user_agent as string | undefined,
    createdAt: row.created_at as string,
  }));
}

/**
 * Get audit logs for an organization
 */
export async function getOrganizationAuditLogs(
  organizationId: string,
  options?: {
    limit?: number;
    offset?: number;
    action?: AuditAction;
    startDate?: string;
    endDate?: string;
  }
): Promise<{ logs: AuditLogEntry[]; total: number }> {
  const supabase = createClient();
  const limit = options?.limit || 50;
  const offset = options?.offset || 0;

  // Note: Table types will be available after running migrations and regenerating types
  let query = (supabase as any)
    .from('community_pulse_audit_logs')
    .select('*', { count: 'exact' })
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (options?.action) {
    query = query.eq('action', options.action);
  }
  if (options?.startDate) {
    query = query.gte('created_at', options.startDate);
  }
  if (options?.endDate) {
    query = query.lte('created_at', options.endDate);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching audit logs:', error);
    return { logs: [], total: 0 };
  }

  return {
    logs: (data || []).map((row: Record<string, unknown>): AuditLogEntry => ({
      id: row.id as string,
      organizationId: row.organization_id as string,
      userId: row.user_id as string,
      action: row.action as AuditAction,
      resourceType: row.resource_type as AuditLogEntry['resourceType'],
      resourceId: row.resource_id as string,
      metadata: row.metadata as Record<string, unknown>,
      ipAddress: row.ip_address as string | undefined,
      userAgent: row.user_agent as string | undefined,
      createdAt: row.created_at as string,
    })),
    total: count || 0,
  };
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Log engagement creation
 */
export function logEngagementCreated(
  organizationId: string,
  userId: string,
  engagementId: string,
  title: string
): Promise<AuditLogEntry | null> {
  return createAuditLog(organizationId, userId, {
    action: 'engagement.created',
    resourceType: 'engagement',
    resourceId: engagementId,
    metadata: { title },
  });
}

/**
 * Log engagement update
 */
export function logEngagementUpdated(
  organizationId: string,
  userId: string,
  engagementId: string,
  changes: Record<string, unknown>
): Promise<AuditLogEntry | null> {
  return createAuditLog(organizationId, userId, {
    action: 'engagement.updated',
    resourceType: 'engagement',
    resourceId: engagementId,
    metadata: { changes: Object.keys(changes) },
  });
}

/**
 * Log stage completion
 */
export function logStageCompleted(
  organizationId: string,
  userId: string,
  engagementId: string,
  stage: number,
  stageName: string
): Promise<AuditLogEntry | null> {
  return createAuditLog(organizationId, userId, {
    action: 'engagement.stage_completed',
    resourceType: 'engagement',
    resourceId: engagementId,
    metadata: { stage, stageName },
  });
}

/**
 * Log engagement export
 */
export function logEngagementExported(
  organizationId: string,
  userId: string,
  engagementId: string,
  format: string,
  destination?: string
): Promise<AuditLogEntry | null> {
  return createAuditLog(organizationId, userId, {
    action: 'engagement.exported',
    resourceType: 'engagement',
    resourceId: engagementId,
    metadata: { format, destination },
  });
}

/**
 * Log material generation
 */
export function logMaterialGenerated(
  organizationId: string,
  userId: string,
  materialId: string,
  engagementId: string,
  materialType: string
): Promise<AuditLogEntry | null> {
  return createAuditLog(organizationId, userId, {
    action: 'material.generated',
    resourceType: 'material',
    resourceId: materialId,
    metadata: { engagementId, materialType },
  });
}

/**
 * Log material download
 */
export function logMaterialDownloaded(
  organizationId: string,
  userId: string,
  materialId: string,
  materialType: string
): Promise<AuditLogEntry | null> {
  return createAuditLog(organizationId, userId, {
    action: 'material.downloaded',
    resourceType: 'material',
    resourceId: materialId,
    metadata: { materialType },
  });
}

/**
 * Log method selection
 */
export function logMethodSelected(
  organizationId: string,
  userId: string,
  engagementId: string,
  methodSlug: string,
  isAiRecommended: boolean
): Promise<AuditLogEntry | null> {
  return createAuditLog(organizationId, userId, {
    action: 'method.selected',
    resourceType: 'method',
    resourceId: methodSlug,
    metadata: { engagementId, isAiRecommended },
  });
}

// ============================================================================
// AUDIT LOG FORMATTING
// ============================================================================

/**
 * Format action for display
 */
export function formatAuditAction(action: AuditAction): string {
  const actionMap: Record<AuditAction, string> = {
    'engagement.created': 'Created engagement',
    'engagement.updated': 'Updated engagement',
    'engagement.deleted': 'Deleted engagement',
    'engagement.archived': 'Archived engagement',
    'engagement.exported': 'Exported engagement',
    'engagement.stage_completed': 'Completed stage',
    'material.generated': 'Generated material',
    'material.downloaded': 'Downloaded material',
    'material.deleted': 'Deleted material',
    'template.created': 'Created template',
    'template.used': 'Used template',
    'method.selected': 'Selected method',
  };
  return actionMap[action] || action;
}

/**
 * Get action icon
 */
export function getAuditActionIcon(action: AuditAction): string {
  const iconMap: Record<AuditAction, string> = {
    'engagement.created': 'plus-circle',
    'engagement.updated': 'edit',
    'engagement.deleted': 'trash',
    'engagement.archived': 'archive',
    'engagement.exported': 'download',
    'engagement.stage_completed': 'check-circle',
    'material.generated': 'file-plus',
    'material.downloaded': 'download',
    'material.deleted': 'file-minus',
    'template.created': 'file-text',
    'template.used': 'copy',
    'method.selected': 'target',
  };
  return iconMap[action] || 'activity';
}
