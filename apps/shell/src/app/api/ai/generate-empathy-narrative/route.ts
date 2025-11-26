import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { enforceAiRateLimit } from '@/lib/rateLimit';

const generateNarrativeSchema = z.object({
    assessmentId: z.string().uuid(),
    selectedChips: z.record(z.array(z.string())),
    feedback: z.string().optional(),
    previousNarrative: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const rate = await enforceAiRateLimit(request, user.id);
        if (!rate.success) return rate.response;

        const json = await request.json();
        const body = generateNarrativeSchema.parse(json);

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'AI configuration missing' }, { status: 500 });
        }

        // Fetch assessment details
        const { data: assessment } = await supabase
            .from('community_assessments')
            .select('target_population, geographic_area')
            .eq('id', body.assessmentId)
            .single();

        const targetPopulation = assessment?.target_population || 'the community';
        const geographicArea = assessment?.geographic_area || '';

        const chipsText = Object.entries(body.selectedChips)
            .map(([quadrant, chips]) => `${quadrant.toUpperCase()}:\n${(chips as string[]).map(c => `- ${c}`).join('\n')}`)
            .join('\n\n');

        let prompt = `You are writing an empathy narrative for: ${targetPopulation}${geographicArea ? ` in ${geographicArea}` : ''}.

Based on these empathy map insights from community members:

${chipsText}

Write a cohesive 2-3 paragraph narrative that:
1. Captures their lived experience from THEIR perspective
2. Weaves together their pain points, feelings, influences, and aspirations
3. Uses compassionate, human-centered language
4. Avoids deficit-based framing or stereotypes
5. Highlights their resilience and humanity
6. Flows naturally as a story, not a list

Write in third person ("They...", "Community members...") but maintain their authentic voice.`;

        // If this is a regeneration with feedback
        if (body.feedback && body.previousNarrative) {
            prompt += `\n\n**Previous Narrative:**
${body.previousNarrative}

**User Feedback for Improvement:**
${body.feedback}

Please revise the narrative based on this feedback while maintaining the core requirements above.`;
        }

        prompt += `\n\nReturn ONLY the narrative text - no preamble, no markdown, no labels.`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1024,
                temperature: 0.7,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'AI service error' }, { status: 502 });
        }

        const aiData = await response.json();
        const narrative = aiData.content[0].text.trim();

        const res = NextResponse.json({
            narrative,
            version: body.feedback ? 2 : 1, // Increment if feedback provided
        });
        Object.entries(rate.headers).forEach(([key, value]) => res.headers.set(key, value));
        return res;

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
        }
        console.error('Internal error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
