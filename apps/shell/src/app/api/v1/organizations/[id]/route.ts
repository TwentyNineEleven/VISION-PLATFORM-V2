import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AsyncRouteParams } from '@/types/next';

/**
 * GET /api/v1/organizations/[id]
 * Get organization details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: AsyncRouteParams<{ id: string }>
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get organization (RLS will ensure user has access)
    const { data: organization, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error || !organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Get user's role in this organization
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    return NextResponse.json({
      data: {
        ...organization,
        userRole: membership?.role || null,
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/organizations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/v1/organizations/[id]
 * Update organization details
 * Requires: Owner or Admin role
 */
export async function PATCH(
  request: NextRequest,
  { params }: AsyncRouteParams<{ id: string }>
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check user's role (must be Owner or Admin)
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (!membership || !['Owner', 'Admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Forbidden - requires Owner or Admin role' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Build update object
    const updates: Record<string, any> = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.type !== undefined) updates.type = body.type;
    if (body.website !== undefined) updates.website = body.website;
    if (body.industry !== undefined) updates.industry = body.industry;
    if (body.ein !== undefined) updates.ein = body.ein;
    if (body.logo_url !== undefined) updates.logo_url = body.logo_url;
    if (body.mission !== undefined) updates.mission = body.mission;
    if (body.founded_year !== undefined) updates.founded_year = body.founded_year;
    if (body.staff_count !== undefined) updates.staff_count = body.staff_count;
    if (body.annual_budget !== undefined) updates.annual_budget = body.annual_budget;
    if (body.focus_areas !== undefined) updates.focus_areas = body.focus_areas;

    // Address fields
    if (body.address) {
      if (body.address.street !== undefined) updates.address_street = body.address.street;
      if (body.address.city !== undefined) updates.address_city = body.address.city;
      if (body.address.state !== undefined) updates.address_state = body.address.state;
      if (body.address.postalCode !== undefined) updates.address_postal_code = body.address.postalCode;
      if (body.address.country !== undefined) updates.address_country = body.address.country;
    }

    // Brand colors
    if (body.brandColors) {
      if (body.brandColors.primary !== undefined) updates.brand_primary_color = body.brandColors.primary;
      if (body.brandColors.secondary !== undefined) updates.brand_secondary_color = body.brandColors.secondary;
    }

    // Billing fields (for future use)
    if (body.billing_email !== undefined) updates.billing_email = body.billing_email;

    // Update organization
    const { data: updated, error: updateError } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (updateError || !updated) {
      console.error('Error updating organization:', updateError);
      return NextResponse.json(
        { error: 'Failed to update organization' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/v1/organizations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/organizations/[id]
 * Soft delete organization
 * Requires: Owner role only
 */
export async function DELETE(
  request: NextRequest,
  { params }: AsyncRouteParams<{ id: string }>
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is owner
    const { data: org } = await supabase
      .from('organizations')
      .select('owner_id')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (!org || org.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - only organization owner can delete' },
        { status: 403 }
      );
    }

    // Soft delete organization
    const { error: deleteError } = await supabase
      .from('organizations')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
      })
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting organization:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete organization' },
        { status: 500 }
      );
    }

    // If this was the active org, clear it from user preferences
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('active_organization_id')
      .eq('user_id', user.id)
      .single();

    if (prefs?.active_organization_id === id) {
      // Get user's other organizations
      const { data: otherOrgs } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .is('deleted_at', null)
        .neq('organization_id', id)
        .limit(1);

      // Set first available org as active, or null if none
      await supabase
        .from('user_preferences')
        .update({
          active_organization_id: otherOrgs?.[0]?.organization_id || null,
        })
        .eq('user_id', user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/v1/organizations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
