import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const generateChipsSchema = z.object({
    assessmentId: z.string().uuid(),
    questionCategory: z.string().min(1),
    targetPopulation: z.string().min(1),
    existingContext: z.any().optional(),
});

export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const json = await request.json();
        const body = generateChipsSchema.parse(json);

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

        // Category-specific prompts for better context
        const categoryContext = {
            experiences: 'lived experiences, daily realities, and what life is like for',
            barriers: 'challenges, obstacles, and barriers faced by',
            urgency: 'urgent needs, pressing concerns, and time-sensitive issues affecting',
            aspirations: 'hopes, dreams, goals, and aspirations of',
            strengths: 'strengths, assets, resilience, and positive qualities of',
        };

        const context = categoryContext[body.questionCategory as keyof typeof categoryContext] || 'perspectives of';

        const prompt = `You are an expert community researcher conducting a needs assessment for: ${targetPopulation}${geographicArea ? ` in ${geographicArea}` : ''}.

Generate 8 diverse, authentic first-person statements representing the ${context} this population.

CRITICAL REQUIREMENTS:
1. First-person perspective ONLY ("I...", "We...", "My...")
2. Each statement must be under 15 words
3. Avoid ALL deficit-based or stereotypical language (no "at-risk", "disadvantaged", "underprivileged")
4. Focus on HUMAN experiences, not labels
5. Represent diverse perspectives within this population
6. Be specific and concrete, not generic
7. Use strength-based, asset-focused language where possible

CATEGORY: ${body.questionCategory}
TARGET POPULATION: ${targetPopulation}

Return ONLY a JSON object with this exact structure:
{
  "chips": ["statement 1", "statement 2", ...]
}

No markdown formatting, no preamble, no explanation - just the JSON.`;

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
                temperature: 0.8, // Higher temperature for more diversity
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('AI API error:', errorText);
            return NextResponse.json({ error: 'AI service error' }, { status: 502 });
        }

        const aiData = await response.json();
        const content = aiData.content[0].text;

        let chips: string[] = [];
        try {
            const parsed = JSON.parse(content);
            chips = parsed.chips || [];
        } catch (e) {
            console.error('Failed to parse AI response:', content);
            // Fallback parsing if JSON is messy
            chips = content.split('\n').filter((line: string) => line.trim().length > 0).map((line: string) => line.replace(/^[-*•]\s*/, '').trim()).slice(0, 8);
        }

        // Store in DB
        const chipsToInsert = chips.map(text => ({
            assessment_id: body.assessmentId,
            text,
            question_category: body.questionCategory,
            is_ai_generated: true,
            is_selected: false,
        }));

        if (chipsToInsert.length > 0) {
            const { error: dbError } = await supabase
                .from('statement_chips')
                .insert(chipsToInsert);

            if (dbError) {
                console.error('DB Insert error:', dbError);
                return NextResponse.json({ error: 'Failed to save chips' }, { status: 500 });
            }
        }

        return NextResponse.json({ chips: chipsToInsert });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
        }
        console.error('Internal error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
