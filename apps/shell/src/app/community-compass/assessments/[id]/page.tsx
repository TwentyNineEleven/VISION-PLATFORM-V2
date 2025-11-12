'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Share2, Download, Sparkles, RefreshCw, Check, History } from 'lucide-react';
import { GlowButton, GlowCard, Stack, Text, Title, Group, GlowTextarea } from '@/components/glow-ui';
import { ChipSelector, type Chip } from '@/components/community-compass/ChipSelector';
import { cn } from '@/lib/utils';

export default function AssessmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = React.useState('experiences');
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [chips, setChips] = React.useState<Chip[]>([]);
    const [assessment, setAssessment] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    // Focus statement state
    const [focusStatement, setFocusStatement] = React.useState('');
    const [focusFeedback, setFocusFeedback] = React.useState('');
    const [isGeneratingFocus, setIsGeneratingFocus] = React.useState(false);
    const [showFocusFeedback, setShowFocusFeedback] = React.useState(false);
    const [focusVersion, setFocusVersion] = React.useState(0);
    const [focusWordCount, setFocusWordCount] = React.useState(0);

    React.useEffect(() => {
        if (params.id) {
            fetchAssessment();
        }
    }, [params.id]);

    const fetchAssessment = async () => {
        try {
            const response = await fetch(`/api/assessments?id=${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setAssessment(data.assessment);
            }
        } catch (error) {
            console.error('Error fetching assessment:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-muted-foreground">Loading assessment...</p>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">Assessment not found</h2>
                    <GlowButton className="mt-4" onClick={() => router.push('/community-compass')}>
                        Back to Dashboard
                    </GlowButton>
                </div>
            </div>
        );
    }

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/ai/generate-chips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessmentId: params.id,
                    questionCategory: activeTab,
                    targetPopulation: assessment.target_population,
                }),
            });

            if (!response.ok) throw new Error('Failed to generate');

            const data = await response.json();
            // Merge new chips
            const newChips = data.chips.map((c: any) => ({
                id: c.id || Math.random().toString(36).substr(2, 9), // Fallback ID if DB doesn't return one immediately (though it should)
                text: c.text,
                isSelected: false,
                isAiGenerated: true,
            }));

            setChips(prev => [...prev, ...newChips]);
        } catch (error) {
            console.error('Error generating chips:', error);
            // TODO: Toast error
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleChip = (id: string) => {
        setChips(prev => prev.map(c =>
            c.id === id ? { ...c, isSelected: !c.isSelected } : c
        ));
    };

    const handleGenerateFocusStatement = async () => {
        setIsGeneratingFocus(true);
        try {
            const selectedByCategory = chips
                .filter((c: Chip) => c.isSelected)
                .reduce((acc: Record<string, string[]>, chip: Chip) => {
                    const category = activeTab; // In real app, track chip category
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(chip.text);
                    return acc;
                }, {});

            const response = await fetch('/api/ai/generate-focus-statement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessmentId: params.id,
                    selectedChips: selectedByCategory,
                }),
            });

            if (!response.ok) throw new Error('Failed to generate');

            const data = await response.json();
            setFocusStatement(data.focusStatement);
            setFocusVersion(data.version);
            setFocusWordCount(data.wordCount);
        } catch (error) {
            console.error('Error generating focus statement:', error);
        } finally {
            setIsGeneratingFocus(false);
        }
    };

    const handleRegenerateFocusStatement = async () => {
        setIsGeneratingFocus(true);
        try {
            const selectedByCategory = chips
                .filter((c: Chip) => c.isSelected)
                .reduce((acc: Record<string, string[]>, chip: Chip) => {
                    const category = activeTab;
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(chip.text);
                    return acc;
                }, {});

            const response = await fetch('/api/ai/generate-focus-statement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessmentId: params.id,
                    selectedChips: selectedByCategory,
                    feedback: focusFeedback,
                    previousStatement: focusStatement,
                }),
            });

            if (!response.ok) throw new Error('Failed to regenerate');

            const data = await response.json();
            setFocusStatement(data.focusStatement);
            setFocusVersion(data.version);
            setFocusWordCount(data.wordCount);
            setFocusFeedback('');
            setShowFocusFeedback(false);
        } catch (error) {
            console.error('Error regenerating focus statement:', error);
        } finally {
            setIsGeneratingFocus(false);
        }
    };

    const currentChips = chips.filter(c => true); // In real app, filter by category if we store all in one list

    return (
        <div className="flex flex-col space-y-6 p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <GlowButton variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </GlowButton>
                    <div>
                        <Title size="2xl">{assessment.title}</Title>
                        <Text color="secondary" size="sm">
                            {assessment.target_population} • {assessment.geographic_area}
                        </Text>
                    </div>
                </div>
                <Group>
                    <GlowButton variant="outline" size="sm" leftIcon={<Share2 className="h-4 w-4" />}>
                        Share
                    </GlowButton>
                    <GlowButton variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                        Export
                    </GlowButton>
                    <GlowButton variant="default" glow="medium" leftIcon={<Save className="h-4 w-4" />}>
                        Save Changes
                    </GlowButton>
                </Group>
            </div>

            {/* Main Content */}
            <GlowCard variant="elevated" padding="none" className="overflow-hidden">
                <div className="border-b border-border">
                    <div className="flex gap-6 px-6 pt-4">
                        {['experiences', 'barriers', 'urgency', 'aspirations', 'strengths'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    'border-b-2 px-4 py-2.5 text-sm font-medium transition-all',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                    activeTab === tab
                                        ? 'border-primary text-foreground shadow-glow-primary-sm'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    <ChipSelector
                        categoryLabel={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        chips={currentChips} // In reality, filter by activeTab
                        onToggle={toggleChip}
                        onGenerate={handleGenerate}
                        isGenerating={isGenerating}
                    />
                </div>
            </GlowCard>

            {/* Navigation */}
            <div className="flex justify-end">
                <GlowButton
                    variant="default"
                    glow="medium"
                    onClick={() => router.push(`/community-compass/assessments/${params.id}/empathy-map`)}
                    rightIcon={<ArrowLeft className="h-4 w-4 rotate-180" />}
                >
                    Continue to Empathy Map
                </GlowButton>
            </div>

            {/* Focus Statement Section */}
            {chips.some(c => c.isSelected) && (
                <GlowCard variant="elevated" padding="lg" className="mt-6">
                    <Stack spacing="md">
                        <div className="flex items-center justify-between">
                            <div>
                                <Title size="lg">Community Focus Statement</Title>
                                <Text color="secondary" size="sm">
                                    AI-generated synthesis of selected insights
                                </Text>
                            </div>
                            {!focusStatement && (
                                <GlowButton
                                    variant="default"
                                    glow="medium"
                                    onClick={handleGenerateFocusStatement}
                                    disabled={isGeneratingFocus}
                                    leftIcon={<Sparkles className="h-4 w-4" />}
                                >
                                    {isGeneratingFocus ? 'Generating...' : 'Generate Focus Statement'}
                                </GlowButton>
                            )}
                        </div>

                        {!focusStatement && !isGeneratingFocus && (
                            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
                                <Text color="secondary" size="sm">
                                    Select chips from the categories above to generate a focus statement
                                </Text>
                            </div>
                        )}

                        {focusStatement && (
                            <div className="space-y-4">
                                {/* Statement Display */}
                                <div className="relative rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6">
                                    <div className="absolute right-4 top-4 flex items-center gap-2">
                                        <span className={cn(
                                            'text-xs font-medium',
                                            focusWordCount < 150 || focusWordCount > 200 ? 'text-orange-500' : 'text-green-500'
                                        )}>
                                            {focusWordCount} words
                                        </span>
                                        {focusVersion > 1 && (
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <History className="h-3 w-3" />
                                                v{focusVersion}
                                            </span>
                                        )}
                                    </div>
                                    <Text className="pr-24 leading-relaxed">
                                        {focusStatement}
                                    </Text>
                                </div>

                                {/* Feedback Section */}
                                {!showFocusFeedback ? (
                                    <Group spacing="sm">
                                        <GlowButton
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowFocusFeedback(true)}
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
                                    </Group>
                                ) : (
                                    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                                        <div>
                                            <Text weight="medium" size="sm">
                                                How should we improve this focus statement?
                                            </Text>
                                            <Text color="secondary" size="xs">
                                                Be specific: "Add more emphasis on youth leadership" or "Make it more action-oriented"
                                            </Text>
                                        </div>
                                        <GlowTextarea
                                            value={focusFeedback}
                                            onChange={(e) => setFocusFeedback(e.target.value)}
                                            placeholder="e.g., Focus more on community strengths, use less clinical language..."
                                            rows={3}
                                        />
                                        <Group spacing="sm">
                                            <GlowButton
                                                variant="default"
                                                size="sm"
                                                onClick={handleRegenerateFocusStatement}
                                                disabled={!focusFeedback.trim() || isGeneratingFocus}
                                                leftIcon={<Sparkles className="h-4 w-4" />}
                                            >
                                                {isGeneratingFocus ? 'Regenerating...' : 'Regenerate with Feedback'}
                                            </GlowButton>
                                            <GlowButton
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setShowFocusFeedback(false);
                                                    setFocusFeedback('');
                                                }}
                                            >
                                                Cancel
                                            </GlowButton>
                                        </Group>
                                    </div>
                                )}
                            </div>
                        )}
                    </Stack>
                </GlowCard>
            )}
        </div>
    );
}
