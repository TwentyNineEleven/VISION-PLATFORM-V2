import { Container, Stack, Title, Text } from '@/components/glow-ui';
import {
  Compass, Users, Activity,
  Lightbulb, Grid3x3, Star,
  Target, Layers, Scale, Beaker,
  Rocket, DollarSign, Map,
  Settings, BarChart3, TrendingUp, Database,
  FileText, PenTool, BookOpen
} from 'lucide-react';

const appsByArea = [
  {
    area: 'Voice of the Community',
    apps: [
      { name: 'Community Compass', icon: Compass },
      { name: 'Stakeholdr', icon: Users },
      { name: 'PulsePro', icon: Activity }
    ],
    color: '#3B82F6',
  },
  {
    area: 'Inspire Bold Ideas',
    apps: [
      { name: 'VisionVerse', icon: Lightbulb },
      { name: 'ThinkGrid', icon: Grid3x3 },
      { name: 'NorthStar', icon: Star }
    ],
    color: '#A855F7',
  },
  {
    area: 'Strategize the Model',
    apps: [
      { name: 'PathwayPro', icon: Target },
      { name: 'Architex', icon: Layers },
      { name: 'EquiFrame', icon: Scale },
      { name: 'LogicLab', icon: Beaker }
    ],
    color: '#6366F1',
  },
  {
    area: 'Initiate the Plan',
    apps: [
      { name: 'LaunchPath', icon: Rocket },
      { name: 'FundGrid', icon: DollarSign },
      { name: 'RoadmapIQ', icon: Map }
    ],
    color: '#22C55E',
  },
  {
    area: 'Operate with Excellence',
    apps: [
      { name: 'Ops360', icon: Settings },
      { name: 'MetricMap', icon: BarChart3 },
      { name: 'CapacityIQ', icon: TrendingUp },
      { name: 'OrgDB', icon: Database }
    ],
    color: '#F97316',
  },
  {
    area: 'Narrate the Impact',
    apps: [
      { name: 'NarrateIQ', icon: FileText },
      { name: 'GrantWriter', icon: PenTool },
      { name: 'ImpactStory', icon: BookOpen }
    ],
    color: '#14B8A6',
  },
];

export function ApplicationLayer() {
  return (
    <section className="py-28 bg-gray-50">
      <Container>
        <div className="max-w-5xl mx-auto">
          <Stack spacing="2xl">
            {/* Section Header */}
            <Stack spacing="md" align="center" className="text-center">
              <Title level={2} className="text-4xl sm:text-5xl font-bold text-[#001A33]">
                Applications
              </Title>
              <div className="w-20 h-1.5 bg-gradient-to-r from-[#007F5F] to-[#00B88D] mx-auto rounded-full"></div>
              <Text size="lg" className="max-w-3xl text-gray-600 mt-4">
                21 specialized applications organized across the Six Transformation Areas
              </Text>
              <Text className="max-w-3xl text-gray-600 text-base">
                Each powered by the Core Infrastructure and elevated by VISION AI™
              </Text>
            </Stack>

            {/* Vertical Stack Diagram */}
            <div className="relative mt-12">
              <Stack spacing="lg">
                {appsByArea.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Area Label */}
                    <div className="mb-4">
                      <Text
                        weight="bold"
                        className="text-lg text-[#001A33]"
                        style={{ color: item.color }}
                      >
                        {item.area}
                      </Text>
                    </div>

                    {/* Application Pills Stack */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200">
                      <div className="flex flex-wrap gap-3">
                        {item.apps.map((app, appIndex) => {
                          const AppIcon = app.icon;
                          return (
                            <div
                              key={appIndex}
                              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 hover:shadow-lg transition-all duration-300"
                              style={{
                                backgroundColor: `${item.color}15`,
                                borderColor: `${item.color}40`,
                              }}
                            >
                              <AppIcon
                                className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                                style={{ color: item.color }}
                              />
                              <Text
                                weight="medium"
                                className="text-[#001A33] group-hover:font-bold transition-all"
                              >
                                {app.name}
                              </Text>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Connector line to next area (not on last) */}
                    {index < appsByArea.length - 1 && (
                      <div className="flex justify-center my-4">
                        <div className="w-0.5 h-6 bg-gray-300"></div>
                      </div>
                    )}
                  </div>
                ))}
              </Stack>
            </div>

            {/* Supporting Text */}
            <div className="mt-12 text-center max-w-4xl mx-auto">
              <Text className="text-gray-700 leading-relaxed text-lg">
                Each application is purpose-built for its transformation area, integrated with the Core Infrastructure, and enhanced by VISION AI™ — creating a complete, intelligent system for mission-driven impact.
              </Text>
            </div>
          </Stack>
        </div>
      </Container>
    </section>
  );
}
