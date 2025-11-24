import { Container, Stack, Grid, Title, Text, GlowCard, GlowCardContent } from '@/components/glow-ui';
import { Users, Database, BarChart3, Building2, FileText, PenTool, BookOpen } from 'lucide-react';

const aiCapabilities = [
  {
    icon: Users,
    title: 'CRM',
    description: 'AI identifies engagement patterns, follow-ups, relationships, and stakeholder needs.',
  },
  {
    icon: Database,
    title: 'Data Warehouse',
    description: 'AI helps build KPIs, evaluate trendlines, and interpret performance.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'AI generates dashboards, summaries, and insight-rich visualizations.',
  },
  {
    icon: Building2,
    title: 'OrgDB',
    description: 'AI highlights organizational strengths, risks, capacity gaps, and improvement opportunities.',
  },
  {
    icon: FileText,
    title: 'DocAI',
    description: 'AI extracts key points, evidence, and structure from any document you upload.',
  },
  {
    icon: PenTool,
    title: 'GrantWriter',
    description: 'AI produces full funder-ready narrative drafts grounded in your real program data.',
  },
  {
    icon: BookOpen,
    title: 'Impact Storytelling',
    description: 'AI converts data + lived experience into compelling impact communication.',
  },
];

export function VisionAIAcrossPlatform() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <Container>
        <Stack spacing="xl">
          <Stack spacing="md" align="center" className="text-center">
            <Title level={2}>VISION AI™ Across the Platform</Title>
            <Text size="lg" color="secondary" className="max-w-3xl">
              Intelligent automation and insights woven throughout every component of the Hub.
            </Text>
          </Stack>

          <Grid columns={2} gap="lg" className="mt-8">
            {aiCapabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <GlowCard key={index} variant="elevated" padding="lg">
                  <GlowCardContent>
                    <Stack spacing="md">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <Title level={5}>{capability.title}</Title>
                      </div>
                      <Text size="sm" color="secondary">
                        {capability.description}
                      </Text>
                    </Stack>
                  </GlowCardContent>
                </GlowCard>
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </section>
  );
}
