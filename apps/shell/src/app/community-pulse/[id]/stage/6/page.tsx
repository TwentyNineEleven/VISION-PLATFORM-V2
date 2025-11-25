/**
 * Stage 6: Build Timeline
 * Project timeline and budget estimation
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { communityPulseService } from '@/services/communityPulseService';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import type { Engagement, EngagementMethod } from '@/types/community-pulse';
import { ArrowLeft, ArrowRight, Calendar, DollarSign, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Stage6Page() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [method, setMethod] = useState<EngagementMethod | null>(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetEstimate, setBudgetEstimate] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const engagementData = await communityPulseService.getEngagement(id);
        if (engagementData) {
          setEngagement(engagementData);
          setStartDate(engagementData.startDate || '');
          setEndDate(engagementData.endDate || '');
          setBudgetEstimate(engagementData.budgetEstimate?.toString() || '');
          if (engagementData.primaryMethod) {
            const methodData = await communityPulseService.getMethodBySlug(
              engagementData.primaryMethod
            );
            setMethod(methodData);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSave = async (andContinue: boolean = false) => {
    setSaving(true);
    try {
      await communityPulseService.updateEngagement(id, {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        budgetEstimate: budgetEstimate ? parseFloat(budgetEstimate) : undefined,
        currentStage: andContinue ? 7 : 6,
      });
      toast.success('Saved!');
      if (andContinue) {
        router.push(`/community-pulse/${id}/stage/7`);
      }
    } catch (err) {
      console.error('Error saving:', err);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Calculate suggested budget based on method and participants
  const suggestedBudget = method && engagement?.estimatedParticipants
    ? Math.round(
        (method.costEstimateLow + method.costEstimateHigh) / 2 *
        (engagement.estimatedParticipants / method.groupSizeMax)
      )
    : null;

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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vision-green-100 text-vision-green-700">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Stage 6: Build Your Timeline
            </h1>
            <p className="text-sm text-muted-foreground">
              Plan dates and estimate budget
            </p>
          </div>
        </div>
      </div>

      {/* Method Summary */}
      {method && (
        <GlowCard className="p-4 bg-muted/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-xs">Group Size</span>
              </div>
              <p className="font-semibold text-foreground">
                {method.groupSizeMin}-{method.groupSizeMax}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Duration</span>
              </div>
              <p className="font-semibold text-foreground">
                {method.durationMin}-{method.durationMax} min
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs">Est. Cost</span>
              </div>
              <p className="font-semibold text-foreground">
                ${method.costEstimateLow.toLocaleString()}-${method.costEstimateHigh.toLocaleString()}
              </p>
            </div>
          </div>
        </GlowCard>
      )}

      {/* Dates */}
      <GlowCard className="p-6">
        <h2 className="font-semibold text-foreground mb-4">Project Dates</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Start Date
            </label>
            <GlowInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Target End Date
            </label>
            <GlowInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </GlowCard>

      {/* Budget */}
      <GlowCard className="p-6">
        <h2 className="font-semibold text-foreground mb-4">Budget Estimate</h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Total Budget
          </label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">$</span>
            <GlowInput
              type="number"
              value={budgetEstimate}
              onChange={(e) => setBudgetEstimate(e.target.value)}
              placeholder="0"
              className="w-48"
            />
          </div>
          {suggestedBudget && (
            <p className="text-sm text-muted-foreground mt-2">
              Suggested: ${suggestedBudget.toLocaleString()} based on {engagement?.estimatedParticipants} participants
            </p>
          )}
        </div>

        {/* Budget Breakdown */}
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="text-sm font-medium text-foreground mb-3">Typical Cost Categories</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Participant incentives</span>
              <span>$50/person</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Food & refreshments</span>
              <span>$15/person</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Space rental</span>
              <span>$200-500/session</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Translation/interpretation</span>
              <span>$100-200/session</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Childcare</span>
              <span>$20/hour</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Materials & supplies</span>
              <span>$200-500</span>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <GlowButton variant="outline" onClick={() => router.push(`/community-pulse/${id}/stage/5`)}>
          <ArrowLeft className="h-4 w-4" />
          Previous
        </GlowButton>
        <div className="flex gap-3">
          <GlowButton variant="outline" onClick={() => handleSave(false)} disabled={saving}>
            Save
          </GlowButton>
          <GlowButton variant="default" glow="medium" onClick={() => handleSave(true)} disabled={saving}>
            {saving ? 'Saving...' : 'Save & Continue'}
            <ArrowRight className="h-4 w-4" />
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
