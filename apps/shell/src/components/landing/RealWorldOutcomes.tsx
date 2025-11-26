import { Container, Stack, Title, Text, Grid } from '@/components/glow-ui';
import { Target, Boxes, Zap, Lightbulb, FileCheck, TrendingUp } from 'lucide-react';

export function RealWorldOutcomes() {
  const outcomes = [
    {
      icon: Target,
      title: 'Clearer Strategies',
      description: 'Stronger alignment across teams',
    },
    {
      icon: Boxes,
      title: 'Coherent Models',
      description: 'Better program architecture',
    },
    {
      icon: Zap,
      title: 'Faster Planning',
      description: 'Reduced confusion and delays',
    },
    {
      icon: Lightbulb,
      title: 'Meaningful Data',
      description: 'Human-centered insights',
    },
    {
      icon: FileCheck,
      title: 'Easier Reporting',
      description: 'Faster and more credible',
    },
    {
      icon: TrendingUp,
      title: 'Confident Narratives',
      description: 'Evidence-grounded impact stories',
    },
  ];

  return (
    <section className="py-28 bg-white">
      <Container>
        <div className="max-w-6xl mx-auto">
          <Stack spacing="2xl">
            {/* Section Header */}
            <Stack spacing="md" align="center" className="text-center">
              <Title level={2} className="text-4xl sm:text-5xl font-bold text-[#001A33]">
                What Organizations Experience
              </Title>
              <div className="w-20 h-1.5 bg-gradient-to-r from-[#007F5F] to-[#00B88D] mx-auto rounded-full"></div>
              <Text size="lg" className="max-w-3xl text-gray-600 mt-4">
                Real results that mission-driven organizations see when they move to an integrated operating system.
              </Text>
            </Stack>

            {/* 3x2 Grid for Visual Balance */}
            <Grid columns={3} gap="lg" className="mt-12">
              {outcomes.map((outcome, index) => {
                const Icon = outcome.icon;
                return (
                  <div
                    key={index}
                    className="group text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-[#007F5F]/30 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Icon */}
                    <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[#007F5F]/10 to-[#00B88D]/10 items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-[#007F5F]" />
                    </div>

                    {/* Content */}
                    <Stack spacing="xs">
                      <Text weight="bold" size="lg" className="text-[#001A33] leading-tight">
                        {outcome.title}
                      </Text>
                      <Text size="sm" className="text-gray-600">
                        {outcome.description}
                      </Text>
                    </Stack>
                  </div>
                );
              })}
            </Grid>
          </Stack>
        </div>
      </Container>
    </section>
  );
}
