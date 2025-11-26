'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Map, FileText, Users, ArrowRight } from 'lucide-react';
import { GlowButton, GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, Grid, Stack, Text, GlowBadge } from '@/components/glow-ui';

export default function CommunityCompassPage() {
    const router = useRouter();
    const [assessments, setAssessments] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchAssessments();
    }, []);

    const fetchAssessments = async () => {
        try {
            const response = await fetch('/api/assessments');
            if (response.ok) {
                const data = await response.json();
                setAssessments(data.assessments || []);
            }
        } catch (error) {
            console.error('Error fetching assessments:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 p-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Community Compass</h1>
                    <p className="text-muted-foreground">
                        Gather community voice, analyze needs, and build data-driven profiles.
                    </p>
                </div>
                <GlowButton
                    variant="default"
                    glow="medium"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => router.push('/community-compass/assessments/new')}
                >
                    New Assessment
                </GlowButton>
            </div>

            <Grid columns={3} gap="lg">
                {loading ? (
                    <div className="col-span-3 text-center py-12">
                        <p className="text-muted-foreground">Loading assessments...</p>
                    </div>
                ) : assessments.length > 0 ? (
                    <>
                        {assessments.map((assessment) => (
                            <GlowCard key={assessment.id} variant="interactive" padding="lg" className="col-span-1">
                                <GlowCardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <GlowBadge
                                            variant={assessment.status === 'completed' ? 'success' : assessment.status === 'in_progress' ? 'info' : 'secondary'}
                                            size="sm"
                                        >
                                            {assessment.status}
                                        </GlowBadge>
                                    </div>
                                    <GlowCardTitle className="mt-4">{assessment.title}</GlowCardTitle>
                                </GlowCardHeader>
                                <GlowCardContent>
                                    <Stack spacing="sm">
                                        <Text size="sm" color="secondary">Target: {assessment.target_population}</Text>
                                        <Text size="sm" color="secondary">Area: {assessment.geographic_area}</Text>
                                        <Text size="sm" color="secondary">
                                            Updated: {new Date(assessment.updated_at).toLocaleDateString()}
                                        </Text>
                                        <div className="mt-4 flex justify-end">
                                            <GlowButton
                                                variant="ghost"
                                                size="sm"
                                                rightIcon={<ArrowRight className="h-4 w-4" />}
                                                onClick={() => router.push(`/community-compass/assessments/${assessment.id}`)}
                                            >
                                                Continue
                                            </GlowButton>
                                        </div>
                                    </Stack>
                                </GlowCardContent>
                            </GlowCard>
                        ))}
                        <GlowCard variant="flat" padding="lg" className="col-span-1 border-dashed">
                            <div className="flex h-full flex-col items-center justify-center space-y-4 py-8 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                    <Plus className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold">Create New Assessment</h3>
                                    <p className="text-sm text-muted-foreground">Start a new community needs assessment</p>
                                </div>
                                <GlowButton variant="outline" size="sm" onClick={() => router.push('/community-compass/assessments/new')}>
                                    Get Started
                                </GlowButton>
                            </div>
                        </GlowCard>
                    </>
                ) : (
                    <div className="col-span-3">
                        <GlowCard variant="flat" padding="xl" className="text-center">
                            <Stack spacing="md" align="center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">No assessments yet</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Create your first community assessment to get started
                                    </p>
                                </div>
                                <GlowButton variant="default" onClick={() => router.push('/community-compass/assessments/new')}>
                                    Create First Assessment
                                </GlowButton>
                            </Stack>
                        </GlowCard>
                    </div>
                )}
            </Grid>

            <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
                <GlowCard variant="flat" padding="none">
                    <div className="divide-y divide-border">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Map className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Updated Focus Statement</p>
                                        <p className="text-xs text-muted-foreground">Youth Services Assessment • 2h ago</p>
                                    </div>
                                </div>
                                <GlowButton variant="ghost" size="sm">View</GlowButton>
                            </div>
                        ))}
                    </div>
                </GlowCard>
            </div>
        </div>
    );
}
