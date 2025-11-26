import { Container, Stack, Group, Title, Text, GlowButton } from '@/components/glow-ui';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#001A33] via-[#003D5C] to-[#007F5F] min-h-[720px] flex items-center py-32 sm:py-40">
      {/* Intelligence Core Visual - Circular AI Core */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Central Intelligence Core */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[#007F5F]/20 animate-pulse"></div>
          {/* Middle ring */}
          <div className="absolute inset-8 rounded-full border border-[#007F5F]/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          {/* Inner core */}
          <div className="absolute inset-16 rounded-full bg-gradient-to-br from-[#007F5F]/30 to-[#00B88D]/20 blur-3xl"></div>
        </div>

        {/* Neural Mesh Background */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#007F5F] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#007F5F] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#00B88D] rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-4000" />

        {/* Pulsing nodes */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#007F5F] rounded-full animate-pulse shadow-lg shadow-[#007F5F]/50"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#00B88D] rounded-full animate-pulse shadow-lg shadow-[#00B88D]/50" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-[#007F5F] rounded-full animate-pulse shadow-lg shadow-[#007F5F]/50" style={{ animationDelay: '0.6s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-[#00B88D] rounded-full animate-pulse shadow-lg shadow-[#00B88D]/50" style={{ animationDelay: '0.9s' }}></div>
      </div>

      <Container className="relative z-10">
        <div className="max-w-6xl mx-auto">
          <Stack spacing="2xl" align="center" className="text-center">
            {/* VISION AI Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#007F5F]/20 border border-[#007F5F]/40 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-[#00B88D]" />
              <Text size="sm" weight="bold" className="text-white tracking-wide">
                POWERED BY VISION AI™
              </Text>
            </div>

            {/* Headline */}
            <Stack spacing="lg" className="mt-6">
              <Title level={1} className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-white max-w-5xl mx-auto">
                The Intelligence Engine
                <br />
                <span className="bg-gradient-to-r from-[#007F5F] via-[#00D9A0] to-[#00B88D] bg-clip-text text-transparent">
                  Behind Mission-Driven Impact
                </span>
              </Title>

              {/* Subheadline */}
              <Text className="max-w-4xl mx-auto text-blue-50 leading-relaxed font-medium text-2xl sm:text-3xl mt-8 px-4">
                The Vision Impact Hub unifies strategy, community voice, operations, data, and impact into one intelligent platform powered by VISION AI™.
              </Text>
            </Stack>

            {/* Narrative Text */}
            <div className="max-w-3xl mx-auto mt-8">
              <Text className="text-lg text-blue-100/90 leading-relaxed">
                No more fragmentation. No more disconnected tools. No more guessing. The Vision Impact Hub helps your organization understand what’s working, where to improve, and how to create long-term, evidence-driven impact.
              </Text>
            </div>

            {/* CTAs */}
            <Group spacing="lg" className="flex-col sm:flex-row mt-12">
              <GlowButton
                size="lg"
                variant="default"
                glow="strong"
                rightIcon={<ArrowRight />}
                className="text-xl px-12 py-8 bg-[#007F5F] hover:bg-[#00B88D] shadow-2xl hover:shadow-[0_25px_70px_-15px_rgba(0,127,95,0.6)] transition-all duration-300 font-bold"
              >
                Explore the Vision Impact Hub
              </GlowButton>
              <GlowButton
                size="lg"
                variant="outline"
                className="text-xl px-12 py-8 border-2 border-white/90 text-white hover:bg-white/15 hover:border-white transition-all duration-300 font-bold backdrop-blur-sm"
              >
                Book a Personal Demo
              </GlowButton>
            </Group>

            {/* Trust Signals */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#007F5F]"></div>
                <span>Built with practitioners</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#007F5F]"></div>
                <span>Grounded in community insight</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#007F5F]"></div>
                <span>Powered by VISION AI™</span>
              </div>
            </div>
          </Stack>
        </div>
      </Container>
    </section>
  );
}
