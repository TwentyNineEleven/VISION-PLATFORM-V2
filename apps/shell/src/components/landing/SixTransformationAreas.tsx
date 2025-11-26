import { Container, Stack, Title, Text, Grid } from '@/components/glow-ui';
import { Mic, Lightbulb, Target, Rocket, Cog, BookOpen, ArrowDown } from 'lucide-react';

const transformationPairs = [
  {
    title: 'Insight + Ideas',
    subtitle: 'Understanding and Envisioning',
    areas: [
      {
        icon: Mic,
        number: '1',
        title: 'Voice of the Community',
        narrative: 'Understanding the people you serve through insights gathered from lived experience, interviews, research, and feedback.',
        color: '#3B82F6',
        lightColor: '#DBEAFE',
      },
      {
        icon: Lightbulb,
        number: '2',
        title: 'Inspire Bold Ideas',
        narrative: 'Establishing aligned mission, vision, values, organizational identity, and strategic opportunities.',
        color: '#A855F7',
        lightColor: '#F3E8FF',
      },
    ],
  },
  {
    title: 'Strategy + Action',
    subtitle: 'Planning and Executing',
    areas: [
      {
        icon: Target,
        number: '3',
        title: 'Strategize the Model',
        narrative: 'Developing outcomes, indicators, activities, assumptions, pathways to impact, and evidence-informed models.',
        color: '#6366F1',
        lightColor: '#EEF2FF',
      },
      {
        icon: Rocket,
        number: '4',
        title: 'Initiate the Plan',
        narrative: 'Turning strategy into action through launch plans, timelines, workflows, and resource mapping.',
        color: '#22C55E',
        lightColor: '#DCFCE7',
      },
    ],
  },
  {
    title: 'Operations + Impact',
    subtitle: 'Delivering and Communicating',
    areas: [
      {
        icon: Cog,
        number: '5',
        title: 'Operate with Excellence',
        narrative: 'Strengthening governance, finance, leadership, operations, and organizational capacity.',
        color: '#F97316',
        lightColor: '#FFEDD5',
      },
      {
        icon: BookOpen,
        number: '6',
        title: 'Narrate the Impact',
        narrative: 'Transforming data and lived experience into clear, credible, funder-ready impact storytelling.',
        color: '#14B8A6',
        lightColor: '#CCFBF1',
      },
    ],
  },
];

export function SixTransformationAreas() {
  return (
    <section className="py-28 bg-white">
      <Container>
        <div className="max-w-6xl mx-auto">
          <Stack spacing="2xl">
            {/* Section Header */}
            <Stack spacing="md" align="center" className="text-center">
              <Title level={2} className="text-4xl sm:text-5xl font-bold text-[#001A33]">
                The Six Transformation Areas
              </Title>
              <div className="w-20 h-1.5 bg-gradient-to-r from-[#007F5F] to-[#00B88D] mx-auto rounded-full"></div>
              <Text size="lg" className="max-w-3xl text-gray-600 mt-4">
                A complete framework for mission-driven organizations to understand, design, execute, and communicate their impact.
              </Text>
            </Stack>

            {/* Paired Layout with Connectors */}
            <Stack spacing="2xl" className="mt-12">
              {transformationPairs.map((pair, pairIndex) => {
                const isLast = pairIndex === transformationPairs.length - 1;
                return (
                  <div key={pairIndex}>
                    {/* Pair Header */}
                    <div className="text-center mb-8">
                      <Text weight="bold" className="text-2xl text-[#007F5F] mb-1">
                        {pair.title}
                      </Text>
                      <Text className="text-gray-600 italic">
                        {pair.subtitle}
                      </Text>
                    </div>

                    {/* Two Areas Side by Side */}
                    <Grid columns={2} gap="lg">
                      {pair.areas.map((area) => {
                        const Icon = area.icon;
                        return (
                          <div
                            key={area.number}
                            className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border-2 border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-300"
                          >
                            {/* Number Badge + Icon */}
                            <div className="flex items-center gap-4 mb-6">
                              {/* Number Badge */}
                              <div
                                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-lg"
                                style={{
                                  background: `linear-gradient(135deg, ${area.color} 0%, ${area.color}dd 100%)`
                                }}
                              >
                                {area.number}
                              </div>

                              {/* Icon */}
                              <div
                                className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                style={{ backgroundColor: area.lightColor }}
                              >
                                <Icon
                                  className="w-7 h-7"
                                  style={{ color: area.color }}
                                />
                              </div>
                            </div>

                            {/* Content */}
                            <Stack spacing="sm">
                              <Title level={3} className="text-xl font-bold text-[#001A33] leading-tight">
                                {area.title}
                              </Title>
                              <Text size="sm" className="text-gray-600 leading-relaxed">
                                {area.narrative}
                              </Text>
                            </Stack>

                            {/* Decorative gradient accent */}
                            <div
                              className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background: `linear-gradient(90deg, ${area.color} 0%, ${area.color}cc 100%)`
                              }}
                            ></div>
                          </div>
                        );
                      })}
                    </Grid>

                    {/* Connector Arrow to Next Pair */}
                    {!isLast && (
                      <div className="flex justify-center my-8">
                        <ArrowDown className="w-10 h-10 text-[#007F5F]" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                );
              })}
            </Stack>
          </Stack>
        </div>
      </Container>
    </section>
  );
}
