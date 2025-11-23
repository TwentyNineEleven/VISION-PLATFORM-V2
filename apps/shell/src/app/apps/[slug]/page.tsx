import Link from 'next/link';
import {
  GlowBadge,
  GlowButton,
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
} from '@/components/glow-ui';
import { getAppBySlug } from '@/lib/vision-apps';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const app = getAppBySlug(slug);

  if (!app) {
    return (
      <GlowCard variant="glow">
        <GlowCardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <Sparkles className="h-8 w-8 text-muted-foreground" />
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">
              App not found
            </h2>
            <p className="text-muted-foreground">
              We could not find that app. Head back to the launcher to explore
              everything available.
            </p>
          </div>
          <GlowButton asChild variant="outline" size="sm">
            <Link href="/applications">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Apps
            </Link>
          </GlowButton>
        </GlowCardContent>
      </GlowCard>
    );
  }

  const status = app.status || 'available';
  const launchHref = app.launchPath || `/apps/${app.slug}`;
  const onboardingHref = app.onboardingPath;
  const statusLabel =
    (status === 'coming-soon' && 'Coming soon') ||
    (status === 'beta' && 'Open beta') ||
    'Available';
  const audienceLabel = app.audience
    ? app.audience.charAt(0).toUpperCase() + app.audience.slice(1)
    : 'All audiences';

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <GlowBadge variant="info" size="sm">
            {app.phase}
          </GlowBadge>
          <GlowBadge variant="outline" size="sm" className="bg-muted/50">
            {audienceLabel}
          </GlowBadge>
          {app.transformationArea && (
            <GlowBadge variant="secondary" size="sm">
              {app.transformationArea}
            </GlowBadge>
          )}
          <GlowBadge
            variant={
              status === 'available'
                ? 'success'
                : status === 'beta'
                  ? 'info'
                  : 'warning'
            }
            size="sm"
          >
            {statusLabel}
          </GlowBadge>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold leading-tight text-foreground">
            {app.name}
          </h1>
          <p className="text-muted-foreground">{app.shortDescription}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {app.priceLabel && (
            <GlowBadge variant="outline" size="sm" className="bg-muted/50">
              {app.priceLabel}
            </GlowBadge>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
            <GlowButton
              asChild={status !== 'coming-soon'}
              glow="subtle"
              disabled={status === 'coming-soon'}
            >
              {status === 'coming-soon' ? (
                <span>Coming soon</span>
              ) : (
                <Link href={launchHref as any}>
                  Open app
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              )}
            </GlowButton>

          {onboardingHref && status !== 'coming-soon' && (
            <GlowButton asChild variant="outline">
              <Link href={onboardingHref as any}>
                <Sparkles className="mr-2 h-4 w-4" />
                Start onboarding
              </Link>
            </GlowButton>
          )}

          <GlowButton asChild variant="outline">
            <Link href="/applications">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to launcher
            </Link>
          </GlowButton>
        </div>
      </div>

      <GlowCard variant="default">
        <GlowCardHeader>
          <GlowCardTitle className="text-lg">Overview</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent className="grid gap-6 md:grid-cols-2">
          <DetailItem label="Phase" value={app.phase || app.moduleLabel || 'Module'} />
          <DetailItem
            label="Audience"
            value={audienceLabel}
          />
          <DetailItem
            label="Transformation area"
            value={app.transformationArea || 'Not specified'}
          />
          <DetailItem
            label="Price"
            value={app.priceLabel || 'Included with workspace'}
          />
          <DetailItem label="Status" value={statusLabel} />
          <DetailItem
            label="Availability"
            value={
              status === 'coming-soon'
                ? 'Full experience arriving soon'
                : status === 'beta'
                  ? 'Beta experience available'
                  : 'Available for launch'
            }
          />
        </GlowCardContent>
      </GlowCard>

      {status !== 'available' && (
        <GlowCard variant="glow">
          <GlowCardContent className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Full experience coming soon
            </h3>
            <p className="text-sm text-muted-foreground">
              You can browse the overview today. We are finishing the full
              experience and will notify you as soon as it is ready to launch.
            </p>
          </GlowCardContent>
        </GlowCard>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
