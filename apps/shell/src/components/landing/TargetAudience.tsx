import { Container, Stack, Title, Text, Grid } from '@/components/glow-ui';
import { Building2, Users, Briefcase } from 'lucide-react';

export function TargetAudience() {
  const audiences = [
    {
      icon: Building2,
      title: 'Organizations',
      subtitle: 'Mission-Driven Teams',
      description: 'Nonprofits, social enterprises, and mission-driven organizations seeking structure, intelligence, and clarity to maximize their impact.',
    },
    {
      icon: Users,
      title: 'Consultants',
      subtitle: 'Advisors & Practitioners',
      description: 'Consultants and advisors supporting multiple organizations at scale, needing powerful tools to serve their clients effectively.',
    },
    {
      icon: Briefcase,
      title: 'Funders',
      subtitle: 'Foundations & Intermediaries',
      description: 'Funders and intermediaries requiring portfolio-level insights, streamlined reporting, and clear evidence of impact across grantees.',
    },
  ];

  return (
    <section className="py-28 bg-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          <Stack spacing="2xl">
            {/* Section Header */}
            <Stack spacing="md" align="center" className="text-center">
              <Title level={2} className="text-4xl sm:text-5xl font-bold text-[#001A33]">
                Who the Hub Is For
              </Title>
              <div className="w-20 h-1.5 bg-gradient-to-r from-[#007F5F] to-[#00B88D] mx-auto rounded-full"></div>
            </Stack>

            {/* 3-Column Card Layout */}
            <Grid columns={3} gap="lg" className="mt-12">
              {audiences.map((audience, index) => {
                const Icon = audience.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[#007F5F]/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#007F5F] to-[#00B88D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <Stack spacing="sm">
                      <div>
                        <Text weight="bold" size="xl" className="text-[#001A33] leading-tight block mb-1">
                          {audience.title}
                        </Text>
                        <Text size="sm" className="text-[#007F5F] font-medium">
                          {audience.subtitle}
                        </Text>
                      </div>
                      <Text size="sm" className="text-gray-600 leading-relaxed mt-3">
                        {audience.description}
                      </Text>
                    </Stack>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#007F5F] to-[#00B88D] rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
