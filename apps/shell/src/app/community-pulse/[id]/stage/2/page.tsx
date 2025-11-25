/**
 * Stage 2: Community Context
 * Define who you're engaging and their context
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { communityPulseService } from '@/services/communityPulseService';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import type { Engagement } from '@/types/community-pulse';
import { ArrowLeft, ArrowRight, Users, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Stage2Page() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [engagement, setEngagement] = useState<Engagement | null>(null);

  // Form state
  const [targetPopulation, setTargetPopulation] = useState('');
  const [estimatedParticipants, setEstimatedParticipants] = useState('');
  const [relationshipHistory, setRelationshipHistory] = useState('');
  const [culturalConsiderations, setCulturalConsiderations] = useState('');
  const [languages, setLanguages] = useState('');
  const [hasTransportation, setHasTransportation] = useState(false);
  const [hasChildcare, setHasChildcare] = useState(false);
  const [hasDigitalAccess, setHasDigitalAccess] = useState(true);

  useEffect(() => {
    async function loadEngagement() {
      try {
        const data = await communityPulseService.getEngagement(id);
        if (data) {
          setEngagement(data);
          setTargetPopulation(data.targetPopulation || '');
          setEstimatedParticipants(data.estimatedParticipants?.toString() || '');
          setRelationshipHistory(data.relationshipHistory || '');
          setCulturalConsiderations(data.culturalConsiderations || '');
          setLanguages(data.demographics?.languages?.join(', ') || '');
          setHasTransportation(data.accessibilityNeeds?.transportation || false);
          setHasChildcare(data.accessibilityNeeds?.childcare || false);
          setHasDigitalAccess(data.demographics?.digitalAccess !== 'limited');
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
    setSaving(true);
    try {
      await communityPulseService.updateEngagement(id, {
        targetPopulation,
        estimatedParticipants: estimatedParticipants ? parseInt(estimatedParticipants) : undefined,
        relationshipHistory,
        culturalConsiderations,
        demographics: {
          languages: languages.split(',').map(l => l.trim()).filter(Boolean),
          digitalAccess: hasDigitalAccess ? 'good' : 'limited',
        },
        accessibilityNeeds: {
          transportation: hasTransportation,
          childcare: hasChildcare,
        },
        currentStage: andContinue ? 3 : 2,
      });
      toast.success('Saved!');
      if (andContinue) {
        router.push(`/community-pulse/${id}/stage/3`);
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vision-green-100 text-vision-green-700">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Stage 2: Community Context
            </h1>
            <p className="text-sm text-muted-foreground">
              Who holds the knowledge you need?
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <GlowCard className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Target Population <span className="text-red-500">*</span>
          </label>
          <textarea
            value={targetPopulation}
            onChange={(e) => setTargetPopulation(e.target.value)}
            placeholder="Describe who you want to engage (e.g., 'Parents of children ages 0-5 in the Oak Park neighborhood')"
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Estimated Participants
          </label>
          <GlowInput
            type="number"
            value={estimatedParticipants}
            onChange={(e) => setEstimatedParticipants(e.target.value)}
            placeholder="e.g., 50"
            className="w-48"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Languages Spoken
          </label>
          <GlowInput
            type="text"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            placeholder="e.g., English, Spanish, Vietnamese"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Relationship History
          </label>
          <textarea
            value={relationshipHistory}
            onChange={(e) => setRelationshipHistory(e.target.value)}
            placeholder="Describe your organization's history with this community. Have you engaged before? Any past issues to be aware of?"
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Cultural Considerations
          </label>
          <textarea
            value={culturalConsiderations}
            onChange={(e) => setCulturalConsiderations(e.target.value)}
            placeholder="Any cultural protocols, practices, or considerations to be aware of?"
            rows={2}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Accessibility */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Accessibility Considerations
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasTransportation}
                onChange={(e) => setHasTransportation(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-foreground">Transportation barriers exist</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasChildcare}
                onChange={(e) => setHasChildcare(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-foreground">Childcare needed</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!hasDigitalAccess}
                onChange={(e) => setHasDigitalAccess(!e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-foreground">Limited digital access</span>
            </label>
          </div>
        </div>
      </GlowCard>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <GlowButton variant="outline" onClick={() => router.push(`/community-pulse/${id}/stage/1`)}>
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
