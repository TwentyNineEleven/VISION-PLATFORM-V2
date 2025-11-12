'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { GlowButton, GlowCard, GlowInput, Stack, Text } from '@/components/glow-ui';

const assessmentSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    targetPopulation: z.string().min(1, 'Target population is required'),
    geographicArea: z.string().min(1, 'Geographic area is required'),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

export default function NewAssessmentPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AssessmentFormValues>({
        resolver: zodResolver(assessmentSchema),
    });

    const onSubmit = async (data: AssessmentFormValues) => {
        try {
            const response = await fetch('/api/assessments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create assessment');
            }

            const result = await response.json();
            // Redirect to the assessment detail page to start chip generation
            router.push(`/community-compass/assessments/${result.assessment.id}`);
        } catch (error) {
            console.error('Error:', error);
            // TODO: Show error toast
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-8 p-8">
            <div className="flex items-center gap-4">
                <GlowButton
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-4 w-4" />
                </GlowButton>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">New Assessment</h1>
                    <p className="text-muted-foreground">
                        Define the scope and focus of your community needs assessment.
                    </p>
                </div>
            </div>

            <GlowCard variant="elevated" padding="xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Stack spacing="lg">
                        <GlowInput
                            label="Assessment Title"
                            placeholder="e.g., Youth Services Community Assessment"
                            error={errors.title?.message}
                            {...register('title')}
                            autoFocus
                        />

                        <GlowInput
                            label="Target Population"
                            placeholder="e.g., Youth ages 14-18 in foster care"
                            error={errors.targetPopulation?.message}
                            {...register('targetPopulation')}
                        />

                        <GlowInput
                            label="Geographic Area"
                            placeholder="e.g., Washington, DC"
                            error={errors.geographicArea?.message}
                            {...register('geographicArea')}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <GlowButton
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </GlowButton>
                            <GlowButton
                                type="submit"
                                variant="default"
                                glow="medium"
                                leftIcon={<Save className="h-4 w-4" />}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Assessment'}
                            </GlowButton>
                        </div>
                    </Stack>
                </form>
            </GlowCard>
        </div>
    );
}
