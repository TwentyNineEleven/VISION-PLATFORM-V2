/**
 * Stage 4: Strategy Design
 * Design participation model, questions, and equity checklist
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { communityPulseService } from '@/services/communityPulseService';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import type { Engagement, ParticipationModel } from '@/types/community-pulse';
import { ArrowLeft, ArrowRight, FileText, AlertTriangle, Check } from 'lucide-react';
import { toast } from 'sonner';

const PARTICIPATION_MODELS: { value: ParticipationModel; label: string; description: string }[] = [
  { value: 'informational', label: 'Informational', description: 'We gather input from community' },
  { value: 'consultative', label: 'Consultative', description: 'We co-interpret findings together' },
  { value: 'collaborative', label: 'Collaborative', description: 'We co-design solutions together' },
  { value: 'community_controlled', label: 'Community-Controlled', description: 'Community leads, we support' },
];

export default function Stage4Page() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [engagement, setEngagement] = useState<Engagement | null>(null);

  const [participationModel, setParticipationModel] = useState<ParticipationModel>('consultative');
  const [recruitmentPlan, setRecruitmentPlan] = useState('');

  // Equity checklist
  const [equityChecklist, setEquityChecklist] = useState({
    physicalSafety: false,
    emotionalSafety: false,
    purposeExplained: false,
    informedConsent: false,
    compensation: false,
    languageAccess: false,
    dominanceManagement: false,
    findingsShared: false,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await communityPulseService.getEngagement(id);
        if (data) {
          setEngagement(data);
          setParticipationModel(data.participationModel || 'consultative');
          setRecruitmentPlan(data.recruitmentPlan || '');
          if (data.equityChecklist) {
            setEquityChecklist({
              physicalSafety: data.equityChecklist.safety?.physicalSafety || false,
              emotionalSafety: data.equityChecklist.safety?.emotionalSafety || false,
              purposeExplained: data.equityChecklist.trustworthiness?.purposeExplained || false,
              informedConsent: data.equityChecklist.communityBenefit?.informedConsent || false,
              compensation: data.equityChecklist.accessibility?.compensation || false,
              languageAccess: data.equityChecklist.accessibility?.languageAccess || false,
              dominanceManagement: data.equityChecklist.powerDynamics?.dominanceManagement || false,
              findingsShared: data.equityChecklist.communityBenefit?.findingsShared || false,
            });
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
        participationModel,
        recruitmentPlan,
        equityChecklist: {
          safety: {
            physicalSafety: equityChecklist.physicalSafety,
            emotionalSafety: equityChecklist.emotionalSafety,
          },
          trustworthiness: {
            purposeExplained: equityChecklist.purposeExplained,
          },
          accessibility: {
            compensation: equityChecklist.compensation,
            languageAccess: equityChecklist.languageAccess,
          },
          powerDynamics: {
            dominanceManagement: equityChecklist.dominanceManagement,
          },
          communityBenefit: {
            informedConsent: equityChecklist.informedConsent,
            findingsShared: equityChecklist.findingsShared,
          },
        },
        currentStage: andContinue ? 5 : 4,
      });
      toast.success('Saved!');
      if (andContinue) {
        router.push(`/community-pulse/${id}/stage/5`);
      }
    } catch (err) {
      console.error('Error saving:', err);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const checkedCount = Object.values(equityChecklist).filter(Boolean).length;
  const totalChecks = Object.keys(equityChecklist).length;

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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vision-purple-100 text-vision-purple-700">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Stage 4: Design Your Strategy
            </h1>
            <p className="text-sm text-muted-foreground">
              Plan participation model and equity considerations
            </p>
          </div>
        </div>
      </div>

      {/* Participation Model */}
      <GlowCard className="p-6">
        <h2 className="font-semibold text-foreground mb-4">Participation Model</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PARTICIPATION_MODELS.map((model) => (
            <button
              key={model.value}
              onClick={() => setParticipationModel(model.value)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                participationModel === model.value
                  ? 'border-vision-blue-950 bg-vision-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{model.label}</span>
                {participationModel === model.value && (
                  <Check className="h-4 w-4 text-vision-blue-950" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
            </button>
          ))}
        </div>
      </GlowCard>

      {/* Recruitment Plan */}
      <GlowCard className="p-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Recruitment Plan
        </label>
        <textarea
          value={recruitmentPlan}
          onChange={(e) => setRecruitmentPlan(e.target.value)}
          placeholder="How will you recruit participants? Who will do outreach? What incentives will you offer?"
          rows={4}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </GlowCard>

      {/* Equity Checklist */}
      <GlowCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-vision-orange-700" />
            <h2 className="font-semibold text-foreground">Trauma-Informed & Equity Checklist</h2>
          </div>
          <span className={`text-sm font-medium ${checkedCount === totalChecks ? 'text-vision-green-700' : 'text-vision-orange-700'}`}>
            {checkedCount}/{totalChecks} complete
          </span>
        </div>

        <div className="space-y-4">
          <div className="border-b border-border pb-3">
            <h3 className="text-sm font-medium text-foreground mb-2">Safety</h3>
            <div className="space-y-2">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={equityChecklist.physicalSafety}
                  onChange={(e) => setEquityChecklist({...equityChecklist, physicalSafety: e.target.checked})}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm text-foreground">Physical safety plan in place (accessible, well-lit, neutral location)</span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={equityChecklist.emotionalSafety}
                  onChange={(e) => setEquityChecklist({...equityChecklist, emotionalSafety: e.target.checked})}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm text-foreground">Emotional safety protocols (ground rules, trained facilitator)</span>
              </label>
            </div>
          </div>

          <div className="border-b border-border pb-3">
            <h3 className="text-sm font-medium text-foreground mb-2">Trustworthiness</h3>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={equityChecklist.purposeExplained}
                onChange={(e) => setEquityChecklist({...equityChecklist, purposeExplained: e.target.checked})}
                className="mt-1 rounded border-gray-300"
              />
              <span className="text-sm text-foreground">Purpose and use of input will be clearly explained</span>
            </label>
          </div>

          <div className="border-b border-border pb-3">
            <h3 className="text-sm font-medium text-foreground mb-2">Accessibility</h3>
            <div className="space-y-2">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={equityChecklist.languageAccess}
                  onChange={(e) => setEquityChecklist({...equityChecklist, languageAccess: e.target.checked})}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm text-foreground">Language access provided (translation/interpretation)</span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={equityChecklist.compensation}
                  onChange={(e) => setEquityChecklist({...equityChecklist, compensation: e.target.checked})}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm text-foreground">Compensation for participant time</span>
              </label>
            </div>
          </div>

          <div className="border-b border-border pb-3">
            <h3 className="text-sm font-medium text-foreground mb-2">Power Dynamics</h3>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={equityChecklist.dominanceManagement}
                onChange={(e) => setEquityChecklist({...equityChecklist, dominanceManagement: e.target.checked})}
                className="mt-1 rounded border-gray-300"
              />
              <span className="text-sm text-foreground">Plan to manage dominant voices and ensure all heard</span>
            </label>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Community Benefit</h3>
            <div className="space-y-2">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={equityChecklist.informedConsent}
                  onChange={(e) => setEquityChecklist({...equityChecklist, informedConsent: e.target.checked})}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm text-foreground">Informed consent process in place</span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={equityChecklist.findingsShared}
                  onChange={(e) => setEquityChecklist({...equityChecklist, findingsShared: e.target.checked})}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm text-foreground">Findings will be shared back to participants</span>
              </label>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <GlowButton variant="outline" onClick={() => router.push(`/community-pulse/${id}/stage/3`)}>
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
