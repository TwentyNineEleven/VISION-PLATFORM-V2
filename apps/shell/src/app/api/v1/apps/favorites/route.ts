/**
 * App Favorites API Routes
 *
 * GET /api/v1/apps/favorites - List user's favorite apps
 * POST /api/v1/apps/favorites - Add app to favorites
 * DELETE /api/v1/apps/favorites?appId=xxx - Remove app from favorites
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { appInstallationService } from '@/services/appInstallationService';
import * as Sentry from '@sentry/nextjs';

/**
 * GET /api/v1/apps/favorites
 * List user's favorite apps
 */
export async function GET() {
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

    // Get favorites
    const favorites = await appInstallationService.getFavorites();

    return NextResponse.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/apps/favorites
 * Add an app to favorites
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
    const { appId } = body;

    if (!appId) {
      return NextResponse.json({ error: 'appId is required' }, { status: 400 });
    }

    // Add to favorites
    const favorite = await appInstallationService.addFavorite(appId);

    return NextResponse.json({
      success: true,
      data: favorite,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/apps/favorites
 * Remove an app from favorites
 */
export async function DELETE(request: NextRequest) {
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

    // Get appId from query params
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    if (!appId) {
      return NextResponse.json({ error: 'appId is required' }, { status: 400 });
    }

    // Remove from favorites
    await appInstallationService.removeFavorite(appId);

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
