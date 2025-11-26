/**
 * Stage 7: Export & Launch
 * Review and export strategy
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { communityPulseService } from '@/services/communityPulseService';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import type { Engagement, EngagementMethod } from '@/types/community-pulse';
import { STAGE_NAMES } from '@/types/community-pulse';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Check,
  AlertCircle,
  FileText,
  Users,
  Target,
  Settings,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { StageSkeleton } from '../../../components/EngagementCardSkeleton';

export default function Stage7Page() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [method, setMethod] = useState<EngagementMethod | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const engagementData = await communityPulseService.getEngagement(id);
        if (engagementData) {
          setEngagement(engagementData);
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

  const handleExport = async (destination: string) => {
    setExporting(true);
    try {
      await communityPulseService.updateEngagement(id, {
        status: 'exported',
        exportedTo: [...(engagement?.exportedTo || []), destination],
        exportedAt: new Date().toISOString(),
      });
      toast.success(`Exported to ${destination}!`);
      router.push('/community-pulse');
    } catch (err) {
      console.error('Error exporting:', err);
      toast.error('Failed to export');
    } finally {
      setExporting(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      await communityPulseService.updateEngagement(id, {
        status: 'completed',
      });
      toast.success('Strategy marked as complete!');
      router.push('/community-pulse');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to update');
    }
  };

  // Check completeness
  const completeness = {
    learningGoal: !!engagement?.learningGoal,
    community: !!engagement?.targetPopulation,
    method: !!engagement?.primaryMethod,
    strategy: !!engagement?.participationModel,
    materials: (engagement?.generatedMaterials?.length || 0) > 0,
    timeline: !!engagement?.startDate,
  };

  const isComplete = Object.values(completeness).every(Boolean);

  if (loading) {
    return <StageSkeleton />;
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
            <Download className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Stage 7: Export & Launch
            </h1>
            <p className="text-sm text-muted-foreground">
              Review your strategy and export to other tools
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Summary */}
      <GlowCard className="p-6">
        <h2 className="font-semibold text-foreground mb-4">Strategy Summary</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-vision-blue-950 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Learning Goal</p>
              <p className="text-sm text-muted-foreground">
                {engagement?.learningGoal || 'Not defined'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-vision-green-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Target Community</p>
              <p className="text-sm text-muted-foreground">
                {engagement?.targetPopulation || 'Not defined'}
                {engagement?.estimatedParticipants && ` (${engagement.estimatedParticipants} participants)`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-vision-orange-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Method</p>
              <p className="text-sm text-muted-foreground">
                {method?.name || 'Not selected'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-vision-purple-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Timeline</p>
              <p className="text-sm text-muted-foreground">
                {engagement?.startDate && engagement?.endDate
                  ? `${new Date(engagement.startDate).toLocaleDateString()} - ${new Date(engagement.endDate).toLocaleDateString()}`
                  : 'Not set'}
              </p>
            </div>
          </div>

          {engagement?.budgetEstimate && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Budget</p>
                <p className="text-sm text-muted-foreground">
                  ${engagement.budgetEstimate.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </GlowCard>

      {/* Completeness Check */}
      <GlowCard className="p-6">
        <h2 className="font-semibold text-foreground mb-4">Completeness Check</h2>
        <div className="space-y-2">
          {Object.entries(completeness).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              {value ? (
                <CheckCircle2 className="h-4 w-4 text-vision-green-700" />
              ) : (
                <AlertCircle className="h-4 w-4 text-vision-orange-700" />
              )}
              <span className={`text-sm ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
                {key === 'learningGoal' && 'Learning goal defined'}
                {key === 'community' && 'Community context defined'}
                {key === 'method' && 'Engagement method selected'}
                {key === 'strategy' && 'Strategy design completed'}
                {key === 'materials' && 'Materials generated'}
                {key === 'timeline' && 'Timeline created'}
              </span>
            </div>
          ))}
        </div>
        {!isComplete && (
          <p className="mt-4 text-sm text-vision-orange-700">
            Complete all sections for the best results
          </p>
        )}
      </GlowCard>

      {/* Export Options */}
      <GlowCard className="p-6">
        <h2 className="font-semibold text-foreground mb-4">Export Options</h2>
        <div className="space-y-3">
          <button
            onClick={() => handleExport('VisionFlow')}
            disabled={exporting}
            className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-vision-purple-100 flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-vision-purple-700" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Export to VisionFlow</p>
                <p className="text-xs text-muted-foreground">Get AI-guided execution support</p>
              </div>
            </div>
            <GlowButton variant="outline" size="sm" disabled={exporting}>
              Export
            </GlowButton>
          </button>

          <button
            onClick={() => handleExport('PDF')}
            disabled={exporting}
            className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Download className="h-5 w-5 text-gray-700" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Download as PDF</p>
                <p className="text-xs text-muted-foreground">Complete strategy document</p>
              </div>
            </div>
            <GlowButton variant="outline" size="sm" disabled={exporting}>
              Download
            </GlowButton>
          </button>

          <button
            onClick={() => handleExport('Materials')}
            disabled={exporting}
            className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-700" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Download Materials Package</p>
                <p className="text-xs text-muted-foreground">All generated documents as ZIP</p>
              </div>
            </div>
            <GlowButton variant="outline" size="sm" disabled={exporting}>
              Download
            </GlowButton>
          </button>
        </div>
      </GlowCard>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <GlowButton variant="outline" onClick={() => router.push(`/community-pulse/${id}/stage/6`)}>
          <ArrowLeft className="h-4 w-4" />
          Previous
        </GlowButton>
        <GlowButton
          variant="default"
          glow="medium"
          onClick={handleMarkComplete}
          className="bg-vision-green-700 hover:bg-vision-green-800"
        >
          <Check className="h-4 w-4" />
          Mark Strategy Complete
        </GlowButton>
      </div>
    </div>
  );
}
