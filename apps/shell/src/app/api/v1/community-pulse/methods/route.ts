/**
 * CommunityPulse Methods API
 * GET /api/v1/community-pulse/methods - List all engagement methods
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get query params for filtering
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build query
    // Note: Table types will be available after running migrations and regenerating types
    let query = (supabase as any)
      .from('community_pulse_methods')
      .select('*')
      .order('name');

    // Filter by category if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Search by name or description if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching methods:', error);
      return NextResponse.json(
        { error: 'Failed to fetch methods' },
        { status: 500 }
      );
    }

    // Transform to camelCase
    const methods = (data || []).map((row: Record<string, unknown>) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      category: row.category,
      description: row.description,
      bestFor: row.best_for,
      groupSizeMin: row.group_size_min,
      groupSizeMax: row.group_size_max,
      durationMin: row.duration_min,
      durationMax: row.duration_max,
      costEstimateLow: row.cost_estimate_low,
      costEstimateHigh: row.cost_estimate_high,
      equityConsiderations: row.equity_considerations || [],
      requirements: row.requirements || {},
      fitScores: row.fit_scores || {},
    }));

    return NextResponse.json({ data: methods });
  } catch (error) {
    console.error('Methods API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
