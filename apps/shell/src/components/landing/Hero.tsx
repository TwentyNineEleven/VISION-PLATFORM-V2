import { Container, Stack, Group, Title, Text, GlowButton, GlowBadge } from '@/components/glow-ui';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
      <Container>
        <Stack spacing="xl" align="center">
          <GlowBadge variant="info" size="lg" leftIcon={<Sparkles className="w-4 h-4" />}>
            Microsoft 365 for Nonprofits
          </GlowBadge>

          <Stack spacing="md" align="center" className="text-center">
            <Title level={1}>
              One Platform.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Every Tool You Need.
              </span>
            </Title>

            <Text size="lg" color="secondary" className="max-w-2xl">
              VISION brings together 21 purpose-built apps to help nonprofits, foundations, and consultants plan, execute, and measure social
              impact—all in one connected workspace.
            </Text>
          </Stack>

          <Group spacing="md" className="flex-col sm:flex-row">
            <GlowButton size="lg" variant="default" glow="strong" rightIcon={<ArrowRight />}>
              Start Free Trial
            </GlowButton>
            <GlowButton size="lg" variant="outline" leftIcon={<Play />}>
              Watch Demo
            </GlowButton>
          </Group>

          <Text size="sm" color="tertiary">
            Trusted by 500+ organizations to manage $2B+ in social impact
          </Text>
        </Stack>
      </Container>
    </section>
  );
}
