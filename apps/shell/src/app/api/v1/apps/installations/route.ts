/**
 * App Installations API Routes
 *
 * GET /api/v1/apps/installations - List installed apps for organization
 * POST /api/v1/apps/installations - Install an app
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { appInstallationService } from '@/services/appInstallationService';
import * as Sentry from '@sentry/nextjs';

/**
 * GET /api/v1/apps/installations
 * List all installed apps for the current organization
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

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

    // Get installed apps
    const installations = await appInstallationService.getInstalledApps(organizationId);

    return NextResponse.json({
      success: true,
      data: installations,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching app installations:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch installations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/apps/installations
 * Install an app for an organization
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

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
    const { organizationId, appId, appName, settings, featureFlags } = body;

    if (!organizationId || !appId || !appName) {
      return NextResponse.json(
        { error: 'organizationId, appId, and appName are required' },
        { status: 400 }
      );
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
        { error: 'Only organization owners and admins can install apps' },
        { status: 403 }
      );
    }

    // Install the app
    const installation = await appInstallationService.installApp({
      organizationId,
      appId,
      appName,
      settings,
      featureFlags,
    });

    return NextResponse.json({
      success: true,
      data: installation,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error installing app:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to install app' },
      { status: 500 }
    );
  }
}
