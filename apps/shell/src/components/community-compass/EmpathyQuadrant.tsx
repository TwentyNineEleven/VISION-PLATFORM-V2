'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { GlowButton, Stack, Text } from '@/components/glow-ui';
import { cn } from '@/lib/utils';

export interface EmpathyChip {
    id: string;
    text: string;
    isSelected: boolean;
}

interface EmpathyQuadrantProps {
    title: string;
    description: string;
    chips: EmpathyChip[];
    onToggle: (id: string) => void;
    onGenerate: () => void;
    isGenerating: boolean;
    color?: 'blue' | 'green' | 'orange' | 'purple';
}

const colorClasses = {
    blue: {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        border: 'border-blue-200 dark:border-blue-800',
        selected: 'border-blue-500 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
        hover: 'hover:border-blue-300 dark:hover:border-blue-700',
    },
    green: {
        bg: 'bg-green-50 dark:bg-green-950/20',
        border: 'border-green-200 dark:border-green-800',
        selected: 'border-green-500 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
        hover: 'hover:border-green-300 dark:hover:border-green-700',
    },
    orange: {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        border: 'border-orange-200 dark:border-orange-800',
        selected: 'border-orange-500 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
        hover: 'hover:border-orange-300 dark:hover:border-orange-700',
    },
    purple: {
        bg: 'bg-purple-50 dark:bg-purple-950/20',
        border: 'border-purple-200 dark:border-purple-800',
        selected: 'border-purple-500 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
        hover: 'hover:border-purple-300 dark:hover:border-purple-700',
    },
};

export function EmpathyQuadrant({
    title,
    description,
    chips,
    onToggle,
    onGenerate,
    isGenerating,
    color = 'blue',
}: EmpathyQuadrantProps) {
    const colors = colorClasses[color];

    return (
        <div className={cn('rounded-lg border p-4', colors.bg, colors.border)}>
            <Stack spacing="sm">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-foreground">{title}</h3>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <GlowButton
                        variant="ghost"
                        size="sm"
                        onClick={onGenerate}
                        disabled={isGenerating}
                        leftIcon={<Sparkles className={cn("h-3 w-3", isGenerating && "animate-spin")} />}
                    >
                        {isGenerating ? 'Generating...' : 'Generate'}
                    </GlowButton>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {chips.map((chip) => (
                        <button
                            key={chip.id}
                            onClick={() => onToggle(chip.id)}
                            className={cn(
                                "rounded-full border px-2.5 py-1 text-xs transition-all",
                                chip.isSelected
                                    ? colors.selected
                                    : cn('border-input bg-background text-muted-foreground', colors.hover)
                            )}
                        >
                            {chip.text}
                        </button>
                    ))}
                    {chips.length === 0 && !isGenerating && (
                        <p className="py-4 text-center text-xs text-muted-foreground">
                            Click &quot;Generate&quot; to create chips
                        </p>
                    )}
                </div>
            </Stack>
        </div>
    );
}
