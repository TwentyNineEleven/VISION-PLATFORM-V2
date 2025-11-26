/**
 * PlanShareModal Component
 * Modal for sharing a plan with users or organizations
 */

'use client';

import { useState, useEffect } from 'react';
import { GlowModal, GlowModalClose } from '@/components/glow-ui/GlowModal';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { GlowSelect } from '@/components/glow-ui/GlowSelect';
import { GlowBadge } from '@/components/glow-ui/GlowBadge';
import { X, User, Building2 } from 'lucide-react';

interface Plan {
  id: string;
  title: string;
}

interface Share {
  id: string;
  access_level: 'VIEW' | 'COMMENT' | 'EDIT';
  shared_with_user?: {
    id: string;
    name: string;
    email: string;
  };
  shared_with_org?: {
    id: string;
    name: string;
  };
  created_at: string;
}

interface PlanShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan;
  onSuccess: () => void;
}

export function PlanShareModal({
  open,
  onOpenChange,
  plan,
  onSuccess,
}: PlanShareModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shares, setShares] = useState<Share[]>([]);
  const [shareType, setShareType] = useState<'user' | 'org'>('user');
  const [shareTarget, setShareTarget] = useState('');
  const [accessLevel, setAccessLevel] = useState<'VIEW' | 'COMMENT' | 'EDIT'>('VIEW');

  useEffect(() => {
    if (open) {
      loadShares();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, plan.id]);

  async function loadShares() {
    try {
      const response = await fetch(`/api/v1/apps/visionflow/plans/${plan.id}/shares`);
      if (response.ok) {
        const data = await response.json();
        setShares(data.shares || []);
      }
    } catch (err) {
      console.error('Error loading shares:', err);
    }
  }

  async function handleShare(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body: any = {
        access_level: accessLevel,
      };

      if (shareType === 'user') {
        // In a real app, you'd search for users by email or have a user picker
        // For now, we'll use the email as a placeholder
        body.shared_with_user_id = shareTarget; // This should be a user ID
      } else {
        body.shared_with_org_id = shareTarget; // This should be an org ID
      }

      const response = await fetch(`/api/v1/apps/visionflow/plans/${plan.id}/shares`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to share plan');
      }

      // Reset form
      setShareTarget('');
      setAccessLevel('VIEW');
      await loadShares();
      onSuccess();
    } catch (err) {
      console.error('Error sharing plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to share plan');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveShare(shareId: string) {
    try {
      const response = await fetch(
        `/api/v1/apps/visionflow/plans/${plan.id}/shares/${shareId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove share');
      }

      await loadShares();
      onSuccess();
    } catch (err) {
      console.error('Error removing share:', err);
      alert('Failed to remove share. Please try again.');
    }
  }

  return (
    <GlowModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Share Plan: ${plan.title}`}
      description="Share this plan with users or organizations"
      size="lg"
      footer={
        <GlowModalClose asChild>
          <GlowButton variant="outline">Close</GlowButton>
        </GlowModalClose>
      }
    >
      <div className="space-y-6">
        {/* Share Form */}
        <form onSubmit={handleShare} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <GlowButton
              type="button"
              variant={shareType === 'user' ? 'default' : 'outline'}
              onClick={() => setShareType('user')}
              size="sm"
            >
              <User className="h-4 w-4" />
              User
            </GlowButton>
            <GlowButton
              type="button"
              variant={shareType === 'org' ? 'default' : 'outline'}
              onClick={() => setShareType('org')}
              size="sm"
            >
              <Building2 className="h-4 w-4" />
              Organization
            </GlowButton>
          </div>

          <GlowInput
            label={shareType === 'user' ? 'User Email or ID' : 'Organization ID'}
            placeholder={
              shareType === 'user'
                ? 'user@example.com'
                : 'Enter organization ID'
            }
            value={shareTarget}
            onChange={(e) => setShareTarget(e.target.value)}
            required
            variant="glow"
          />

          <GlowSelect
            label="Access Level"
            value={accessLevel}
            onChange={(e) =>
              setAccessLevel(e.target.value as 'VIEW' | 'COMMENT' | 'EDIT')
            }
          >
            <option value="VIEW">View Only</option>
            <option value="COMMENT">Can Comment</option>
            <option value="EDIT">Can Edit</option>
          </GlowSelect>

          <GlowButton
            type="submit"
            variant="default"
            glow="medium"
            disabled={loading || !shareTarget.trim()}
            className="w-full"
          >
            {loading ? 'Sharing...' : 'Share Plan'}
          </GlowButton>
        </form>

        {/* Existing Shares */}
        {shares.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Shared With</h3>
            <div className="space-y-2">
              {shares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    {share.shared_with_user ? (
                      <>
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {share.shared_with_user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {share.shared_with_user.email}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {share.shared_with_org?.name}
                          </p>
                          <p className="text-xs text-gray-500">Organization</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <GlowBadge variant="outline" size="sm">
                      {share.access_level}
                    </GlowBadge>
                    <button
                      onClick={() => handleRemoveShare(share.id)}
                      className="rounded p-1 text-gray-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlowModal>
  );
}

