import { Container, Stack, Grid, Title, Text, GlowCard, GlowCardContent } from '@/components/glow-ui';
import { Building2, Briefcase, DollarSign, Users } from 'lucide-react';

const audiences = [
  {
    icon: Building2,
    title: 'Community organizations',
    description: 'Nonprofits and community-based organizations designing and delivering programs that create lasting change',
  },
  {
    icon: Briefcase,
    title: 'Social enterprises',
    description: 'Mission-driven businesses building sustainable models for social and environmental impact',
  },
  {
    icon: DollarSign,
    title: 'Funders',
    description: 'Foundations and philanthropic organizations supporting grantees and measuring collective impact',
  },
  {
    icon: Users,
    title: 'Consultants',
    description: 'Impact consultants and advisors supporting multiple organizations with strategic planning and evaluation',
  },
];

export function TargetAudience() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <Stack spacing="xl">
          <Stack spacing="md" align="center" className="text-center">
            <Title level={2}>Built for the organizations doing the real work.</Title>
            <Text size="lg" color="secondary" className="max-w-3xl">
              Whether you&apos;re leading a grassroots initiative or managing a portfolio of grantees, VISION adapts to your needs.
            </Text>
          </Stack>

          <Grid columns={2} gap="lg" className="mt-8">
            {audiences.map((audience, index) => {
              const Icon = audience.icon;
              return (
                <GlowCard key={index} variant="elevated" padding="lg">
                  <GlowCardContent>
                    <Stack spacing="md">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-blue-600" />
                      </div>
                      <Stack spacing="xs">
                        <Title level={5}>{audience.title}</Title>
                        <Text size="sm" color="secondary">
                          {audience.description}
                        </Text>
                      </Stack>
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
