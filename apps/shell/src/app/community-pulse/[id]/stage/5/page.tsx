/**
 * Stage 5: Generate Materials
 * AI-generated facilitation materials
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { communityPulseService } from '@/services/communityPulseService';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import type { Engagement, EngagementMethod } from '@/types/community-pulse';
import { ArrowLeft, ArrowRight, FileText, Sparkles, Download, Eye, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const MATERIAL_TYPES = [
  { id: 'facilitator_guide', label: 'Facilitator Guide', description: 'Step-by-step session guide' },
  { id: 'consent_form', label: 'Consent Form', description: 'Informed consent document' },
  { id: 'question_protocol', label: 'Question Protocol', description: 'Discussion questions' },
  { id: 'recruitment_flyer', label: 'Recruitment Flyer', description: 'Participant outreach' },
  { id: 'note_template', label: 'Note-Taking Template', description: 'Session documentation' },
];

export default function Stage5Page() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [method, setMethod] = useState<EngagementMethod | null>(null);
  const [generatedMaterials, setGeneratedMaterials] = useState<string[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const engagementData = await communityPulseService.getEngagement(id);
        if (engagementData) {
          setEngagement(engagementData);
          setGeneratedMaterials(
            (engagementData.generatedMaterials || []).map((m) => m.type)
          );
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

  const handleGenerate = async (materialType: string) => {
    setGenerating(materialType);
    // Simulate AI generation (in real implementation, call AI service)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGeneratedMaterials([...generatedMaterials, materialType]);
    setGenerating(null);
    toast.success(`${MATERIAL_TYPES.find((m) => m.id === materialType)?.label} generated!`);
  };

  const handleContinue = async () => {
    try {
      await communityPulseService.updateEngagement(id, {
        currentStage: 6,
        generatedMaterials: MATERIAL_TYPES.filter((m) =>
          generatedMaterials.includes(m.id)
        ).map((m) => ({
          id: crypto.randomUUID(),
          type: m.id as any,
          title: m.label,
          generatedAt: new Date().toISOString(),
        })),
      });
      router.push(`/community-pulse/${id}/stage/6`);
    } catch (err) {
      console.error('Error saving:', err);
      toast.error('Failed to save');
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
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Stage 5: Generate Materials
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-generated execution materials for {method?.name || 'your engagement'}
            </p>
          </div>
        </div>
      </div>

      {/* AI Generation Info */}
      <GlowCard className="p-6 bg-gradient-to-br from-vision-purple-50 to-vision-blue-50">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-vision-purple-700 mt-0.5" />
          <div>
            <h2 className="font-semibold text-foreground">AI Material Generation</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Based on your strategy, we'll generate customized materials. You can
              review and edit each document before finalizing.
            </p>
          </div>
        </div>
      </GlowCard>

      {/* Materials List */}
      <GlowCard className="divide-y divide-border">
        {MATERIAL_TYPES.map((material) => {
          const isGenerated = generatedMaterials.includes(material.id);
          const isGenerating = generating === material.id;

          return (
            <div key={material.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    isGenerated
                      ? 'bg-vision-green-100 text-vision-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isGenerated ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{material.label}</p>
                  <p className="text-xs text-muted-foreground">{material.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isGenerated ? (
                  <>
                    <GlowButton variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                      Preview
                    </GlowButton>
                    <GlowButton variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                      Download
                    </GlowButton>
                  </>
                ) : (
                  <GlowButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerate(material.id)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate
                      </>
                    )}
                  </GlowButton>
                )}
              </div>
            </div>
          );
        })}
      </GlowCard>

      {/* Generate All */}
      {generatedMaterials.length < MATERIAL_TYPES.length && (
        <div className="text-center">
          <GlowButton
            variant="default"
            onClick={async () => {
              for (const material of MATERIAL_TYPES) {
                if (!generatedMaterials.includes(material.id)) {
                  await handleGenerate(material.id);
                }
              }
            }}
            disabled={generating !== null}
          >
            <Sparkles className="h-4 w-4" />
            Generate All Materials
          </GlowButton>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <GlowButton variant="outline" onClick={() => router.push(`/community-pulse/${id}/stage/4`)}>
          <ArrowLeft className="h-4 w-4" />
          Previous
        </GlowButton>
        <GlowButton variant="default" glow="medium" onClick={handleContinue}>
          Continue to Timeline
          <ArrowRight className="h-4 w-4" />
        </GlowButton>
      </div>
    </div>
  );
}
