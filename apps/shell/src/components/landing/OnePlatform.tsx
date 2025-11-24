import { Container, Stack, Title, Text, Grid } from '@/components/glow-ui';
import { Users, Target, BarChart3, FileText, Sparkles } from 'lucide-react';

export function OnePlatform() {
  return (
    <section className="py-28 bg-gradient-to-b from-gray-50 to-white">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <Stack spacing="md" align="center" className="text-center mb-16">
            <Title level={2} className="text-4xl sm:text-5xl font-bold text-[#001A33] leading-tight">
              What the Vision Impact Hub Is
            </Title>
            <div className="w-20 h-1.5 bg-gradient-to-r from-[#007F5F] to-[#00B88D] mx-auto rounded-full"></div>
          </Stack>

          {/* Two-Column Layout */}
          <Grid columns={2} gap="2xl" className="items-center">
            {/* Left Column - Content */}
            <Stack spacing="xl">
              <Text className="text-2xl sm:text-3xl text-[#001A33] font-bold leading-tight">
                An Impact Operating System for Mission-Driven Organizations
              </Text>

              <Text className="text-lg text-gray-700 leading-relaxed">
                The Vision Impact Hub is the first complete operating system built specifically for mission-driven organizations, consultants, and funders.
              </Text>

              <Text className="text-lg text-gray-700 leading-relaxed">
                It unifies strategy, people, data, operations, and impact into one intelligent platform — eliminating fragmentation and creating a single source of truth for every part of your mission.
              </Text>

              <Text className="text-lg text-gray-700 leading-relaxed">
                Powered by VISION AI™, the Hub transforms complexity into clarity, helping organizations understand what's working, where to improve, and how to create measurable, long-term impact.
              </Text>
            </Stack>

            {/* Right Column - Circular Diagram */}
            <div className="relative flex items-center justify-center">
              {/* Outer Circle */}
              <div className="relative w-[420px] h-[420px] rounded-full border-4 border-[#007F5F]/20 bg-gradient-to-br from-white to-gray-50 shadow-2xl">
                {/* Center Core - VISION AI */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-[#007F5F] to-[#00B88D] flex flex-col items-center justify-center shadow-xl">
                  <Sparkles className="w-8 h-8 text-white mb-1" />
                  <Text weight="bold" className="text-white text-sm text-center leading-tight">
                    VISION AI™
                  </Text>
                </div>

                {/* Orbital Elements - Strategy */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white border-2 border-[#007F5F] flex flex-col items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-[#007F5F] mb-0.5" />
                  <Text className="text-[10px] font-semibold text-[#001A33]">Strategy</Text>
                </div>

                {/* Orbital Elements - People */}
                <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-20 h-20 rounded-full bg-white border-2 border-[#007F5F] flex flex-col items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-[#007F5F] mb-0.5" />
                  <Text className="text-[10px] font-semibold text-[#001A33]">People</Text>
                </div>

                {/* Orbital Elements - Data */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white border-2 border-[#007F5F] flex flex-col items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-[#007F5F] mb-0.5" />
                  <Text className="text-[10px] font-semibold text-[#001A33]">Data</Text>
                </div>

                {/* Orbital Elements - Impact */}
                <div className="absolute top-1/2 left-8 transform -translate-y-1/2 w-20 h-20 rounded-full bg-white border-2 border-[#007F5F] flex flex-col items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-[#007F5F] mb-0.5" />
                  <Text className="text-[10px] font-semibold text-[#001A33]">Impact</Text>
                </div>

                {/* Connecting Lines (subtle) */}
                <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                  <circle cx="210" cy="210" r="100" fill="none" stroke="#007F5F" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
                </svg>
              </div>
            </div>
          </Grid>
        </div>
      </Container>
    </section>
  );
}
