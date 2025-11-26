/**
 * Single App Installation API Routes
 *
 * GET /api/v1/apps/installations/[appId] - Get installation details
 * PATCH /api/v1/apps/installations/[appId] - Update installation settings
 * DELETE /api/v1/apps/installations/[appId] - Uninstall app
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { appInstallationService } from '@/services/appInstallationService';
import * as Sentry from '@sentry/nextjs';

interface RouteParams {
  params: Promise<{ appId: string }>;
}

/**
 * GET /api/v1/apps/installations/[appId]
 * Get installation details for a specific app
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient();
    const { appId } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get organization ID from query params
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required' }, { status: 400 });
    }

    // Verify user is member of organization
    const { data: membership, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (memberError || !membership) {
      return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
    }

    // Get installation
    const installation = await appInstallationService.getInstallation(organizationId, appId);

    if (!installation) {
      return NextResponse.json({ error: 'App not installed' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: installation,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching app installation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch installation' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/v1/apps/installations/[appId]
 * Update installation settings
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient();
    const { appId } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { organizationId, settings, featureFlags, status } = body;

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required' }, { status: 400 });
    }

    // Verify user is admin of organization
    const { data: membership, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (memberError || !membership) {
      return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
    }

    if (!['Owner', 'Admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Only organization owners and admins can update app settings' },
        { status: 403 }
      );
    }

    // Update installation
    const installation = await appInstallationService.updateInstallation(organizationId, appId, {
      settings,
      featureFlags,
      status,
    });

    return NextResponse.json({
      success: true,
      data: installation,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error updating app installation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update installation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/apps/installations/[appId]
 * Uninstall an app
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient();
    const { appId } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get organization ID from query params
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required' }, { status: 400 });
    }

    // Verify user is admin of organization
    const { data: membership, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (memberError || !membership) {
      return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
    }

    if (!['Owner', 'Admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Only organization owners and admins can uninstall apps' },
        { status: 403 }
      );
    }

    // Uninstall the app
    await appInstallationService.uninstallApp(organizationId, appId);

    return NextResponse.json({
      success: true,
      message: 'App uninstalled successfully',
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error uninstalling app:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to uninstall app' },
      { status: 500 }
    );
  }
}
