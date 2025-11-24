import { Container, Grid, Stack, Text } from '@/components/glow-ui';
import { Database, Brain, Workflow, Users } from 'lucide-react';

export function ValueStrip() {
  const values = [
    {
      icon: Database,
      title: 'A Unified Operating Environment',
      description: 'A single platform that connects every part of your mission — from community insights to strategic design to operational excellence to impact storytelling.',
    },
    {
      icon: Brain,
      title: 'Mission-Aligned Intelligence',
      description: 'VISION AI™ interprets complex documents, synthesizes data, strengthens models, drafts narratives, and reveals patterns that help teams move faster and smarter.',
    },
    {
      icon: Workflow,
      title: 'End-to-End Transformation Workflow',
      description: 'A complete ecosystem that supports your organization from insight to strategy, from implementation to measurement, and from outcomes to narrative.',
    },
  ];

  return (
    <section className="py-20 bg-[#FAFAFA] border-y border-gray-200">
      <Container>
        <Grid columns={3} gap="xl" className="max-w-7xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="group text-center px-6"
              >
                {/* High-contrast Icon */}
                <div className="inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br from-[#007F5F] to-[#00B88D] items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                </div>

                {/* Content */}
                <Stack spacing="md" align="center">
                  <Text weight="bold" className="text-2xl text-[#001A33] leading-tight">
                    {value.title}
                  </Text>
                  <Text className="text-gray-700 leading-relaxed text-[22px]">
                    {value.description}
                  </Text>
                </Stack>
              </div>
            );
          })}
        </Grid>
      </Container>
    </section>
  );
}
