import { Container, Stack, Group, Title, Text, GlowButton, GlowBadge } from '@/components/glow-ui';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
      <Container>
        <Stack spacing="xl" align="center">
          <Stack spacing="md" align="center" className="text-center">
            <Title level={1}>
              Strategic Planning for
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mission-Driven Organizations
              </span>
            </Title>

            <Text size="lg" color="secondary" className="max-w-2xl">
              AI-powered. Human-centered. Built for real-world impact.
            </Text>

            <Text size="base" color="secondary" className="max-w-3xl mt-4">
              The VISION Platform helps mission-driven organizations design, plan, and track high-quality programs with clarity and confidence — using structured workflows grounded in the TEIF Framework.
            </Text>
          </Stack>

          <Group spacing="md" className="flex-col sm:flex-row">
            <GlowButton size="lg" variant="default" glow="strong" rightIcon={<ArrowRight />}>
              Get Early Access
            </GlowButton>
            <GlowButton size="lg" variant="outline" leftIcon={<Play />}>
              Watch Demo
            </GlowButton>
          </Group>
        </Stack>
      </Container>
    </section>
  );
}
