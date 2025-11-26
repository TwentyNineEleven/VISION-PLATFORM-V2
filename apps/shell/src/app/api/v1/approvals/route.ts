/**
 * Approvals API Routes
 *
 * GET /api/v1/approvals - List approvals
 * POST /api/v1/approvals - Create an approval request
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { taskService } from '@/services/taskService';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';

const createApprovalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  appId: z.string().optional(),
  approvalType: z.enum(['review', 'budget', 'document', 'access', 'other']).optional(),
  assignedTo: z.string().uuid().optional(),
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().uuid().optional(),
  organizationId: z.string().uuid(),
});

/**
 * GET /api/v1/approvals
 * List approvals for the organization
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const status = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | 'cancelled' | null;
    const assignedTo = searchParams.get('assignedTo');
    const requestedBy = searchParams.get('requestedBy');
    const limit = searchParams.get('limit');

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required' }, { status: 400 });
    }

    // Verify user is member of organization
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
    }

    const approvals = await taskService.getApprovals(organizationId, {
      status: status || undefined,
      assignedTo: assignedTo || undefined,
      requestedBy: requestedBy || undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: approvals,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching approvals:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch approvals' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/approvals
 * Create a new approval request
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createApprovalSchema.parse(body);

    // Verify user is member of organization
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', validatedData.organizationId)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
    }

    const approval = await taskService.createApproval(validatedData.organizationId, user.id, {
      title: validatedData.title,
      description: validatedData.description,
      appId: validatedData.appId,
      approvalType: validatedData.approvalType,
      assignedTo: validatedData.assignedTo,
      relatedEntityType: validatedData.relatedEntityType,
      relatedEntityId: validatedData.relatedEntityId,
    });

    return NextResponse.json({
      success: true,
      data: approval,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    Sentry.captureException(error);
    console.error('Error creating approval:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create approval' },
      { status: 500 }
    );
  }
}
