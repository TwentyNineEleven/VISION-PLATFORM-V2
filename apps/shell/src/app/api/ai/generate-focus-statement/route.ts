import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { enforceAiRateLimit } from '@/lib/rateLimit';

const generateFocusStatementSchema = z.object({
    assessmentId: z.string().uuid(),
    selectedChips: z.record(z.array(z.string())),
    feedback: z.string().optional(),
    previousStatement: z.string().optional(),
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
        const body = generateFocusStatementSchema.parse(json);

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'AI configuration missing' }, { status: 500 });
        }

        // Fetch assessment details
        const { data: assessment } = await supabase
            .from('community_assessments')
            .select('target_population, geographic_area, title')
            .eq('id', body.assessmentId)
            .single();

        const targetPopulation = assessment?.target_population || 'the community';
        const geographicArea = assessment?.geographic_area || '';
        const title = assessment?.title || 'Community Assessment';

        // Format selected chips by category
        const chipsText = Object.entries(body.selectedChips)
            .map(([category, chips]) => {
                const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
                return `**${categoryLabel}:**\n${(chips as string[]).map(c => `- ${c}`).join('\n')}`;
            })
            .join('\n\n');

        let prompt = `You are writing a community focus statement for: ${targetPopulation}${geographicArea ? ` in ${geographicArea}` : ''}.

**Assessment Title:** ${title}

**Selected Community Insights:**
${chipsText}

Write a compelling, actionable focus statement (150-200 words) that:
1. Synthesizes the key themes from the selected insights
2. Centers the community's voice and lived experience
3. Identifies 2-3 core priorities or focus areas
4. Uses strength-based, asset-focused language
5. Avoids deficit framing or stereotypes
6. Provides clear direction for action
7. Reflects the community's aspirations and needs

The focus statement should be suitable for grant proposals, strategic planning, and community presentations.`;

        // If this is a regeneration with feedback
        if (body.feedback && body.previousStatement) {
            prompt += `\n\n**Previous Focus Statement:**
${body.previousStatement}

**User Feedback for Improvement:**
${body.feedback}

Please revise the focus statement based on this feedback while maintaining the core requirements above.`;
        }

        prompt += `\n\nReturn ONLY the focus statement text - no preamble, no markdown formatting, no labels.`;

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
        const focusStatement = aiData.content[0].text.trim();

        // Update assessment with new focus statement
        const { data: currentAssessment } = await supabase
            .from('community_assessments')
            .select('focus_statement_version, focus_statement_feedback')
            .eq('id', body.assessmentId)
            .single();

        const newVersion = (currentAssessment?.focus_statement_version || 0) + 1;
        const feedbackHistory: Array<{
            version: number;
            feedback: string;
            previousStatement: string;
            timestamp: string;
        }> = Array.isArray(currentAssessment?.focus_statement_feedback)
            ? currentAssessment.focus_statement_feedback as Array<{
                version: number;
                feedback: string;
                previousStatement: string;
                timestamp: string;
            }>
            : [];

        if (body.feedback && body.previousStatement) {
            feedbackHistory.push({
                version: newVersion - 1,
                feedback: body.feedback,
                previousStatement: body.previousStatement,
                timestamp: new Date().toISOString(),
            });
        }

        await supabase
            .from('community_assessments')
            .update({
                focus_statement: focusStatement,
                focus_statement_version: newVersion,
                focus_statement_feedback: feedbackHistory,
                updated_at: new Date().toISOString(),
            })
            .eq('id', body.assessmentId);

        const res = NextResponse.json({
            focusStatement,
            version: newVersion,
            wordCount: focusStatement.split(/\s+/).length,
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
