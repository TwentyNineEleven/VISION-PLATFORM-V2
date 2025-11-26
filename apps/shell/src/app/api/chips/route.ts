import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const assessmentId = searchParams.get('assessmentId');

        if (!assessmentId) {
            return NextResponse.json({ error: 'Assessment ID required' }, { status: 400 });
        }

        // Fetch chips for the assessment
        const { data, error } = await supabase
            .from('statement_chips')
            .select('*')
            .eq('assessment_id', assessmentId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching chips:', error);
            return NextResponse.json({ error: 'Failed to fetch chips' }, { status: 500 });
        }

        return NextResponse.json({ chips: data || [] });
    } catch (error) {
        console.error('Internal error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
