import { Container, Stack, Grid, Title, Text, GlowCard, GlowCardContent } from '@/components/glow-ui';
import { Users, Sparkles, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Connect Your Team',
    description: 'Invite your team, set up your workspace, and define your organizational profile in minutes.',
    icon: Users,
  },
  {
    number: '02',
    title: 'Choose Your Apps',
    description: 'Select from 21 purpose-built apps across 6 impact phases—from community listening to reporting.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Create Impact',
    description: 'Design programs, track outcomes, manage grants, and tell your impact story—all in one place.',
    icon: Rocket,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <Stack spacing="xl">
          <Stack spacing="sm" align="center" className="text-center">
            <Title level={2}>How It Works</Title>
            <Text size="lg" color="secondary">
              Get started in three simple steps
            </Text>
          </Stack>

          <Grid columns={3} gap="lg">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <GlowCard key={step.number} variant="elevated" padding="lg">
                  <Stack spacing="md">
                    <Text size="xl" weight="bold" className="text-4xl text-blue-600">
                      {step.number}
                    </Text>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <Title level={4}>{step.title}</Title>
                    <Text color="secondary">{step.description}</Text>
                  </Stack>
                </GlowCard>
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </section>
  );
}

