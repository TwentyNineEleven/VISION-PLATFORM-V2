import { Container, Stack, Title, Text, Grid } from '@/components/glow-ui';
import { Layers, Brain, GitBranch, Users } from 'lucide-react';

export function WhyDifferent() {
  const differentiators = [
    {
      icon: Layers,
      title: 'One Unified Platform',
      description: 'Instead of fragmented systems',
    },
    {
      icon: Brain,
      title: 'One Intelligence Layer',
      description: 'Instead of scattered interpretation',
    },
    {
      icon: GitBranch,
      title: 'One Continuous Workflow',
      description: 'Supporting the full lifecycle of impact',
    },
    {
      icon: Users,
      title: 'Built by Practitioners',
      description: 'Who understand mission-driven complexity',
    },
  ];

  return (
    <section className="py-28 bg-gradient-to-b from-white to-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          <Stack spacing="2xl">
            {/* Section Header */}
            <Stack spacing="md" align="center" className="text-center">
              <Title level={2} className="text-4xl sm:text-5xl font-bold text-[#001A33]">
                Why the Vision Impact Hub Is Different
              </Title>
              <div className="w-20 h-1.5 bg-gradient-to-r from-[#007F5F] to-[#00B88D] mx-auto rounded-full"></div>
            </Stack>

            {/* 2x2 Grid Layout for Better Balance */}
            <Grid columns={2} gap="lg" className="mt-12">
              {differentiators.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[#007F5F]/40 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Icon and Title Row */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#007F5F]/10 to-[#00B88D]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-7 h-7 text-[#007F5F]" />
                      </div>
                      <div className="flex-1">
                        <Text weight="bold" size="xl" className="text-[#001A33] leading-tight mb-2">
                          {item.title}
                        </Text>
                        <Text size="sm" className="text-gray-600 leading-relaxed">
                          {item.description}
                        </Text>
                      </div>
                    </div>

                    {/* Subtle gradient accent on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#007F5F]/0 via-[#007F5F]/0 to-[#007F5F]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
