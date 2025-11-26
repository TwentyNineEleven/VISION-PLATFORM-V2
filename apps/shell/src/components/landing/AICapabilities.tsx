import { Container, Stack, Grid, Title, Text, GlowCard, GlowCardContent } from '@/components/glow-ui';
import { FileText, PenTool, BarChart3, Network, FileCheck, TrendingUp, Users } from 'lucide-react';

const capabilities = [
  {
    icon: FileText,
    title: 'Summaries',
    description: 'Synthesize complex information into clear, actionable insights',
  },
  {
    icon: PenTool,
    title: 'Drafting',
    description: 'Generate first drafts for proposals, reports, and strategic documents',
  },
  {
    icon: BarChart3,
    title: 'Analysis',
    description: 'Analyze data, identify patterns, and extract meaningful conclusions',
  },
  {
    icon: Network,
    title: 'Logic models',
    description: 'Create visual representations of your program theory and outcomes',
  },
  {
    icon: FileCheck,
    title: 'Reports',
    description: 'Generate comprehensive reports for stakeholders and funders',
  },
  {
    icon: TrendingUp,
    title: 'Charts',
    description: 'Visualize data and progress with clear, compelling graphics',
  },
  {
    icon: Users,
    title: 'Collaboration support',
    description: 'Facilitate team discussions and synthesize diverse perspectives',
  },
];

export function AICapabilities() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <Container>
        <Stack spacing="xl">
          <Stack spacing="md" align="center" className="text-center">
            <Title level={2}>AI that supports your thinking — not replaces it.</Title>
            <Text size="lg" color="secondary" className="max-w-3xl">
              Simple. Helpful. Practical.
            </Text>
          </Stack>

          <Grid columns={3} gap="lg" className="mt-8">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <GlowCard key={index} variant="interactive" padding="lg">
                  <GlowCardContent>
                    <Stack spacing="md" align="center" className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <Stack spacing="xs">
                        <Text weight="semibold">{capability.title}</Text>
                        <Text size="sm" color="secondary">
                          {capability.description}
                        </Text>
                      </Stack>
                    </Stack>
                  </GlowCardContent>
                </GlowCard>
              );
            })}
          </Grid>

          <div className="bg-blue-50 rounded-2xl p-8 mt-8 border border-blue-100">
            <Text className="text-center max-w-2xl mx-auto">
              Our AI is designed to enhance your expertise and creativity — helping you work faster and smarter while keeping you in control of every decision.
            </Text>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
