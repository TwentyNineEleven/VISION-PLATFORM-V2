import { Container, Stack, Grid, Title, Text, GlowCard, GlowCardContent } from '@/components/glow-ui';
import { Database, BarChart3, Brain, FileText, Building2, GitBranch, Target } from 'lucide-react';

const components = [
  {
    icon: Users,
    title: 'CRM & relationship intelligence',
  },
  {
    icon: Database,
    title: 'Data Warehouse & organizational indicators',
  },
  {
    icon: BarChart3,
    title: 'Analytics & dashboards',
  },
  {
    icon: Building2,
    title: 'Organizational Database (OrgDB)',
  },
  {
    icon: FileText,
    title: 'Document Intelligence (DocAI)',
  },
  {
    icon: GitBranch,
    title: 'GrantWriter & narrative tools',
  },
  {
    icon: Target,
    title: 'All Six Transformation Areas',
  },
];

import { Users } from 'lucide-react';

export function AIEnhancedPlatform() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <Stack spacing="xl">
          <Stack spacing="md" align="center" className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
              <Brain className="w-5 h-5 text-purple-600" />
              <Text size="sm" weight="semibold" className="text-purple-600">
                AN AI-ENHANCED IMPACT PLATFORM
              </Text>
            </div>

            <Title level={2}>More than software — a connected intelligence system.</Title>

            <Text size="lg" color="secondary" className="max-w-3xl">
              VISION AI™ is fully integrated across every component of the Vision Impact Hub:
            </Text>
          </Stack>

          <Grid columns={3} gap="md" className="mt-8">
            {components.map((component, index) => {
              const Icon = component.icon;
              return (
                <GlowCard key={index} variant="interactive" padding="md">
                  <GlowCardContent>
                    <Stack spacing="sm" align="center" className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <Text size="sm" weight="medium">
                        {component.title}
                      </Text>
                    </Stack>
                  </GlowCardContent>
                </GlowCard>
              );
            })}
          </Grid>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 mt-8 border border-purple-100">
            <Text size="lg" weight="medium" className="text-center max-w-3xl mx-auto">
              Instead of multiple disconnected systems, you get one platform that learns with you over time.
            </Text>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
