/**
 * CommunityPulse - New Engagement Strategy
 * 7-stage wizard for creating engagement strategies
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useOrganization } from '@/contexts/OrganizationContext';
import { communityPulseService } from '@/services/communityPulseService';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { STAGE_NAMES, STAGE_DESCRIPTIONS } from '@/types/community-pulse';
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function NewEngagementPage() {
  const router = useRouter();
  const { user } = useUser();
  const { activeOrganization } = useOrganization();
  const [title, setTitle] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your strategy');
      return;
    }

    if (!activeOrganization?.id || !user?.id) {
      toast.error('Please select an organization');
      return;
    }

    setIsCreating(true);
    try {
      const engagement = await communityPulseService.createEngagement(
        activeOrganization.id,
        user.id,
        title.trim()
      );

      // Update with learning goal if provided
      if (learningGoal.trim()) {
        await communityPulseService.updateEngagement(engagement.id, {
          learningGoal: learningGoal.trim(),
        });
      }

      toast.success('Strategy created!');
      router.push(`/community-pulse/${engagement.id}`);
    } catch (err) {
      console.error('Error creating engagement:', err);
      toast.error('Failed to create strategy');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STAGE_NAMES.map((name, index) => (
            <div key={name} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  index === 0
                    ? 'bg-vision-blue-950 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index === 0 ? (
                  <span>1</span>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {index < STAGE_NAMES.length - 1 && (
                <div className="hidden sm:block w-12 lg:w-20 h-0.5 bg-gray-200 mx-2" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          {STAGE_NAMES.map((name, index) => (
            <span
              key={name}
              className={`hidden sm:block ${index === 0 ? 'text-vision-blue-950 font-medium' : ''}`}
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Stage 1: Learning Goal */}
      <GlowCard className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Define Your Learning Goals
          </h1>
          <p className="mt-2 text-muted-foreground">
            What do you want to learn from your community?
          </p>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Strategy Title <span className="text-red-500">*</span>
            </label>
            <GlowInput
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Youth Program Feedback Sessions"
              className="w-full"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Give your engagement strategy a descriptive name
            </p>
          </div>

          {/* Learning Goal */}
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
            <p className="mt-1 text-xs text-muted-foreground">
              Be specific about what insights you&apos;re seeking from the community
            </p>
          </div>

          {/* Example Goals */}
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-vision-purple-700" />
              <span className="text-sm font-medium text-foreground">
                Example Learning Goals
              </span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • &quot;How do residents experience housing insecurity in our
                neighborhood?&quot;
              </li>
              <li>
                • &quot;What barriers prevent families from accessing our after-school
                programs?&quot;
              </li>
              <li>
                • &quot;How should we prioritize improvements to the community
                center?&quot;
              </li>
              <li>
                • &quot;What types of job training would be most valuable for young
                adults?&quot;
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          <GlowButton
            variant="outline"
            onClick={() => router.push('/community-pulse')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </GlowButton>

          <GlowButton
            variant="default"
            glow="medium"
            onClick={handleCreate}
            disabled={isCreating || !title.trim()}
          >
            {isCreating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                Create & Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </GlowButton>
        </div>
      </GlowCard>

      {/* Tips */}
      <div className="mt-6 rounded-lg border border-vision-blue-200 bg-vision-blue-50/50 p-4">
        <h3 className="font-medium text-foreground">
          Tips for Effective Learning Goals
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>
            <Check className="inline h-3 w-3 text-vision-green-700 mr-1" />
            Be specific about what you want to learn
          </li>
          <li>
            <Check className="inline h-3 w-3 text-vision-green-700 mr-1" />
            Focus on community experiences and perspectives
          </li>
          <li>
            <Check className="inline h-3 w-3 text-vision-green-700 mr-1" />
            Consider how you&apos;ll use the insights
          </li>
          <li>
            <Check className="inline h-3 w-3 text-vision-green-700 mr-1" />
            Avoid leading or biased framing
          </li>
        </ul>
      </div>
    </div>
  );
}
