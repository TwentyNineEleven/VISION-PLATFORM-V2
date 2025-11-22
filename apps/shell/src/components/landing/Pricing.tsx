import { Container, Stack, Grid, Group, Title, Text, GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent, GlowButton, GlowBadge } from '@/components/glow-ui';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for small teams getting started',
    features: ['Up to 3 apps', '5 team members', 'Basic support', '5GB storage', 'Community resources'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$249',
    description: 'For growing organizations',
    features: [
      'All 21 apps',
      'Unlimited team members',
      'Priority support',
      '100GB storage',
      'Advanced analytics',
      'Custom integrations',
    ],
    cta: 'Start Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations and funders',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom training',
      'Unlimited storage',
      'SSO & advanced security',
      'SLA guarantees',
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
            <Title level={2}>Simple, Transparent Pricing</Title>
            <Text size="lg" color="secondary">
              Choose the plan that fits your organization
            </Text>
          </Stack>

          <Grid columns={3} gap="lg">
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

