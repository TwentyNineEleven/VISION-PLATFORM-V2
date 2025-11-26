/**
 * Activity Service
 *
 * Handles activity logging and retrieval for audit trails
 * and dashboard activity feeds.
 *
 * NOTE: This service uses explicit type definitions since the database
 * tables are created by migration 20251126000001_create_tasks_system.sql
 * which may not yet be reflected in the generated Supabase types.
 * Once the migration is applied and types regenerated, the eslint-disable
 * comments can be removed.
 */

import { createClient } from '@/lib/supabase/client';

// Database row types (matches migration schema)
interface ActivityRow {
  id: string;
  organization_id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  app_id: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface KpiSnapshotRow {
  id: string;
  organization_id: string;
  kpi_key: string;
  label: string;
  value: number;
  sublabel: string | null;
  href: string | null;
  semantic: string | null;
  snapshot_date: string;
  created_at: string;
}

interface AppUsageRow {
  id: string;
  organization_id: string;
  user_id: string;
  app_id: string;
  last_used_at: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export type EntityType = 'task' | 'document' | 'approval' | 'deadline' | 'organization' | 'member' | 'folder' | 'app' | 'notification';
export type ActionType = 'created' | 'updated' | 'deleted' | 'viewed' | 'completed' | 'approved' | 'rejected' | 'uploaded' | 'downloaded' | 'shared' | 'installed' | 'uninstalled';
export type KpiSemantic = 'info' | 'warning' | 'error' | 'success';

export interface Activity {
  id: string;
  organizationId: string;
  actorId: string;
  action: ActionType;
  entityType: EntityType;
  entityId?: string | null;
  entityName?: string | null;
  appId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  // Joined fields
  actorName?: string;
}

export interface KpiSnapshot {
  id: string;
  organizationId: string;
  kpiKey: string;
  label: string;
  value: number;
  sublabel?: string | null;
  href?: string | null;
  semantic: KpiSemantic;
  snapshotDate: string;
  createdAt: string;
}

export interface AppUsage {
  id: string;
  organizationId: string;
  userId: string;
  appId: string;
  lastUsedAt: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LogActivityInput {
  action: ActionType;
  entityType: EntityType;
  entityId?: string;
  entityName?: string;
  appId?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateKpiInput {
  kpiKey: string;
  label: string;
  value: number;
  sublabel?: string;
  href?: string;
  semantic?: KpiSemantic;
}

// Transform database row to Activity interface
function transformActivity(row: ActivityRow & { users?: { full_name?: string } }): Activity {
  return {
    id: row.id,
    organizationId: row.organization_id,
    actorId: row.actor_id,
    action: row.action as ActionType,
    entityType: row.entity_type as EntityType,
    entityId: row.entity_id,
    entityName: row.entity_name,
    appId: row.app_id,
    metadata: (row.metadata as Record<string, unknown>) || {},
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    createdAt: row.created_at,
    actorName: row.users?.full_name,
  };
}

// Transform database row to KpiSnapshot interface
function transformKpiSnapshot(row: KpiSnapshotRow): KpiSnapshot {
  return {
    id: row.id,
    organizationId: row.organization_id,
    kpiKey: row.kpi_key,
    label: row.label,
    value: Number(row.value),
    sublabel: row.sublabel,
    href: row.href,
    semantic: (row.semantic as KpiSemantic) || 'info',
    snapshotDate: row.snapshot_date,
    createdAt: row.created_at,
  };
}

// Transform database row to AppUsage interface
function transformAppUsage(row: AppUsageRow): AppUsage {
  return {
    id: row.id,
    organizationId: row.organization_id,
    userId: row.user_id,
    appId: row.app_id,
    lastUsedAt: row.last_used_at,
    usageCount: row.usage_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const activityService = {
  // =========================================================================
  // ACTIVITIES
  // =========================================================================

  /**
   * Get recent activities for an organization
   */
  async getActivities(organizationId: string, options?: {
    entityType?: EntityType;
    actorId?: string;
    appId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Activity[]> {
    const supabase = createClient();


    let query = (supabase as any)
      .from('activities')
      .select(`
        *,
        users:actor_id (full_name)
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (options?.entityType) {
      query = query.eq('entity_type', options.entityType);
    }

    if (options?.actorId) {
      query = query.eq('actor_id', options.actorId);
    }

    if (options?.appId) {
      query = query.eq('app_id', options.appId);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching activities:', error);
      throw new Error(error.message);
    }

    return ((data || []) as (ActivityRow & { users?: { full_name?: string } })[]).map(transformActivity);
  },

  /**
   * Get recent activities for dashboard display
   */
  async getRecentActivities(organizationId: string, limit = 10): Promise<Activity[]> {
    return this.getActivities(organizationId, { limit });
  },

  /**
   * Log a new activity
   */
  async logActivity(organizationId: string, userId: string, input: LogActivityInput): Promise<Activity> {
    const supabase = createClient();

    const insertData = {
      organization_id: organizationId,
      actor_id: userId,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId || null,
      entity_name: input.entityName || null,
      app_id: input.appId || null,
      metadata: input.metadata || {},
    };


    const { data, error } = await (supabase as any)
      .from('activities')
      .insert(insertData)
      .select(`
        *,
        users:actor_id (full_name)
      `)
      .single();

    if (error) {
      console.error('Error logging activity:', error);
      throw new Error(error.message);
    }

    return transformActivity(data as ActivityRow & { users?: { full_name?: string } });
  },

  // =========================================================================
  // KPI SNAPSHOTS
  // =========================================================================

  /**
   * Get current KPIs for an organization
   */
  async getCurrentKpis(organizationId: string): Promise<KpiSnapshot[]> {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];


    const { data, error } = await (supabase as any)
      .from('kpi_snapshots')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('snapshot_date', today)
      .order('kpi_key');

    if (error) {
      console.error('Error fetching KPIs:', error);
      throw new Error(error.message);
    }

    return ((data || []) as KpiSnapshotRow[]).map(transformKpiSnapshot);
  },

  /**
   * Get KPI history for trend analysis
   */
  async getKpiHistory(organizationId: string, kpiKey: string, days = 30): Promise<KpiSnapshot[]> {
    const supabase = createClient();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);


    const { data, error } = await (supabase as any)
      .from('kpi_snapshots')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('kpi_key', kpiKey)
      .gte('snapshot_date', startDate.toISOString().split('T')[0])
      .order('snapshot_date', { ascending: true });

    if (error) {
      console.error('Error fetching KPI history:', error);
      throw new Error(error.message);
    }

    return ((data || []) as KpiSnapshotRow[]).map(transformKpiSnapshot);
  },

  /**
   * Record a KPI snapshot (upsert for today)
   */
  async recordKpi(organizationId: string, input: CreateKpiInput): Promise<KpiSnapshot> {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];


    const { data, error } = await (supabase as any)
      .from('kpi_snapshots')
      .upsert({
        organization_id: organizationId,
        kpi_key: input.kpiKey,
        label: input.label,
        value: input.value,
        sublabel: input.sublabel || null,
        href: input.href || null,
        semantic: input.semantic || 'info',
        snapshot_date: today,
      }, {
        onConflict: 'organization_id,kpi_key,snapshot_date',
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording KPI:', error);
      throw new Error(error.message);
    }

    return transformKpiSnapshot(data as KpiSnapshotRow);
  },

  /**
   * Compute and record standard dashboard KPIs
   */
  async computeDashboardKpis(organizationId: string): Promise<KpiSnapshot[]> {
    const supabase = createClient();

    // Get counts for various metrics

    const supabaseAny = supabase as any;

    const [
      { count: activeApps },
      { count: pendingApprovals },
      { count: unreadNotifications },
      { count: tasksCount },
    ] = await Promise.all([
      supabaseAny
        .from('app_installations')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .eq('status', 'active'),
      supabaseAny
        .from('approvals')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .eq('status', 'pending')
        .is('deleted_at', null),
      supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .eq('is_read', false),
      supabaseAny
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .eq('status', 'pending')
        .is('deleted_at', null),
    ]);

    const kpis: CreateKpiInput[] = [
      {
        kpiKey: 'active_apps',
        label: 'Active Apps',
        value: activeApps || 0,
        sublabel: 'Installed this week',
        href: '/applications',
        semantic: 'info',
      },
      {
        kpiKey: 'pending_approvals',
        label: 'Requests Pending',
        value: pendingApprovals || 0,
        sublabel: 'Awaiting your review',
        href: '/approvals',
        semantic: (pendingApprovals || 0) > 0 ? 'warning' : 'info',
      },
      {
        kpiKey: 'unread_notifications',
        label: 'Unread Alerts',
        value: unreadNotifications || 0,
        sublabel: 'Across all workspaces',
        href: '/notifications',
        semantic: (unreadNotifications || 0) > 3 ? 'error' : 'info',
      },
      {
        kpiKey: 'open_tasks',
        label: 'Open Tasks',
        value: tasksCount || 0,
        sublabel: 'In progress',
        href: '/tasks',
        semantic: 'success',
      },
    ];

    const results = await Promise.all(
      kpis.map(kpi => this.recordKpi(organizationId, kpi))
    );

    return results;
  },

  // =========================================================================
  // APP USAGE TRACKING
  // =========================================================================

  /**
   * Get recent app usage for a user
   */
  async getRecentApps(organizationId: string, userId: string, limit = 5): Promise<AppUsage[]> {
    const supabase = createClient();


    const { data, error } = await (supabase as any)
      .from('app_usage')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('user_id', userId)
      .order('last_used_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent apps:', error);
      throw new Error(error.message);
    }

    return ((data || []) as AppUsageRow[]).map(transformAppUsage);
  },

  /**
   * Track app usage (upsert)
   */
  async trackAppUsage(organizationId: string, userId: string, appId: string): Promise<AppUsage> {
    const supabase = createClient();


    const supabaseAny = supabase as any;

    // First try to get existing record
    const { data: existing } = await supabaseAny
      .from('app_usage')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('user_id', userId)
      .eq('app_id', appId)
      .single();

    if (existing) {
      // Update existing record
      const existingRow = existing as AppUsageRow;
      const { data, error } = await supabaseAny
        .from('app_usage')
        .update({
          last_used_at: new Date().toISOString(),
          usage_count: existingRow.usage_count + 1,
        })
        .eq('id', existingRow.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating app usage:', error);
        throw new Error(error.message);
      }

      return transformAppUsage(data as AppUsageRow);
    } else {
      // Insert new record
      const { data, error } = await supabaseAny
        .from('app_usage')
        .insert({
          organization_id: organizationId,
          user_id: userId,
          app_id: appId,
          last_used_at: new Date().toISOString(),
          usage_count: 1,
        })
        .select()
        .single();

      if (error) {
        console.error('Error tracking app usage:', error);
        throw new Error(error.message);
      }

      return transformAppUsage(data as AppUsageRow);
    }
  },

  /**
   * Get most used apps across organization
   */
  async getMostUsedApps(organizationId: string, limit = 10): Promise<{ appId: string; totalUsage: number }[]> {
    const supabase = createClient();


    const { data, error } = await (supabase as any)
      .from('app_usage')
      .select('app_id, usage_count')
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Error fetching app usage stats:', error);
      throw new Error(error.message);
    }

    // Aggregate by app_id
    const usageMap = new Map<string, number>();
    for (const row of (data || []) as { app_id: string; usage_count: number }[]) {
      const current = usageMap.get(row.app_id) || 0;
      usageMap.set(row.app_id, current + row.usage_count);
    }

    // Sort and return top apps
    return Array.from(usageMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([appId, totalUsage]) => ({ appId, totalUsage }));
  },
};

export default activityService;
