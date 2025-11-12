'use client';

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { GlowButton, GlowBadge, GlowCard, Stack, Text } from '@/components/glow-ui';
import { cn } from '@/lib/utils';

export interface Need {
    id: string;
    title: string;
    description?: string;
    category: string;
    urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
    impactLevel: 'critical' | 'high' | 'medium' | 'low';
    evidenceLevel: 'strong' | 'moderate' | 'limited' | 'anecdotal';
    isAiSuggested?: boolean;
}

interface NeedCardProps {
    need: Need;
    onEdit: (need: Need) => void;
    onDelete: (id: string) => void;
}

const urgencyColors = {
    critical: 'destructive',
    high: 'warning',
    medium: 'info',
    low: 'secondary',
} as const;

const impactColors = {
    critical: 'destructive',
    high: 'accent',
    medium: 'info',
    low: 'secondary',
} as const;

export function NeedCard({ need, onEdit, onDelete }: NeedCardProps) {
    return (
        <GlowCard variant="flat" padding="md" className="group hover:shadow-ambient-card-hover transition-all">
            <Stack spacing="sm">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{need.title}</h4>
                            {need.isAiSuggested && (
                                <GlowBadge variant="info" size="sm">AI</GlowBadge>
                            )}
                        </div>
                        {need.description && (
                            <p className="mt-1 text-sm text-muted-foreground">{need.description}</p>
                        )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GlowButton variant="ghost" size="icon" onClick={() => onEdit(need)}>
                            <Edit className="h-4 w-4" />
                        </GlowButton>
                        <GlowButton variant="ghost" size="icon" onClick={() => onDelete(need.id)}>
                            <Trash2 className="h-4 w-4" />
                        </GlowButton>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <GlowBadge variant="outline" size="sm">
                        {need.category}
                    </GlowBadge>
                    <GlowBadge variant={urgencyColors[need.urgencyLevel]} size="sm">
                        Urgency: {need.urgencyLevel}
                    </GlowBadge>
                    <GlowBadge variant={impactColors[need.impactLevel]} size="sm">
                        Impact: {need.impactLevel}
                    </GlowBadge>
                    <GlowBadge variant="secondary" size="sm">
                        Evidence: {need.evidenceLevel}
                    </GlowBadge>
                </div>
            </Stack>
        </GlowCard>
    );
}
