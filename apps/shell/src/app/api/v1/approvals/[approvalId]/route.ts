/**
 * Approval Detail API Routes
 *
 * GET /api/v1/approvals/[approvalId] - Get approval details
 * PATCH /api/v1/approvals/[approvalId] - Approve or reject
 * DELETE /api/v1/approvals/[approvalId] - Delete approval
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { taskService } from '@/services/taskService';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';

const decisionSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  notes: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ approvalId: string }>;
}

/**
 * PATCH /api/v1/approvals/[approvalId]
 * Approve or reject an approval request
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient();
    const { approvalId } = await params;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = decisionSchema.parse(body);

    const approval = await taskService.decideApproval(
      approvalId,
      validatedData.decision,
      validatedData.notes
    );

    return NextResponse.json({
      success: true,
      data: approval,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    Sentry.captureException(error);
    console.error('Error updating approval:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update approval' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/approvals/[approvalId]
 * Delete an approval (soft delete)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient();
    const { approvalId } = await params;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await taskService.deleteApproval(approvalId);

    return NextResponse.json({
      success: true,
      message: 'Approval deleted',
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error deleting approval:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete approval' },
      { status: 500 }
    );
  }
}
