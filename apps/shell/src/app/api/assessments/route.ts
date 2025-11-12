import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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
