'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Plus, Sparkles } from 'lucide-react';
import { GlowButton, GlowCard, GlowInput, GlowSelect, GlowTextarea, Stack, Text, Title, GlowModal } from '@/components/glow-ui';
import { NeedCard, type Need } from '@/components/community-compass/NeedCard';

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
    const [needs, setNeeds] = React.useState<Need[]>([]);
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
        // TODO: API call to save need
        const newNeed: Need = {
            id: editingNeed?.id || Math.random().toString(36).substr(2, 9),
            ...formData,
            urgencyLevel: formData.urgencyLevel as Need['urgencyLevel'],
            impactLevel: formData.impactLevel as Need['impactLevel'],
            evidenceLevel: formData.evidenceLevel as Need['evidenceLevel'],
        };

        if (editingNeed) {
            setNeeds(prev => prev.map(n => n.id === editingNeed.id ? newNeed : n));
        } else {
            setNeeds(prev => [...prev, newNeed]);
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
        setNeeds(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="flex flex-col space-y-6 p-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <GlowButton variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </GlowButton>
                    <div>
                        <Title size="2xl">Needs Assessment</Title>
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
                <GlowButton variant="outline" onClick={() => router.push(`/community-compass/assessments/${params.id}/empathy-map`)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Empathy Map
                </GlowButton>
                <GlowButton variant="default" glow="medium" onClick={() => router.push(`/community-compass/assessments/${params.id}/profile`)}>
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
                        options={CATEGORIES}
                    />

                    <div className="grid grid-cols-3 gap-4">
                        <GlowSelect
                            label="Urgency"
                            value={formData.urgencyLevel}
                            onChange={(e) => setFormData(prev => ({ ...prev, urgencyLevel: e.target.value }))}
                            options={LEVELS}
                        />
                        <GlowSelect
                            label="Impact"
                            value={formData.impactLevel}
                            onChange={(e) => setFormData(prev => ({ ...prev, impactLevel: e.target.value }))}
                            options={LEVELS}
                        />
                        <GlowSelect
                            label="Evidence"
                            value={formData.evidenceLevel}
                            onChange={(e) => setFormData(prev => ({ ...prev, evidenceLevel: e.target.value }))}
                            options={EVIDENCE_LEVELS}
                        />
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
