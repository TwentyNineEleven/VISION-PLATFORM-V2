import { Container, Stack, Grid, Title, Text } from '@/components/glow-ui';
import { AlertCircle, Layers, Zap, MessagesSquare } from 'lucide-react';

const problems = [
  {
    icon: Layers,
    title: 'Too many tools. No clarity.',
    description: 'Organizations juggle disconnected systems — spreadsheets for strategy, databases for outcomes, tools for surveys, platforms for collaboration. Nothing connects, and clarity gets lost in the chaos.',
  },
  {
    icon: AlertCircle,
    title: 'Too much data. Not enough insight.',
    description: 'Organizations collect more information than ever — outputs, feedback, stories — but lack the systems to interpret it, synthesize it, or turn it into confident decisions.',
  },
  {
    icon: Zap,
    title: 'Too much urgency. Not enough structure.',
    description: 'Leaders move fast but lack the scaffolding to turn ideas into aligned strategy, clear models, evidence-backed pathways, and measurable outcomes.',
  },
  {
    icon: MessagesSquare,
    title: 'Too many stakeholders. Not enough coherence.',
    description: 'Program teams, funders, evaluators, community members, and partners all need something different. Organizations struggle to tell a unified, credible story.',
  },
];

export function ProblemsSolved() {
  return (
    <section className="py-28 bg-white">
      <Container>
        <div className="max-w-6xl mx-auto">
          <Stack spacing="2xl">
            {/* Section Header */}
            <Stack spacing="md" align="center" className="text-center">
              <Title level={2} className="text-4xl sm:text-5xl font-bold text-[#001A33]">
                The Problems We Solve
              </Title>
              <div className="w-20 h-1.5 bg-gradient-to-r from-[#FF6A3D] to-[#FF8C69] mx-auto rounded-full"></div>
              <Text size="lg" className="max-w-3xl text-gray-600 mt-4">
                Mission-driven organizations face urgent, human challenges. The Vision Impact Hub addresses them directly.
              </Text>
            </Stack>

            {/* 2x2 Problem Grid */}
            <Grid columns={2} gap="lg" className="mt-12">
              {problems.map((problem, index) => {
                const Icon = problem.icon;
                return (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-10 shadow-md border-2 border-gray-200 hover:border-[#FF6A3D]/40 hover:shadow-2xl transition-all duration-300"
                  >
                    <Stack spacing="lg">
                      {/* Large Icon Container */}
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6A3D]/15 to-[#FF8C69]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Icon className="w-10 h-10 text-[#FF6A3D]" strokeWidth={2} />
                      </div>

                      {/* Content */}
                      <Stack spacing="md">
                        <Text weight="bold" className="text-2xl text-[#001A33] leading-tight">
                          {problem.title}
                        </Text>
                        <Text className="text-gray-700 leading-relaxed text-lg">
                          {problem.description}
                        </Text>
                      </Stack>
                    </Stack>

                    {/* Orange micro-accent (bottom border) */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF6A3D] to-[#FF8C69] rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                );
              })}
            </Grid>
          </Stack>
        </div>
      </Container>
    </section>
  );
}
