import { Container, Stack, Grid, Title, Text, GlowCard, GlowCardContent } from '@/components/glow-ui';
import { Users, Lightbulb, Target, Rocket, Settings, BookOpen } from 'lucide-react';

const stages = [
  {
    icon: Users,
    title: 'Understand community needs',
  },
  {
    icon: Lightbulb,
    title: 'Generate and refine ideas',
  },
  {
    icon: Target,
    title: 'Build strategies aligned to outcomes',
  },
  {
    icon: Rocket,
    title: 'Develop implementation plans',
  },
  {
    icon: Settings,
    title: 'Strengthen operations',
  },
  {
    icon: BookOpen,
    title: 'Measure and narrate impact',
  },
];

export function CompletePlatform() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <Stack spacing="xl">
          <Stack spacing="md" align="center" className="text-center">
            <Title level={2}>A complete strategic planning system — from discovery to evaluation.</Title>
            <Text size="lg" color="secondary" className="max-w-3xl">
              The VISION Platform guides organizations through every stage:
            </Text>
          </Stack>

          <Grid columns={3} gap="lg">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <GlowCard key={index} variant="interactive" padding="lg">
                  <GlowCardContent>
                    <Stack spacing="md" align="center" className="text-center">
                      <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-blue-600" />
                      </div>
                      <Text weight="medium">{stage.title}</Text>
                    </Stack>
                  </GlowCardContent>
                </GlowCard>
              );
            })}
          </Grid>

          <Text size="lg" className="text-center max-w-2xl mx-auto font-medium">
            All supported by helpful AI that enhances your thinking — never replaces it.
          </Text>
        </Stack>
      </Container>
    </section>
  );
}
