import { Container, Stack, Grid, Title, Text, GlowButton, GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, GlowBadge } from '@/components/glow-ui';
import { VISION_APPS } from '@/lib/vision-apps';
import { ArrowRight, Grid3x3 } from 'lucide-react';
import Link from 'next/link';
import { AppIcon } from '@/components/apps/AppIcon';
import { getAppMeta } from '@/lib/apps/appMetadata';

export function Features() {
  const featuredApps = VISION_APPS.filter((app) => app.isPopular || app.isNew).slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <Container>
        <Stack spacing="xl">
          <Stack spacing="sm" align="center" className="text-center">
            <Title level={2}>21 Apps. One Ecosystem.</Title>
            <Text size="lg" color="secondary">
              Every tool you need to create lasting social impact
            </Text>
          </Stack>

          <Grid columns={3} gap="lg">
            {featuredApps.map((app) => {
              const appMeta = getAppMeta(app.slug);
              return (
                <GlowCard key={app.id} variant="interactive">
                  <GlowCardHeader>
                    <Stack spacing="sm">
                      {appMeta ? (
                        <AppIcon app={appMeta} size="md" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#64748B]">
                          <Grid3x3 className="h-5 w-5" />
                        </div>
                      )}
                      <Stack spacing="xs">
                        <GlowCardTitle>{app.name}</GlowCardTitle>
                        <GlowBadge variant="secondary" size="sm">
                          {app.moduleLabel}
                        </GlowBadge>
                      </Stack>
                    </Stack>
                  </GlowCardHeader>
                  <GlowCardContent>
                    <Stack spacing="md">
                      <Text size="sm" color="secondary">
                        {app.shortDescription}
                      </Text>
                      <Link
                        href="/signup"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                      >
                        Learn more <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Stack>
                  </GlowCardContent>
                </GlowCard>
              );
            })}
          </Grid>

          <div className="text-center">
            <Link href="/applications">
              <GlowButton variant="outline" size="lg">
                View All 21 Apps
              </GlowButton>
            </Link>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
