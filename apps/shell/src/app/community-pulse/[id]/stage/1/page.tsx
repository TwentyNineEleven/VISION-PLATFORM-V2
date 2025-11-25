/**
 * Stage 1: Learning Goal (Edit)
 * Edit learning goal for existing engagement
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { communityPulseService } from '@/services/communityPulseService';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import type { Engagement, GoalType } from '@/types/community-pulse';
import { ArrowLeft, ArrowRight, Target, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const GOAL_TYPES: { value: GoalType; label: string; description: string }[] = [
  { value: 'explore', label: 'Explore', description: 'Understand experiences, attitudes, and perceptions' },
  { value: 'test', label: 'Test', description: 'Validate ideas, solutions, or assumptions' },
  { value: 'decide', label: 'Decide', description: 'Make choices or prioritize options' },
];

export default function Stage1Page() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [engagement, setEngagement] = useState<Engagement | null>(null);

  const [title, setTitle] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('explore');

  useEffect(() => {
    async function loadEngagement() {
      try {
        const data = await communityPulseService.getEngagement(id);
        if (data) {
          setEngagement(data);
          setTitle(data.title);
          setLearningGoal(data.learningGoal || '');
          setGoalType(data.goalType || 'explore');
        }
      } catch (err) {
        console.error('Error loading engagement:', err);
        toast.error('Failed to load engagement');
      } finally {
        setLoading(false);
      }
    }
    loadEngagement();
  }, [id]);

  const handleSave = async (andContinue: boolean = false) => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    setSaving(true);
    try {
      await communityPulseService.updateEngagement(id, {
        title: title.trim(),
        learningGoal: learningGoal.trim() || undefined,
        goalType,
        currentStage: andContinue ? 2 : 1,
      });
      toast.success('Saved!');
      if (andContinue) {
        router.push(`/community-pulse/${id}/stage/2`);
      }
    } catch (err) {
      console.error('Error saving:', err);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-vision-blue-950"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/community-pulse/${id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Strategy
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vision-blue-100 text-vision-blue-950">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Stage 1: Define Learning Goals
            </h1>
            <p className="text-sm text-muted-foreground">
              What do you want to learn from your community?
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <GlowCard className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Strategy Title <span className="text-red-500">*</span>
          </label>
          <GlowInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Youth Program Feedback Sessions"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Learning Goal
          </label>
          <textarea
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            placeholder="We want to understand..."
            rows={4}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Goal Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {GOAL_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setGoalType(type.value)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  goalType === type.value
                    ? 'border-vision-blue-950 bg-vision-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-foreground">{type.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>
      </GlowCard>

      {/* Example Goals */}
      <GlowCard className="p-4 bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-vision-purple-700" />
          <span className="text-sm font-medium text-foreground">Example Learning Goals</span>
        </div>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• "How do residents experience housing insecurity in our neighborhood?"</li>
          <li>• "What barriers prevent families from accessing our programs?"</li>
          <li>• "How should we prioritize improvements to the community center?"</li>
        </ul>
      </GlowCard>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <GlowButton variant="outline" onClick={() => router.push(`/community-pulse/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </GlowButton>
        <div className="flex gap-3">
          <GlowButton variant="outline" onClick={() => handleSave(false)} disabled={saving}>
            Save
          </GlowButton>
          <GlowButton variant="default" glow="medium" onClick={() => handleSave(true)} disabled={saving || !title.trim()}>
            {saving ? 'Saving...' : 'Save & Continue'}
            <ArrowRight className="h-4 w-4" />
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
