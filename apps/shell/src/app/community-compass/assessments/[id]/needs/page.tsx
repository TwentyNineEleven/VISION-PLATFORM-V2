'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Plus, Sparkles } from 'lucide-react';
import { GlowButton, GlowCard, GlowInput, GlowSelect, GlowTextarea, Stack, Text, Title, GlowModal } from '@/components/glow-ui';
import { NeedCard, type Need } from '@/components/community-compass/NeedCard';
import { useNeeds, useCreateNeed, useUpdateNeed, useDeleteNeed } from '@/hooks/useNeeds';
import { toast } from '@/lib/toast';

const CATEGORIES = [
    { value: 'service', label: 'Service' },
    { value: 'resource', label: 'Resource' },
    { value: 'policy', label: 'Policy' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'support', label: 'Support' },
];

const LEVELS = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
];

const EVIDENCE_LEVELS = [
    { value: 'strong', label: 'Strong' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'limited', label: 'Limited' },
    { value: 'anecdotal', label: 'Anecdotal' },
];

export default function NeedsAssessmentPage() {
    const params = useParams();
    const router = useRouter();
    const assessmentId = React.useMemo(
        () => (Array.isArray(params.id) ? params.id[0] : (params.id as string)),
        [params.id]
    );
    const { data: needs = [], isLoading: needsLoading } = useNeeds(assessmentId);
    const createNeed = useCreateNeed(assessmentId);
    const updateNeed = useUpdateNeed(assessmentId);
    const deleteNeed = useDeleteNeed(assessmentId);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingNeed, setEditingNeed] = React.useState<Need | null>(null);
    const [formData, setFormData] = React.useState({
        title: '',
        description: '',
        category: 'service',
        urgencyLevel: 'medium',
        impactLevel: 'medium',
        evidenceLevel: 'moderate',
    });

    const handleSave = async () => {
        try {
            const payload: Omit<Need, 'id'> = {
                ...formData,
                urgencyLevel: formData.urgencyLevel as Need['urgencyLevel'],
                impactLevel: formData.impactLevel as Need['impactLevel'],
                evidenceLevel: formData.evidenceLevel as Need['evidenceLevel'],
            };

            if (editingNeed) {
                await updateNeed.mutateAsync({ ...payload, id: editingNeed.id });
            } else {
                await createNeed.mutateAsync(payload);
            }

            setIsModalOpen(false);
            setEditingNeed(null);
            setFormData({
                title: '',
                description: '',
                category: 'service',
                urgencyLevel: 'medium',
                impactLevel: 'medium',
                evidenceLevel: 'moderate',
            });
            toast.success('Need saved');
        } catch (error) {
            console.error('Error saving need:', error);
            toast.error('Unable to save need', (error as Error).message);
        }
    };

    const handleEdit = (need: Need) => {
        setEditingNeed(need);
        setFormData({
            title: need.title,
            description: need.description || '',
            category: need.category,
            urgencyLevel: need.urgencyLevel,
            impactLevel: need.impactLevel,
            evidenceLevel: need.evidenceLevel,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteNeed.mutate(id, {
            onError: (error) => {
                console.error('Error deleting need:', error);
                toast.error('Unable to delete need', (error as Error).message);
            },
        });
    };

    if (needsLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-muted-foreground">Loading needs...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 p-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <GlowButton variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </GlowButton>
                    <div>
                        <Title level={2}>Needs Assessment</Title>
                        <Text color="secondary" size="sm">
                            Identify and prioritize community needs
                        </Text>
                    </div>
                </div>
                <div className="flex gap-2">
                    <GlowButton variant="outline" leftIcon={<Sparkles className="h-4 w-4" />}>
                        Suggest Needs (AI)
                    </GlowButton>
                    <GlowButton variant="default" glow="medium" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
                        Add Need
                    </GlowButton>
                </div>
            </div>

            {needs.length > 0 ? (
                <div className="grid gap-4">
                    {needs.map((need) => (
                        <NeedCard
                            key={need.id}
                            need={need}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <GlowCard variant="flat" padding="xl" className="text-center">
                    <Stack spacing="md" align="center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Plus className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="font-semibold">No needs added yet</h3>
                            <p className="text-sm text-muted-foreground">
                                Start by adding community needs or use AI to suggest them
                            </p>
                        </div>
                        <GlowButton variant="default" onClick={() => setIsModalOpen(true)}>
                            Add First Need
                        </GlowButton>
                    </Stack>
                </GlowCard>
            )}

            <div className="flex justify-between">
                <GlowButton variant="outline" onClick={() => router.push(`/community-compass/assessments/${assessmentId}/empathy-map`)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Empathy Map
                </GlowButton>
                <GlowButton variant="default" glow="medium" onClick={() => router.push(`/community-compass/assessments/${assessmentId}/profile`)}>
                    Continue to Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                </GlowButton>
            </div>

            <GlowModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title={editingNeed ? 'Edit Need' : 'Add Community Need'}
                size="lg"
            >
                <Stack spacing="md">
                    <GlowInput
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., After-school programs for youth"
                    />

                    <GlowTextarea
                        label="Description (Optional)"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide additional context..."
                        rows={3}
                    />

                    <GlowSelect
                        label="Category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </GlowSelect>

                    <div className="grid grid-cols-3 gap-4">
                        <GlowSelect
                            label="Urgency"
                            value={formData.urgencyLevel}
                            onChange={(e) => setFormData(prev => ({ ...prev, urgencyLevel: e.target.value }))}
                        >
                            {LEVELS.map((level) => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </GlowSelect>
                        <GlowSelect
                            label="Impact"
                            value={formData.impactLevel}
                            onChange={(e) => setFormData(prev => ({ ...prev, impactLevel: e.target.value }))}
                        >
                            {LEVELS.map((level) => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </GlowSelect>
                        <GlowSelect
                            label="Evidence"
                            value={formData.evidenceLevel}
                            onChange={(e) => setFormData(prev => ({ ...prev, evidenceLevel: e.target.value }))}
                        >
                            {EVIDENCE_LEVELS.map((level) => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </GlowSelect>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <GlowButton variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </GlowButton>
                        <GlowButton variant="default" glow="medium" onClick={handleSave}>
                            {editingNeed ? 'Update' : 'Add'} Need
                        </GlowButton>
                    </div>
                </Stack>
            </GlowModal>
        </div>
    );
}
