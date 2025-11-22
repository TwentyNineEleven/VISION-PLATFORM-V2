import Link from 'next/link';
import { getAppBySlug } from '@/lib/vision-apps';
import {
  GlowBadge,
  GlowButton,
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
} from '@/components/glow-ui';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default async function AppOnboardingPage({
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
            <Link href="/apps">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Apps
            </Link>
          </GlowButton>
        </GlowCardContent>
      </GlowCard>
    );
  }

  const launchHref = app.launchPath || `/apps/${app.slug}`;
  const audienceLabel = app.audience
    ? app.audience.charAt(0).toUpperCase() + app.audience.slice(1)
    : 'All audiences';

  const steps = [
    'Confirm workspace and team members',
    'Review prerequisites and sample data',
    'Walk through a guided first task',
    'Launch the live experience',
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <GlowBadge variant="info" size="sm">
          Onboarding
        </GlowBadge>
        <h1 className="text-3xl font-semibold leading-tight text-foreground">
          {app.name}
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Get set up in minutes. We&apos;ll guide you through the essentials so
          your team can jump into the full experience with confidence.
        </p>
        <div className="flex flex-wrap gap-2">
          <GlowBadge variant="outline" size="sm" className="bg-muted/50">
            {app.phase}
          </GlowBadge>
          <GlowBadge variant="outline" size="sm" className="bg-muted/50">
            {audienceLabel}
          </GlowBadge>
        </div>
      </div>

      <GlowCard variant="default">
        <GlowCardHeader>
          <GlowCardTitle className="text-lg">Setup steps</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent className="grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-start gap-3 rounded-lg border border-border bg-card/60 p-4"
            >
              <div className="mt-0.5">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Step {index + 1}
                </p>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            </div>
          ))}
        </GlowCardContent>
      </GlowCard>

      <div className="flex flex-wrap gap-3">
        <GlowButton asChild glow="subtle">
          <Link href={launchHref as any}>
            Launch {app.name}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </GlowButton>
        <GlowButton asChild variant="outline">
          <Link href={`/apps/${app.slug}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to overview
          </Link>
        </GlowButton>
      </div>
    </div>
  );
}
