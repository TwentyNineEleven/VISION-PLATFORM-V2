'use client';

import * as React from 'react';
import { Sparkles, RefreshCw, History, Check } from 'lucide-react';
import { GlowButton, GlowCard, GlowTextarea, Stack, Text } from '@/components/glow-ui';
import { cn } from '@/lib/utils';

export interface FocusStatementCardProps {
    assessmentId: string;
    selectedChips: Record<string, string[]>;
    onStatementGenerated?: (statement: string) => void;
}

export function FocusStatementCard({
    assessmentId,
    selectedChips,
    onStatementGenerated,
}: FocusStatementCardProps) {
    const [statement, setStatement] = React.useState('');
    const [feedback, setFeedback] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [showFeedback, setShowFeedback] = React.useState(false);
    const [version, setVersion] = React.useState(0);
    const [wordCount, setWordCount] = React.useState(0);

    const hasSelectedChips = Object.values(selectedChips).some(chips => chips.length > 0);

    const handleGenerate = async (isRegeneration = false) => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/ai/generate-focus-statement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessmentId,
                    selectedChips,
                    ...(isRegeneration && {
                        feedback,
                        previousStatement: statement,
                    }),
                }),
            });

            if (!response.ok) throw new Error('Failed to generate');

            const data = await response.json();
            setStatement(data.focusStatement);
            setVersion(data.version);
            setWordCount(data.wordCount);
            setFeedback('');
            setShowFeedback(false);
            onStatementGenerated?.(data.focusStatement);
        } catch (error) {
            console.error('Error generating focus statement:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const wordCountColor = wordCount < 150 ? 'text-orange-500' : wordCount > 200 ? 'text-orange-500' : 'text-green-500';

    return (
        <GlowCard variant="elevated" padding="lg" className="mt-6">
            <Stack spacing="md">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Community Focus Statement</h3>
                        <p className="text-sm text-muted-foreground">
                            AI-generated synthesis of selected insights
                        </p>
                    </div>
                    {!statement && (
                        <GlowButton
                            variant="default"
                            glow="medium"
                            onClick={() => handleGenerate(false)}
                            disabled={!hasSelectedChips || isGenerating}
                            leftIcon={<Sparkles className="h-4 w-4" />}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Focus Statement'}
                        </GlowButton>
                    )}
                </div>

                {!hasSelectedChips && !statement && (
                    <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            Select chips from the categories above to generate a focus statement
                        </p>
                    </div>
                )}

                {statement && (
                    <div className="space-y-4">
                        {/* Statement Display */}
                        <div className="relative rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6">
                            <div className="absolute right-4 top-4 flex items-center gap-2">
                                <span className={cn('text-xs font-medium', wordCountColor)}>
                                    {wordCount} words
                                </span>
                                {version > 1 && (
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <History className="h-3 w-3" />
                                        v{version}
                                    </span>
                                )}
                            </div>
                            <p className="pr-24 text-sm leading-relaxed text-foreground">
                                {statement}
                            </p>
                        </div>

                        {/* Feedback Section */}
                        {!showFeedback ? (
                            <div className="flex gap-2">
                                <GlowButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowFeedback(true)}
                                    leftIcon={<RefreshCw className="h-4 w-4" />}
                                >
                                    Provide Feedback & Regenerate
                                </GlowButton>
                                <GlowButton
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<Check className="h-4 w-4" />}
                                >
                                    Accept Statement
                                </GlowButton>
                            </div>
                        ) : (
                            <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                                <div>
                                    <label className="text-sm font-medium">
                                        How should we improve this focus statement?
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        Be specific: "Add more emphasis on youth leadership" or "Make it more action-oriented"
                                    </p>
                                </div>
                                <GlowTextarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="e.g., Focus more on community strengths, use less clinical language..."
                                    rows={3}
                                />
                                <div className="flex gap-2">
                                    <GlowButton
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleGenerate(true)}
                                        disabled={!feedback.trim() || isGenerating}
                                        leftIcon={<Sparkles className="h-4 w-4" />}
                                    >
                                        {isGenerating ? 'Regenerating...' : 'Regenerate with Feedback'}
                                    </GlowButton>
                                    <GlowButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setShowFeedback(false);
                                            setFeedback('');
                                        }}
                                    >
                                        Cancel
                                    </GlowButton>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Stack>
        </GlowCard>
    );
}
