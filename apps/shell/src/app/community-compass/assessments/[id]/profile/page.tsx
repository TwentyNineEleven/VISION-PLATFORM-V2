'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Share2, Sparkles, FileText } from 'lucide-react';
import { GlowButton, GlowCard, Stack, Text, Title, Grid } from '@/components/glow-ui';
import { PersonaCard, type Persona } from '@/components/community-compass/PersonaCard';

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [personas, setPersonas] = React.useState<Persona[]>([]);
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGeneratePersonas = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/ai/generate-personas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessmentId: params.id,
                    count: 3,
                }),
            });

            if (!response.ok) throw new Error('Failed to generate personas');

            const data = await response.json();
            setPersonas(data.personas.map((p: any, idx: number) => ({
                ...p,
                id: `persona-${idx}`,
            })));
        } catch (error) {
            console.error('Error generating personas:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExport = (format: 'pdf' | 'docx' | 'markdown') => {
        // TODO: Implement export
        console.log('Exporting as', format);
    };

    return (
        <div className="flex flex-col space-y-6 p-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <GlowButton variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </GlowButton>
                    <div>
                        <Title size="2xl">Community Profile</Title>
                        <Text color="secondary" size="sm">
                            Generate personas and export your complete assessment
                        </Text>
                    </div>
                </div>
                <div className="flex gap-2">
                    <GlowButton variant="outline" leftIcon={<Share2 className="h-4 w-4" />}>
                        Share
                    </GlowButton>
                    <GlowButton variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                        Export
                    </GlowButton>
                </div>
            </div>

            <GlowCard variant="elevated" padding="lg">
                <Stack spacing="md">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Community Personas</h3>
                            <p className="text-sm text-muted-foreground">
                                AI-generated personas representing diverse community members
                            </p>
                        </div>
                        <GlowButton
                            variant="default"
                            glow="medium"
                            onClick={handleGeneratePersonas}
                            disabled={isGenerating}
                            leftIcon={<Sparkles className="h-4 w-4" />}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Personas'}
                        </GlowButton>
                    </div>

                    {personas.length > 0 ? (
                        <Grid columns={3} gap="md">
                            {personas.map((persona) => (
                                <PersonaCard key={persona.id} persona={persona} />
                            ))}
                        </Grid>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <Sparkles className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h4 className="mt-4 font-semibold">No personas yet</h4>
                            <p className="text-sm text-muted-foreground">
                                Click "Generate Personas" to create community profiles
                            </p>
                        </div>
                    )}
                </Stack>
            </GlowCard>

            <GlowCard variant="elevated" padding="lg">
                <Stack spacing="md">
                    <div>
                        <h3 className="font-semibold">Export Options</h3>
                        <p className="text-sm text-muted-foreground">
                            Download your complete community assessment
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <GlowButton
                            variant="outline"
                            onClick={() => handleExport('pdf')}
                            leftIcon={<FileText className="h-4 w-4" />}
                        >
                            Export as PDF
                        </GlowButton>
                        <GlowButton
                            variant="outline"
                            onClick={() => handleExport('docx')}
                            leftIcon={<FileText className="h-4 w-4" />}
                        >
                            Export as DOCX
                        </GlowButton>
                        <GlowButton
                            variant="outline"
                            onClick={() => handleExport('markdown')}
                            leftIcon={<FileText className="h-4 w-4" />}
                        >
                            Export as Markdown
                        </GlowButton>
                    </div>
                </Stack>
            </GlowCard>

            <div className="flex justify-between">
                <GlowButton variant="outline" onClick={() => router.push(`/community-compass/assessments/${params.id}/needs`)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Needs
                </GlowButton>
                <GlowButton variant="default" glow="medium" onClick={() => router.push('/community-compass')}>
                    Complete Assessment
                </GlowButton>
            </div>
        </div>
    );
}
