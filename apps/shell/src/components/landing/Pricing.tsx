import { Container, Stack, Title, Text, GlowButton, Grid } from '@/components/glow-ui';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

export function Pricing() {
  const included = [
    'Complete Core Infrastructure',
    'VISION AI™ Intelligence Layer',
    'All 6 Transformation Areas',
    'All 21 Applications',
    'Unlimited Users & Data',
    'Priority Support',
  ];

  return (
    <section className="py-28 bg-gradient-to-br from-white via-gray-50 to-white">
      <Container>
        <div className="max-w-5xl mx-auto">
          <Stack spacing="2xl">
            {/* Section Header */}
            <Stack spacing="md" align="center" className="text-center">
              <Title level={2} className="text-4xl sm:text-5xl font-bold text-[#001A33]">
                Simple, All-Inclusive Pricing
              </Title>
              <div className="w-20 h-1.5 bg-gradient-to-r from-[#007F5F] to-[#00B88D] mx-auto rounded-full"></div>
              <Text size="lg" className="max-w-3xl text-gray-600 mt-4">
                One platform. One price. Everything included. No hidden fees or tiered limitations.
              </Text>
            </Stack>

            {/* Pricing Card */}
            <div className="relative group mt-12">
              {/* Gradient glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#007F5F] via-[#00B88D] to-[#007F5F] rounded-3xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>

              <div className="relative bg-white p-10 rounded-2xl border-2 border-gray-200 shadow-xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#007F5F]/10 border border-[#007F5F]/20 mb-4">
                    <Sparkles className="w-4 h-4 text-[#007F5F]" />
                    <Text size="sm" weight="bold" className="text-[#007F5F]">
                      Complete Platform Access
                    </Text>
                  </div>

                  <Text size="xl" className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                    Pricing is structured to support organizations, consultants, and funders at any scale.
                  </Text>
                </div>

                {/* What's Included */}
                <div className="mt-8 mb-10">
                  <Text weight="bold" size="lg" className="text-[#001A33] text-center mb-6">
                    Everything Included
                  </Text>
                  <Grid columns={2} gap="md">
                    {included.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#007F5F]/10 flex items-center justify-center">
                          <Check className="w-4 h-4 text-[#007F5F]" />
                        </div>
                        <Text size="sm" className="text-gray-700">
                          {item}
                        </Text>
                      </div>
                    ))}
                  </Grid>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <GlowButton
                    size="lg"
                    variant="default"
                    glow="strong"
                    rightIcon={<ArrowRight />}
                    className="bg-[#007F5F] hover:bg-[#00B88D] text-lg px-10 py-7 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Talk to Us About Pricing
                  </GlowButton>
                </div>
              </div>
            </div>
          </Stack>
        </div>
      </Container>
    </section>
  );
}

