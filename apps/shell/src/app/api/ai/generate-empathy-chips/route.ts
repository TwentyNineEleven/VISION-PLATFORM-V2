import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { enforceAiRateLimit } from '@/lib/rateLimit';

const generateEmpathyChipsSchema = z.object({
    assessmentId: z.string().uuid(),
    quadrant: z.enum(['pain', 'feelings', 'influences', 'intentions']),
});

const quadrantPrompts = {
    pain: 'pain points, challenges, and frustrations',
    feelings: 'emotions and feelings',
    influences: 'external factors and influences',
    intentions: 'goals, hopes, and intentions',
};

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
        const body = generateEmpathyChipsSchema.parse(json);

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'AI configuration missing' }, { status: 500 });
        }

        // Fetch assessment to get target population details
        const { data: assessment } = await supabase
            .from('community_assessments')
            .select('target_population, geographic_area')
            .eq('id', body.assessmentId)
            .single();

        const targetPopulation = assessment?.target_population || 'the community';
        const geographicArea = assessment?.geographic_area || '';

        const quadrantDescriptions = {
            pain: {
                title: 'Pain Points & Challenges',
                instruction: 'What difficulties, frustrations, and hardships do they face daily?',
            },
            feelings: {
                title: 'Feelings & Emotions',
                instruction: 'What emotions do they experience? How do they feel about their situation?',
            },
            influences: {
                title: 'External Influences',
                instruction: 'What external factors, systems, or people shape their experience?',
            },
            intentions: {
                title: 'Goals & Intentions',
                instruction: 'What do they hope to achieve? What are their aspirations and goals?',
            },
        };

        const quadrant = quadrantDescriptions[body.quadrant as keyof typeof quadrantDescriptions];

        const prompt = `You are creating an empathy map for: ${targetPopulation}${geographicArea ? ` in ${geographicArea}` : ''}.

QUADRANT: ${quadrant.title}
FOCUS: ${quadrant.instruction}

Generate 6 authentic, first-person statements that capture this dimension of their experience.

CRITICAL REQUIREMENTS:
1. First-person perspective ONLY ("I feel...", "We experience...", "My...")
2. Each statement under 12 words
3. Avoid deficit language - focus on human experiences
4. Be specific and emotionally authentic
5. Represent diverse perspectives within this population
6. Use concrete, relatable language

Return ONLY a JSON object:
{
  "chips": ["statement 1", "statement 2", ...]
}

No markdown, no preamble - just the JSON.`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 512,
                temperature: 0.8,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('AI API error:', errorText);
            console.error('AI API response status:', response.status);
            return NextResponse.json(
                { 
                    error: 'AI service error',
                    details: errorText || 'Unknown error from AI service'
                },
                { status: 502 }
            );
        }

        const aiData = await response.json();
        const content = aiData.content[0].text;

        let chips: string[] = [];
        try {
            const parsed = JSON.parse(content);
            chips = parsed.chips || [];
        } catch (e) {
            chips = content.split('\n').filter((line: string) => line.trim().length > 0).slice(0, 6);
        }

        const res = NextResponse.json({ chips: chips.map(text => ({ text })) });
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
