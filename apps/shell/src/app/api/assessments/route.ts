import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, targetPopulation, geographicArea } = body;

        // Get user's active organization
        const { data: prefs } = await supabase
            .from('user_preferences')
            .select('active_organization_id')
            .eq('user_id', user.id)
            .single();

        if (!prefs?.active_organization_id) {
            return NextResponse.json({ error: 'No active organization' }, { status: 400 });
        }

        // Create new assessment
        const { data, error } = await supabase
            .from('community_assessments')
            .insert({
                user_id: user.id,
                organization_id: prefs.active_organization_id,
                title,
                target_population: targetPopulation,
                geographic_area: geographicArea,
                status: 'draft',
                current_screen: 1,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating assessment:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            return NextResponse.json(
                { 
                    error: 'Failed to create assessment',
                    details: error.message || 'Unknown database error'
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ assessment: data }, { status: 201 });
    } catch (error) {
        console.error('Internal error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            // Get single assessment
            const { data, error } = await supabase
                .from('community_assessments')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (error) {
                return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
            }

            return NextResponse.json({ assessment: data });
        } else {
            // Get all assessments for user
            const { data, error } = await supabase
                .from('community_assessments')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });

            if (error) {
                return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
            }

            return NextResponse.json({ assessments: data });
        }
    } catch (error) {
        console.error('Internal error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
