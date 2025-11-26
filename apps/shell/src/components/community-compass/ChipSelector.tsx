'use client';

import * as React from 'react';
import { Sparkles, Plus, Edit2, X, Check } from 'lucide-react';
import { GlowBadge, GlowButton, Stack, Text, GlowInput } from '@/components/glow-ui';
import { cn } from '@/lib/utils';

export interface Chip {
    id: string;
    text: string;
    isSelected: boolean;
    isAiGenerated: boolean;
    isCustom?: boolean;
    isEdited?: boolean;
}

interface ChipSelectorProps {
    chips: Chip[];
    onToggle: (id: string) => void;
    onGenerate?: () => void;
    onAddCustom?: (text: string) => void;
    onEdit?: (id: string, newText: string) => void;
    onDelete?: (id: string) => void;
    isGenerating?: boolean;
    categoryLabel: string;
}

export function ChipSelector({
    chips,
    onToggle,
    onGenerate,
    onAddCustom,
    onEdit,
    onDelete,
    isGenerating,
    categoryLabel,
}: ChipSelectorProps) {
    const [customChipText, setCustomChipText] = React.useState('');
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [editText, setEditText] = React.useState('');

    const handleAddCustom = () => {
        if (customChipText.trim() && onAddCustom) {
            onAddCustom(customChipText.trim());
            setCustomChipText('');
        }
    };

    const handleStartEdit = (chip: Chip) => {
        setEditingId(chip.id);
        setEditText(chip.text);
    };

    const handleSaveEdit = () => {
        if (editText.trim() && editingId && onEdit) {
            onEdit(editingId, editText.trim());
            setEditingId(null);
            setEditText('');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    return (
        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-ambient-card">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{categoryLabel}</h3>
                    <p className="text-sm text-muted-foreground">
                        Select the statements that best describe the community&apos;s {categoryLabel.toLowerCase()}.
                    </p>
                </div>
                {onGenerate && (
                    <GlowButton
                        variant="ghost"
                        size="sm"
                        glow="subtle"
                        onClick={onGenerate}
                        disabled={isGenerating}
                        leftIcon={<Sparkles className={cn("h-4 w-4", isGenerating && "animate-spin")} />}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Ideas'}
                    </GlowButton>
                )}
            </div>

            {/* Custom Chip Input */}
            {onAddCustom && (
                <div className="flex gap-2">
                    <GlowInput
                        value={customChipText}
                        onChange={(e) => setCustomChipText(e.target.value)}
                        placeholder="Add your own statement..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustom();
                            }
                        }}
                        className="flex-1"
                    />
                    <GlowButton
                        variant="outline"
                        size="sm"
                        onClick={handleAddCustom}
                        disabled={!customChipText.trim()}
                        leftIcon={<Plus className="h-4 w-4" />}
                    >
                        Add
                    </GlowButton>
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                    editingId === chip.id ? (
                        <div key={chip.id} className="flex items-center gap-1 rounded-full border border-primary bg-primary/5 px-2 py-1">
                            <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit();
                                    if (e.key === 'Escape') handleCancelEdit();
                                }}
                                className="w-40 bg-transparent text-sm outline-none"
                                autoFocus
                            />
                            <button
                                onClick={handleSaveEdit}
                                className="text-green-500 hover:text-green-600"
                                title="Save"
                            >
                                <Check className="h-3 w-3" />
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="text-muted-foreground hover:text-foreground"
                                title="Cancel"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ) : (
                        <div
                            key={chip.id}
                            className={cn(
                                "group relative flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-all duration-200",
                                chip.isSelected
                                    ? "border-primary bg-primary/10 text-primary shadow-glow-primary-sm"
                                    : "border-input bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            )}
                        >
                            <button
                                onClick={() => onToggle(chip.id)}
                                className="flex-1"
                            >
                                {chip.text}
                            </button>
                            {chip.isCustom && (
                                <GlowBadge variant="info" size="sm" className="ml-1">
                                    Custom
                                </GlowBadge>
                            )}
                            {chip.isEdited && !chip.isCustom && (
                                <GlowBadge variant="warning" size="sm" className="ml-1">
                                    Edited
                                </GlowBadge>
                            )}
                            {onEdit && (
                                <button
                                    onClick={() => handleStartEdit(chip)}
                                    className="ml-1 opacity-0 transition-opacity group-hover:opacity-100"
                                    title="Edit"
                                >
                                    <Edit2 className="h-3 w-3" />
                                </button>
                            )}
                            {onDelete && chip.isCustom && (
                                <button
                                    onClick={() => onDelete(chip.id)}
                                    className="ml-1 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                                    title="Delete"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    )
                ))}
                {chips.length === 0 && !isGenerating && (
                    <div className="flex w-full flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <Sparkles className="mb-2 h-8 w-8 opacity-20" />
                        <p>{onGenerate ? 'No chips yet. Click "Generate Ideas" to start or add your own.' : 'Chips are being generated automatically...'}</p>
                    </div>
                )}
                {isGenerating && chips.length === 0 && (
                    <div className="flex w-full flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <Sparkles className="mb-2 h-8 w-8 animate-spin opacity-50" />
                        <p>Generating ideas...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
