import { Container, Stack, Title, Text, Group, GlowButton } from '@/components/glow-ui';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#001A33] via-[#003D5C] to-[#007F5F] text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#007F5F] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#00B88D] rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10">
        <Stack spacing="xl" align="center" className="text-center">
          <Stack spacing="md">
            <Title level={2} className="text-white text-4xl sm:text-5xl max-w-4xl">
              The future of mission-driven impact is connected, intelligent, and centered on your community.
            </Title>

            <Stack spacing="md" className="max-w-4xl mt-6">
              <Text size="lg" className="text-white/90 leading-relaxed">
                The Vision Impact Hub brings together infrastructure, intelligence, strategy, and applications into one unified system.
              </Text>

              <Text size="lg" className="text-white/90 leading-relaxed">
                Move beyond disconnected tools and experience how connected data, AI-enhanced thinking, and strategic clarity transform the way you understand community needs, design programs, execute plans, and communicate results.
              </Text>

              <Text size="lg" className="text-white/90 leading-relaxed">
                This is the platform mission-driven organizations have been asking for.
              </Text>

              <Text size="lg" className="text-white font-semibold leading-relaxed">
                Now it’s here.
              </Text>
            </Stack>
          </Stack>

          <Group spacing="md" className="flex-col sm:flex-row mt-8">
            <GlowButton
              size="lg"
              variant="default"
              glow="strong"
              rightIcon={<ArrowRight />}
              className="bg-[#007F5F] hover:bg-[#00B88D] text-white text-lg px-8 py-6 shadow-xl"
            >
              Book a Demo
            </GlowButton>
            <GlowButton
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Explore the Platform
            </GlowButton>
          </Group>
        </Stack>
      </Container>
    </section>
  );
}
