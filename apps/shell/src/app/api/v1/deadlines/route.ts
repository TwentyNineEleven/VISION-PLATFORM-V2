/**
 * Deadlines API Routes
 *
 * GET /api/v1/deadlines - List deadlines
 * POST /api/v1/deadlines - Create a deadline
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { taskService } from '@/services/taskService';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';

const createDeadlineSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  appId: z.string().optional(),
  deadlineType: z.enum(['report', 'grant', 'compliance', 'review', 'other']).optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  reminderDate: z.string().optional(),
  ownerId: z.string().uuid().optional(),
  organizationId: z.string().uuid(),
});

/**
 * GET /api/v1/deadlines
 * List deadlines for the organization
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
    const status = searchParams.get('status');
    const deadlineType = searchParams.get('deadlineType') as 'report' | 'grant' | 'compliance' | 'review' | 'other' | null;
    const upcoming = searchParams.get('upcoming') === 'true';
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

    const deadlines = await taskService.getDeadlines(organizationId, {
      status: status || undefined,
      deadlineType: deadlineType || undefined,
      upcoming,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: deadlines,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching deadlines:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch deadlines' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/deadlines
 * Create a new deadline
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
    const validatedData = createDeadlineSchema.parse(body);

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

    const deadline = await taskService.createDeadline(validatedData.organizationId, user.id, {
      title: validatedData.title,
      description: validatedData.description,
      appId: validatedData.appId,
      deadlineType: validatedData.deadlineType,
      dueDate: validatedData.dueDate,
      reminderDate: validatedData.reminderDate,
      ownerId: validatedData.ownerId,
    });

    return NextResponse.json({
      success: true,
      data: deadline,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    Sentry.captureException(error);
    console.error('Error creating deadline:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create deadline' },
      { status: 500 }
    );
  }
}
