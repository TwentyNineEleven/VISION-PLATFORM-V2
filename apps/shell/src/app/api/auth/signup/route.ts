import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const supabase = await createServerSupabaseClient();

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user!.id,
        email,
        name,
      });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    // Create personal organization
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: `${name}'s Organization`,
        owner_id: authData.user!.id,
      })
      .select()
      .single();

    if (orgError) {
      console.error('Failed to create organization:', orgError);
      // Don't fail signup if org creation fails
    }

    // Create default preferences with active organization
    const { error: prefsError } = await supabase
      .from('user_preferences')
      .insert({
        user_id: authData.user!.id,
        active_organization_id: organization?.id || null,
      });

    if (prefsError) {
      console.warn('Failed to create preferences:', prefsError);
    }

    return NextResponse.json({
      user: {
        id: authData.user!.id,
        email,
        name,
      },
      session: authData.session,
      organization: organization || null,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
