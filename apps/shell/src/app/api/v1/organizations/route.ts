import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/v1/organizations
 * List all organizations for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get organizations where user is a member
    const { data: memberships, error } = await supabase
      .from('organization_members')
      .select(`
        role,
        last_accessed_at,
        organizations (*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('last_accessed_at', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('Error fetching organizations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch organizations' },
        { status: 500 }
      );
    }

    const organizations = memberships
      ?.filter(m => m.organizations && !Array.isArray(m.organizations))
      .map(m => ({
        ...m.organizations,
        role: m.role,
        lastAccessed: m.last_accessed_at,
      })) || [];

    return NextResponse.json({ data: organizations });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/organizations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/organizations
 * Create a new organization (user becomes owner)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, ...rest } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Organization name is required' },
        { status: 400 }
      );
    }

    // Create organization
    const { data: newOrg, error: createError } = await supabase
      .from('organizations')
      .insert({
        name: name.trim(),
        owner_id: user.id,
        type: rest.type || null,
        website: rest.website || null,
        industry: rest.industry || null,
        ein: rest.ein || null,
        logo_url: rest.logo_url || null,
        mission: rest.mission || null,
        founded_year: rest.founded_year || null,
        staff_count: rest.staff_count || null,
        annual_budget: rest.annual_budget || null,
        focus_areas: rest.focus_areas || null,
        address_street: rest.address?.street || null,
        address_city: rest.address?.city || null,
        address_state: rest.address?.state || null,
        address_postal_code: rest.address?.postalCode || null,
        address_country: rest.address?.country || null,
        brand_primary_color: rest.brandColors?.primary || '#2563eb',
        brand_secondary_color: rest.brandColors?.secondary || '#9333ea',
      })
      .select()
      .single();

    if (createError || !newOrg) {
      console.error('Error creating organization:', createError);
      return NextResponse.json(
        { error: 'Failed to create organization' },
        { status: 500 }
      );
    }

    // Set as active organization
    await supabase
      .from('user_preferences')
      .update({ active_organization_id: newOrg.id })
      .eq('user_id', user.id);

    return NextResponse.json({ data: newOrg }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/v1/organizations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
