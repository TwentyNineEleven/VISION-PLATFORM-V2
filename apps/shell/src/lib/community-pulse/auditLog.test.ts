import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '@/lib/supabase/client';
import { createMockQuery, createMockSupabaseClient, createMockSupabaseError } from '@/test/testUtils';
import { getEngagementAuditLogs } from './auditLog';

vi.mock('@/lib/supabase/client');

describe('getEngagementAuditLogs', () => {
  const mockSupabase = createMockSupabaseClient();

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as any).mockReturnValue(mockSupabase);
  });

  it('scopes audit logs by organization and engagement', async () => {
    const query = createMockQuery();
    query.limit.mockResolvedValue({
      data: [
        {
          id: 'log-1',
          organization_id: 'org-1',
          user_id: 'user-1',
          action: 'engagement.updated',
          resource_type: 'engagement',
          resource_id: 'eng-1',
          metadata: { foo: 'bar' },
          ip_address: '127.0.0.1',
          user_agent: 'test-agent',
          created_at: '2024-01-01T00:00:00Z',
        },
      ],
      error: null,
    });

    mockSupabase.from.mockReturnValueOnce(query);

    const logs = await getEngagementAuditLogs('org-1', 'eng-1', 10);

    expect(mockSupabase.from).toHaveBeenCalledWith('community_pulse_audit_logs');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.eq).toHaveBeenNthCalledWith(1, 'organization_id', 'org-1');
    expect(query.eq).toHaveBeenNthCalledWith(2, 'resource_id', 'eng-1');
    expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(query.limit).toHaveBeenCalledWith(10);

    expect(logs).toEqual([
      {
        id: 'log-1',
        organizationId: 'org-1',
        userId: 'user-1',
        action: 'engagement.updated',
        resourceType: 'engagement',
        resourceId: 'eng-1',
        metadata: { foo: 'bar' },
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        createdAt: '2024-01-01T00:00:00Z',
      },
    ]);
  });

  it('returns empty array on error', async () => {
    const query = createMockQuery();
    query.limit.mockResolvedValue({
      data: null,
      error: createMockSupabaseError('query failed'),
    });

    mockSupabase.from.mockReturnValueOnce(query);

    const logs = await getEngagementAuditLogs('org-1', 'eng-1');

    expect(logs).toEqual([]);
  });
});
