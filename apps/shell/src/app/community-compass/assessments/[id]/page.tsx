'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Share2, Download, Sparkles, RefreshCw, Check, History } from 'lucide-react';
import { GlowButton, GlowCard, Stack, Text, Title, Group, GlowTextarea } from '@/components/glow-ui';
import { ChipSelector, type Chip } from '@/components/community-compass/ChipSelector';
import { cn } from '@/lib/utils';
import { useAssessment } from '@/hooks/useAssessments';
import {
    useChips,
    useCreateChips,
    useDeleteChip,
    useToggleChipSelection,
    useUpdateChipText,
    type ChipWithCategory,
} from '@/hooks/useChips';
import { toast } from '@/lib/toast';

const CATEGORIES = ['experiences', 'barriers', 'urgency', 'strengths'] as const;

export default function AssessmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const assessmentId = React.useMemo(
        () => (Array.isArray(params.id) ? params.id[0] : (params.id as string)),
        [params.id]
    );
    const { data: assessment, isLoading: assessmentLoading } = useAssessment(assessmentId);
    const { data: chips = [], isLoading: chipsLoading, isFetching: chipsFetching } = useChips(assessmentId);
    const createChips = useCreateChips(assessmentId);
    const toggleChipMutation = useToggleChipSelection(assessmentId);
    const updateChipText = useUpdateChipText(assessmentId);
    const deleteChipMutation = useDeleteChip(assessmentId);
    const [activeTab, setActiveTab] = React.useState('experiences');
    const [generatingCategories, setGeneratingCategories] = React.useState<Set<string>>(new Set());

    // Focus statement state
    const [focusStatement, setFocusStatement] = React.useState('');
    const [focusFeedback, setFocusFeedback] = React.useState('');
    const [isGeneratingFocus, setIsGeneratingFocus] = React.useState(false);
    const [showFocusFeedback, setShowFocusFeedback] = React.useState(false);
    const [focusVersion, setFocusVersion] = React.useState(0);
    const [focusWordCount, setFocusWordCount] = React.useState(0);

    React.useEffect(() => {
        if (assessment?.focus_statement) {
            setFocusStatement(assessment.focus_statement);
        }
    }, [assessment?.focus_statement]);

    const chipsByCategory = React.useMemo(() => {
        const grouped: Record<string, ChipWithCategory[]> = {
            experiences: [],
            barriers: [],
            urgency: [],
            strengths: [],
        };

        chips.forEach((chip) => {
            if (grouped[chip.category]) {
                grouped[chip.category].push(chip);
            }
        });

        return grouped;
    }, [chips]);

    const generateChipsForCategory = React.useCallback(async (category: string) => {
        setGeneratingCategories(prev => new Set(prev).add(category));
        try {
            const response = await fetch('/api/ai/generate-chips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessmentId,
                    questionCategory: category,
                    targetPopulation: assessment?.target_population,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate chips');
            }

            const data = await response.json();
            const payload = data.chips.map((c: any) => ({
                assessment_id: assessmentId,
                text: c.text,
                question_category: category,
                is_selected: false,
                is_ai_generated: true,
                is_custom: false,
                is_edited: false,
                confidence: null,
                source_citation: null,
                original_text: null,
            }));

            await createChips.mutateAsync(payload);
        } catch (error) {
            console.error('Error generating chips:', error);
            toast.error('Unable to generate chips', (error as Error).message);
        } finally {
            setGeneratingCategories(prev => {
                const next = new Set(prev);
                next.delete(category);
                return next;
            });
        }
    }, [assessment?.target_population, assessmentId, createChips]);

    React.useEffect(() => {
        if (!assessmentId || chipsFetching) return;
        const missingCategories = CATEGORIES.filter((category) => (chipsByCategory[category]?.length || 0) === 0);
        if (missingCategories.length === 0) return;

        missingCategories.forEach((category) => {
            if (!generatingCategories.has(category)) {
                generateChipsForCategory(category);
            }
        });
    }, [assessmentId, chipsByCategory, chipsFetching, generatingCategories, generateChipsForCategory]);

    if (assessmentLoading || chipsLoading) {
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

    const toggleChip = (id: string) => {
        const chip = chips.find(c => c.id === id);
        if (!chip) return;
        toggleChipMutation.mutate({ chipId: id, nextSelected: !chip.isSelected });
    };

    const handleAddCustomChip = (text: string) => {
        if (!assessmentId) return;
        createChips.mutate([
            {
                assessment_id: assessmentId,
                text,
                question_category: activeTab,
                is_selected: false,
                is_ai_generated: false,
                is_custom: true,
                is_edited: false,
                confidence: null,
                source_citation: null,
                original_text: null,
            },
        ]);
    };

    const handleEditChip = (id: string, newText: string) => {
        updateChipText.mutate({ chipId: id, text: newText });
    };

    const handleDeleteChip = (id: string) => {
        deleteChipMutation.mutate(id);
    };

    const handleGenerateFocusStatement = async () => {
        setIsGeneratingFocus(true);
        try {
            // Gather all selected chips across all categories
            const selectedByCategory: Record<string, string[]> = {};

            Object.entries(chipsByCategory).forEach(([category, chips]) => {
                const selectedChips = chips.filter(c => c.isSelected).map(c => c.text);
                if (selectedChips.length > 0) {
                    selectedByCategory[category] = selectedChips;
                }
            });

            const response = await fetch('/api/ai/generate-focus-statement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessmentId,
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
            toast.error('Unable to generate focus statement', (error as Error).message);
        } finally {
            setIsGeneratingFocus(false);
        }
    };

    const handleRegenerateFocusStatement = async () => {
        setIsGeneratingFocus(true);
        try {
            // Gather all selected chips across all categories
            const selectedByCategory: Record<string, string[]> = {};

            Object.entries(chipsByCategory).forEach(([category, chips]) => {
                const selectedChips = chips.filter(c => c.isSelected).map(c => c.text);
                if (selectedChips.length > 0) {
                    selectedByCategory[category] = selectedChips;
                }
            });

            const response = await fetch('/api/ai/generate-focus-statement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessmentId,
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
            toast.error('Unable to regenerate focus statement', (error as Error).message);
        } finally {
            setIsGeneratingFocus(false);
        }
    };

    // Check if any chips are selected across all categories
    const hasSelectedChips = Object.values(chipsByCategory).some(chips =>
        chips.some(c => c.isSelected)
    );

    return (
        <div className="flex flex-col space-y-6 p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <GlowButton variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </GlowButton>
                    <div>
                        <Title level={2}>{assessment.title}</Title>
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
                        {['experiences', 'barriers', 'urgency', 'strengths'].map((tab) => (
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
                        chips={chipsByCategory[activeTab] || []}
                        onToggle={toggleChip}
                        onGenerate={() => generateChipsForCategory(activeTab)}
                        onAddCustom={handleAddCustomChip}
                        onEdit={handleEditChip}
                        onDelete={handleDeleteChip}
                        isGenerating={generatingCategories.has(activeTab) || createChips.isPending}
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
            {hasSelectedChips && (
                <GlowCard variant="elevated" padding="lg" className="mt-6">
                    <Stack spacing="md">
                        <div className="flex items-center justify-between">
                            <div>
                                <Title level={4}>Community Focus Statement</Title>
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
                                                Be specific: &quot;Add more emphasis on youth leadership&quot; or &quot;Make it more action-oriented&quot;
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
