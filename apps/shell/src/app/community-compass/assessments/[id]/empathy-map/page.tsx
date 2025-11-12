'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Sparkles, RefreshCw, Check } from 'lucide-react';
import { GlowButton, GlowCard, Stack, Text, Title, GlowTextarea } from '@/components/glow-ui';
import { EmpathyQuadrant, type EmpathyChip } from '@/components/community-compass/EmpathyQuadrant';

const QUADRANTS = [
    {
        id: 'pain',
        title: 'Pain Points',
        description: 'What challenges and frustrations do they face?',
        color: 'blue' as const,
    },
    {
        id: 'feelings',
        title: 'Feelings',
        description: 'What emotions do they experience?',
        color: 'green' as const,
    },
    {
        id: 'influences',
        title: 'Influences',
        description: 'What external factors shape their experience?',
        color: 'orange' as const,
    },
    {
        id: 'intentions',
        title: 'Intentions & Goals',
        description: 'What do they hope to achieve?',
        color: 'purple' as const,
    },
];

export default function EmpathyMapPage() {
    const params = useParams();
    const router = useRouter();
    const [quadrantChips, setQuadrantChips] = React.useState<Record<string, EmpathyChip[]>>({
        pain: [],
        feelings: [],
        influences: [],
        intentions: [],
    });
    const [generatingQuadrant, setGeneratingQuadrant] = React.useState<string | null>(null);
    const [narrative, setNarrative] = React.useState('');
    const [isGeneratingNarrative, setIsGeneratingNarrative] = React.useState(false);
    const [narrativeFeedback, setNarrativeFeedback] = React.useState('');
    const [showNarrativeFeedback, setShowNarrativeFeedback] = React.useState(false);
    const [narrativeVersion, setNarrativeVersion] = React.useState(0);
    const [narrativeWordCount, setNarrativeWordCount] = React.useState(0);

    const handleGenerate = async (quadrantId: string) => {
        setGeneratingQuadrant(quadrantId);
        try {
            const response = await fetch('/api/ai/generate-empathy-chips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessmentId: params.id,
                    quadrant: quadrantId,
                }),
            });

            if (!response.ok) throw new Error('Failed to generate');

            const data = await response.json();
            const newChips = data.chips.map((c: any) => ({
                id: c.id || Math.random().toString(36).substr(2, 9),
                text: c.text,
                isSelected: false,
            }));

            setQuadrantChips(prev => ({
                ...prev,
                [quadrantId]: [...prev[quadrantId], ...newChips],
            }));
        } catch (error) {
            console.error('Error generating chips:', error);
        } finally {
            setGeneratingQuadrant(null);
        }
    };

    const toggleChip = (quadrantId: string, chipId: string) => {
        setQuadrantChips(prev => ({
            ...prev,
            [quadrantId]: prev[quadrantId].map(c =>
                c.id === chipId ? { ...c, isSelected: !c.isSelected } : c
            ),
        }));
    };

    const handleGenerateNarrative = async (isRegeneration = false) => {
        setIsGeneratingNarrative(true);
        try {
            const selectedChips = Object.entries(quadrantChips).reduce((acc, [quadrant, chips]) => {
                acc[quadrant] = chips.filter(c => c.isSelected).map(c => c.text);
                return acc;
            }, {} as Record<string, string[]>);

            const response = await fetch('/api/ai/generate-empathy-narrative', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessmentId: params.id,
                    selectedChips,
                    ...(isRegeneration && {
                        feedback: narrativeFeedback,
                        previousNarrative: narrative,
                    }),
                }),
            });

            if (!response.ok) throw new Error('Failed to generate narrative');

            const data = await response.json();
            setNarrative(data.narrative);
            setNarrativeVersion((data.version || narrativeVersion + 1));
            setNarrativeWordCount(data.narrative.split(/\s+/).length);
            setNarrativeFeedback('');
            setShowNarrativeFeedback(false);
        } catch (error) {
            console.error('Error generating narrative:', error);
        } finally {
            setIsGeneratingNarrative(false);
        }
    };

    return (
        <div className="flex flex-col space-y-6 p-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <GlowButton variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </GlowButton>
                    <div>
                        <Title size="2xl">Empathy Map</Title>
                        <Text color="secondary" size="sm">
                            Understand the community's experiences from their perspective
                        </Text>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {QUADRANTS.map((quadrant) => (
                    <EmpathyQuadrant
                        key={quadrant.id}
                        title={quadrant.title}
                        description={quadrant.description}
                        color={quadrant.color}
                        chips={quadrantChips[quadrant.id]}
                        onToggle={(chipId) => toggleChip(quadrant.id, chipId)}
                        onGenerate={() => handleGenerate(quadrant.id)}
                        isGenerating={generatingQuadrant === quadrant.id}
                    />
                ))}
            </div>

            <GlowCard variant="elevated" padding="lg">
                <Stack spacing="md">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Empathy Narrative</h3>
                            <p className="text-sm text-muted-foreground">
                                AI-generated summary based on selected chips
                            </p>
                        </div>
                        {!narrative && (
                            <GlowButton
                                variant="default"
                                glow="medium"
                                onClick={() => handleGenerateNarrative(false)}
                                disabled={isGeneratingNarrative}
                                leftIcon={<Sparkles className="h-4 w-4" />}
                            >
                                {isGeneratingNarrative ? 'Generating...' : 'Generate Narrative'}
                            </GlowButton>
                        )}
                    </div>

                    {narrative ? (
                        <div className="space-y-4">
                            {/* Narrative Display */}
                            <div className="relative rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6">
                                <div className="absolute right-4 top-4 flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {narrativeWordCount} words
                                    </span>
                                    {narrativeVersion > 1 && (
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <span className="h-3 w-3">📝</span>
                                            v{narrativeVersion}
                                        </span>
                                    )}
                                </div>
                                <Text className="pr-24 leading-relaxed whitespace-pre-wrap">
                                    {narrative}
                                </Text>
                            </div>

                            {/* Feedback Section */}
                            {!showNarrativeFeedback ? (
                                <div className="flex gap-2">
                                    <GlowButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowNarrativeFeedback(true)}
                                        leftIcon={<Sparkles className="h-4 w-4" />}
                                    >
                                        Provide Feedback & Regenerate
                                    </GlowButton>
                                    <GlowButton
                                        variant="ghost"
                                        size="sm"
                                    >
                                        Accept Narrative
                                    </GlowButton>
                                </div>
                            ) : (
                                <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                                    <div>
                                        <Text weight="medium" size="sm">
                                            How should we improve this narrative?
                                        </Text>
                                        <Text color="secondary" size="xs">
                                            Be specific: "Add more about resilience" or "Use less clinical language"
                                        </Text>
                                    </div>
                                    <GlowTextarea
                                        value={narrativeFeedback}
                                        onChange={(e) => setNarrativeFeedback(e.target.value)}
                                        placeholder="e.g., Focus more on community strengths, make it more personal..."
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <GlowButton
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleGenerateNarrative(true)}
                                            disabled={!narrativeFeedback.trim() || isGeneratingNarrative}
                                            leftIcon={<Sparkles className="h-4 w-4" />}
                                        >
                                            {isGeneratingNarrative ? 'Regenerating...' : 'Regenerate with Feedback'}
                                        </GlowButton>
                                        <GlowButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setShowNarrativeFeedback(false);
                                                setNarrativeFeedback('');
                                            }}
                                        >
                                            Cancel
                                        </GlowButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
                            <Text color="secondary" size="sm">
                                Select chips from the quadrants above and click "Generate Narrative"
                            </Text>
                        </div>
                    )}
                </Stack>
            </GlowCard>

            <div className="flex justify-between">
                <GlowButton variant="outline" onClick={() => router.push(`/community-compass/assessments/${params.id}`)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Chips
                </GlowButton>
                <GlowButton variant="default" glow="medium" onClick={() => router.push(`/community-compass/assessments/${params.id}/needs`)}>
                    Continue to Needs
                    <ArrowRight className="ml-2 h-4 w-4" />
                </GlowButton>
            </div>
        </div>
    );
}
