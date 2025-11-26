import { Container, Stack, Title, Text, GlowCard, GlowCardHeader, GlowCardTitle, GlowCardContent } from '@/components/glow-ui';
import { Mic, Lightbulb, Target, Rocket, Cog, BookOpen } from 'lucide-react';

const modules = [
  {
    icon: Mic,
    name: 'VOICE',
    title: 'Community Discovery',
    description: 'Listen to stakeholders, conduct needs assessments, and ground your work in authentic community voices.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Lightbulb,
    name: 'INSPIRE',
    title: 'Mission, Vision & Ideas',
    description: 'Clarify your mission and vision, generate innovative ideas, and align your team around shared purpose.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: Target,
    name: 'STRATEGIZE',
    title: 'Build Your Program Model',
    description: 'Design logic models, theories of change, and evidence-based strategies that drive measurable outcomes.',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    icon: Rocket,
    name: 'INITIATE',
    title: 'Plan and Launch',
    description: 'Create implementation plans, timelines, and budgets. Launch programs with clarity and confidence.',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: Cog,
    name: 'OPERATE',
    title: 'Strengthen the Foundation',
    description: 'Build operational capacity, governance structures, and the systems needed for sustainable impact.',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    icon: BookOpen,
    name: 'NARRATE',
    title: 'Track and Tell Your Impact',
    description: 'Monitor progress, evaluate outcomes, and communicate your impact story to funders and stakeholders.',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-100',
    iconColor: 'text-teal-600',
  },
];

export function ModulesShowcase() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <Stack spacing="xl">
          <Stack spacing="md" align="center" className="text-center">
            <Title level={2}>The modules that guide your entire journey</Title>
            <Text size="lg" color="secondary" className="max-w-3xl">
              Each module provides structured workflows, AI-powered assistance, and practical tools to support your work.
            </Text>
          </Stack>

          <div className="space-y-6">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <GlowCard key={index} variant="interactive" padding="lg">
                  <GlowCardContent>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className={`${module.bgColor} w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-8 h-8 ${module.iconColor}`} />
                      </div>
                      <Stack spacing="sm" className="flex-1">
                        <div>
                          <Text size="sm" weight="bold" className={`bg-gradient-to-r ${module.color} bg-clip-text text-transparent uppercase tracking-wide`}>
                            {module.name}
                          </Text>
                          <Title level={4} className="mt-1">{module.title}</Title>
                        </div>
                        <Text color="secondary">{module.description}</Text>
                      </Stack>
                    </div>
                  </GlowCardContent>
                </GlowCard>
              );
            })}
          </div>
        </Stack>
      </Container>
    </section>
  );
}
