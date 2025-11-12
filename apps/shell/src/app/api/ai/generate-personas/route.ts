import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const generatePersonasSchema = z.object({
    assessmentId: z.string().uuid(),
    count: z.number().min(3).max(6).default(3),
});

export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const json = await request.json();
        const body = generatePersonasSchema.parse(json);

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'AI configuration missing' }, { status: 500 });
        }

        const prompt = `Generate ${body.count} diverse, realistic personas for a community assessment. Each persona should represent a different member of the community.

For each persona, provide:
- namePlaceholder (e.g., "Profile A", "Profile B")
- ageRange (e.g., "14-16 years old")
- lifeSituation (1-2 sentences)
- goals (array of 2-3 short goals)
- barriers (array of 2-3 short barriers)
- strengths (array of 2-3 short strengths)
- supportSystems (1 sentence)
- motivations (1 sentence)

Return ONLY a JSON object with a key "personas" containing an array of persona objects. No markdown, no preamble.

Example:
{
  "personas": [
    {
      "namePlaceholder": "Profile A",
      "ageRange": "14-16 years old",
      "lifeSituation": "Lives with foster family, attends local high school",
      "goals": ["Graduate high school", "Find stable housing", "Build relationships"],
      "barriers": ["Frequent moves", "Limited support network", "Academic gaps"],
      "strengths": ["Resilient", "Creative", "Good with technology"],
      "supportSystems": "Foster family and school counselor",
      "motivations": "Wants to break the cycle and create stability for future"
    }
  ]
}`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 2048,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'AI service error' }, { status: 502 });
        }

        const aiData = await response.json();
        const content = aiData.content[0].text;

        let personas = [];
        try {
            const parsed = JSON.parse(content);
            personas = parsed.personas || [];
        } catch (e) {
            console.error('Failed to parse personas:', content);
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
        }

        return NextResponse.json({ personas });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
        }
        console.error('Internal error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
