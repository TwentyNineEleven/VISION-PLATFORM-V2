'use client';

import * as React from 'react';
import { User } from 'lucide-react';
import { GlowCard, Stack, Text, GlowBadge } from '@/components/glow-ui';

export interface Persona {
    id: string;
    namePlaceholder: string;
    ageRange: string;
    lifeSituation: string;
    goals: string[];
    barriers: string[];
    strengths: string[];
    supportSystems: string;
    motivations: string;
}

interface PersonaCardProps {
    persona: Persona;
}

export function PersonaCard({ persona }: PersonaCardProps) {
    return (
        <GlowCard variant="interactive" padding="lg">
            <Stack spacing="md">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">{persona.namePlaceholder}</h3>
                        <p className="text-sm text-muted-foreground">{persona.ageRange}</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-foreground">Life Situation</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{persona.lifeSituation}</p>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-foreground">Goals</h4>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        {persona.goals.map((goal, idx) => (
                            <GlowBadge key={idx} variant="success" size="sm">
                                {goal}
                            </GlowBadge>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-foreground">Barriers</h4>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        {persona.barriers.map((barrier, idx) => (
                            <GlowBadge key={idx} variant="warning" size="sm">
                                {barrier}
                            </GlowBadge>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-foreground">Strengths</h4>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        {persona.strengths.map((strength, idx) => (
                            <GlowBadge key={idx} variant="info" size="sm">
                                {strength}
                            </GlowBadge>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-foreground">Support Systems</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{persona.supportSystems}</p>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-foreground">Motivations</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{persona.motivations}</p>
                </div>
            </Stack>
        </GlowCard>
    );
}
