import { Container, Stack, Grid, Title, Text, GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent } from '@/components/glow-ui';

const modules = [
  {
    name: 'VOICE',
    phase: 'Discovery',
    description: 'Listen to community needs and understand the context for your work',
  },
  {
    name: 'INSPIRE',
    phase: 'Visioning',
    description: 'Develop your mission, vision, and generate transformative ideas',
  },
  {
    name: 'STRATEGIZE',
    phase: 'Strategy creation',
    description: 'Build comprehensive program models and theories of change',
  },
  {
    name: 'INITIATE',
    phase: 'Implementation',
    description: 'Create detailed plans and launch your programs with confidence',
  },
  {
    name: 'OPERATE',
    phase: 'Systems and governance',
    description: 'Strengthen operational foundations and organizational capacity',
  },
  {
    name: 'NARRATE',
    phase: 'Evaluation and storytelling',
    description: 'Track outcomes, measure impact, and tell your compelling story',
  },
];

export function TEIFFramework() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-white">
      <Container>
        <Stack spacing="xl">
          <Stack spacing="md" align="center" className="text-center">
            <Title level={2}>Grounded in The Exile Impact Framework (TEIF)</Title>
            <Text size="lg" color="secondary" className="max-w-3xl">
              Every module aligns with TEIF&apos;s transformation process:
            </Text>
          </Stack>

          <Grid columns={3} gap="lg">
            {modules.map((module, index) => (
              <GlowCard key={index} variant="elevated">
                <GlowCardHeader>
                  <GlowCardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {module.name}
                  </GlowCardTitle>
                  <Text size="sm" weight="medium" className="text-blue-600 mt-1">
                    {module.phase}
                  </Text>
                </GlowCardHeader>
                <GlowCardContent>
                  <Text size="sm" color="secondary">
                    {module.description}
                  </Text>
                </GlowCardContent>
              </GlowCard>
            ))}
          </Grid>
        </Stack>
      </Container>
    </section>
  );
}
