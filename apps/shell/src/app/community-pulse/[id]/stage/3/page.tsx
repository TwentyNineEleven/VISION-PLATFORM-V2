/**
 * Stage 3: Method Selection
 * Choose engagement methods with AI recommendations
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { communityPulseService } from '@/services/communityPulseService';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import type { Engagement, EngagementMethod } from '@/types/community-pulse';
import { ArrowLeft, ArrowRight, Settings, Sparkles, Users, Clock, DollarSign, Check } from 'lucide-react';
import { toast } from 'sonner';
import { StageSkeleton } from '../../../components/EngagementCardSkeleton';

export default function Stage3Page() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [methods, setMethods] = useState<EngagementMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [rationale, setRationale] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [engagementData, methodsData] = await Promise.all([
          communityPulseService.getEngagement(id),
          communityPulseService.getMethods(),
        ]);
        if (engagementData) {
          setEngagement(engagementData);
          setSelectedMethod(engagementData.primaryMethod || null);
          setRationale(engagementData.methodRationale || '');
        }
        setMethods(methodsData);
      } catch (err) {
        console.error('Error loading data:', err);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSave = async (andContinue: boolean = false) => {
    if (!selectedMethod) {
      toast.error('Please select a method');
      return;
    }
    setSaving(true);
    try {
      await communityPulseService.updateEngagement(id, {
        primaryMethod: selectedMethod,
        methodRationale: rationale,
        currentStage: andContinue ? 4 : 3,
      });
      toast.success('Saved!');
      if (andContinue) {
        router.push(`/community-pulse/${id}/stage/4`);
      }
    } catch (err) {
      console.error('Error saving:', err);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Simple AI recommendation based on goal type
  const getRecommendedMethods = () => {
    if (!engagement?.goalType) return methods.slice(0, 3);
    return methods
      .sort((a, b) => (b.fitScores?.[engagement.goalType!] || 0) - (a.fitScores?.[engagement.goalType!] || 0))
      .slice(0, 3);
  };

  const recommendedMethods = getRecommendedMethods();

  if (loading) {
    return <StageSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vision-orange-100 text-vision-orange-700">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Stage 3: Select Engagement Method
            </h1>
            <p className="text-sm text-muted-foreground">
              How will you listen to your community?
            </p>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <GlowCard className="p-6 bg-gradient-to-br from-vision-purple-50 to-vision-blue-50">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-vision-purple-700" />
          <h2 className="font-semibold text-foreground">AI Recommendations</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Based on your learning goal ({engagement?.goalType || 'explore'}), we recommend:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedMethods.map((method, index) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.slug)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedMethod === method.slug
                  ? 'border-vision-purple-700 bg-white shadow-md'
                  : 'border-transparent bg-white/50 hover:bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-vision-purple-700">
                  #{index + 1} Recommended
                </span>
                {selectedMethod === method.slug && (
                  <Check className="h-4 w-4 text-vision-purple-700" />
                )}
              </div>
              <h3 className="font-medium text-foreground">{method.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {method.bestFor}
              </p>
            </button>
          ))}
        </div>
      </GlowCard>

      {/* All Methods */}
      <GlowCard className="p-6">
        <h2 className="font-semibold text-foreground mb-4">All Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.slug)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedMethod === method.slug
                  ? 'border-vision-blue-950 bg-vision-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-foreground">{method.name}</h3>
                {selectedMethod === method.slug && (
                  <Check className="h-4 w-4 text-vision-blue-950" />
                )}
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {method.groupSizeMin}-{method.groupSizeMax}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {method.durationMin}-{method.durationMax} min
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  ${method.costEstimateLow.toLocaleString()}-${method.costEstimateHigh.toLocaleString()}
                </div>
              </div>
            </button>
          ))}
        </div>
      </GlowCard>

      {/* Rationale */}
      {selectedMethod && (
        <GlowCard className="p-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Why this method? (optional)
          </label>
          <textarea
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="Explain why this method is appropriate for your engagement..."
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </GlowCard>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <GlowButton variant="outline" onClick={() => router.push(`/community-pulse/${id}/stage/2`)}>
          <ArrowLeft className="h-4 w-4" />
          Previous
        </GlowButton>
        <div className="flex gap-3">
          <GlowButton variant="outline" onClick={() => handleSave(false)} disabled={saving || !selectedMethod}>
            Save
          </GlowButton>
          <GlowButton variant="default" glow="medium" onClick={() => handleSave(true)} disabled={saving || !selectedMethod}>
            {saving ? 'Saving...' : 'Save & Continue'}
            <ArrowRight className="h-4 w-4" />
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
