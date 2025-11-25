import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/v1/organizations/[id]/members
 * List all members of an organization
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is a member of this organization
    const { data: membership } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: 'Forbidden - not a member of this organization' },
        { status: 403 }
      );
    }

    // Get all members with user details
    const { data: members, error } = await supabase
      .from('organization_members')
      .select(`
        id,
        role,
        status,
        joined_at,
        last_accessed_at,
        users (
          id,
          name,
          email,
          avatar_url
        )
      `)
      .eq('organization_id', id)
      .is('deleted_at', null)
      .order('joined_at', { ascending: false });

    if (error) {
      console.error('Error fetching members:', error);
      return NextResponse.json(
        { error: 'Failed to fetch members' },
        { status: 500 }
      );
    }

    // Transform data to flat structure
    const teamMembers = members?.map(m => ({
      id: m.id,
      userId: (m.users as any)?.id,
      name: (m.users as any)?.name,
      email: (m.users as any)?.email,
      avatar: (m.users as any)?.avatar_url,
      role: m.role,
      status: m.status,
      joinedAt: m.joined_at,
      lastAccessedAt: m.last_accessed_at,
    })) || [];

    return NextResponse.json({ data: teamMembers });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/organizations/[id]/members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
