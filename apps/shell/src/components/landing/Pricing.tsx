import { Container, Stack, Grid, Group, Title, Text, GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, GlowButton, GlowBadge } from '@/components/glow-ui';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Individual',
    price: 'Coming Soon',
    description: 'For solo practitioners and consultants',
    features: ['Full access to VISION', 'AI support', 'Unlimited exports', 'Personal workspace', 'Community support'],
    cta: 'Join Waitlist',
    highlighted: false,
  },
  {
    name: 'Organization',
    price: 'Coming Soon',
    description: 'For nonprofits and social enterprises',
    features: [
      'Full access to VISION',
      'AI support',
      'Unlimited exports',
      'Team collaboration',
      'Priority support',
      'Custom branding',
    ],
    cta: 'Join Waitlist',
    highlighted: true,
  },
  {
    name: 'Consultant',
    price: 'Coming Soon',
    description: 'For consultants supporting multiple clients',
    features: [
      'Full access to VISION',
      'AI support',
      'Unlimited exports',
      'Multi-organization management',
      'White-label options',
      'Dedicated support',
    ],
    cta: 'Join Waitlist',
    highlighted: false,
  },
  {
    name: 'Funder Cohort',
    price: 'Custom',
    description: 'For foundations supporting grantee cohorts',
    features: [
      'Full access for all grantees',
      'AI support',
      'Unlimited exports',
      'Cohort management',
      'Aggregate reporting',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <Stack spacing="xl">
          <Stack spacing="sm" align="center" className="text-center">
            <Title level={2}>Simple, clear pricing.</Title>
            <Text size="lg" color="secondary">
              All plans include full access to VISION, AI support, and unlimited exports.
            </Text>
          </Stack>

          <Grid columns={2} gap="lg" className="md:grid-cols-4">
            {plans.map((plan) => (
              <GlowCard
                key={plan.name}
                variant={plan.highlighted ? 'elevated' : 'interactive'}
                className={plan.highlighted ? 'ring-2 ring-blue-500' : ''}
              >
                <GlowCardHeader>
                  <Group justify="between" align="start">
                    <GlowCardTitle>{plan.name}</GlowCardTitle>
                    {plan.highlighted && (
                      <GlowBadge variant="info" size="sm">
                        Popular
                      </GlowBadge>
                    )}
                  </Group>
                  <Stack spacing="xs" className="mt-4">
                    <Group spacing="xs" align="baseline">
                      <Text size="xl" weight="bold" className="text-4xl">
                        {plan.price}
                      </Text>
                      {plan.price !== 'Custom' && (
                        <Text color="secondary">/month</Text>
                      )}
                    </Group>
                    <Text size="sm" color="secondary">
                      {plan.description}
                    </Text>
                  </Stack>
                </GlowCardHeader>
                <GlowCardContent>
                  <Stack spacing="lg">
                    <Stack spacing="sm">
                      {plan.features.map((feature) => (
                        <Group key={feature} spacing="sm" align="start">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <Text size="sm">{feature}</Text>
                        </Group>
                      ))}
                    </Stack>
                    <GlowButton
                      variant={plan.highlighted ? 'default' : 'outline'}
                      size="lg"
                      className="w-full"
                      glow={plan.highlighted ? 'subtle' : undefined}
                    >
                      {plan.cta}
                    </GlowButton>
                  </Stack>
                </GlowCardContent>
              </GlowCard>
            ))}
          </Grid>
        </Stack>
      </Container>
    </section>
  );
}

