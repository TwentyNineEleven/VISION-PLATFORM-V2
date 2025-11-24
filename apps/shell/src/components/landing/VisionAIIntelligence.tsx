import { Container, Stack, Title, Text } from '@/components/glow-ui';
import { Brain, Sparkles, Zap, FileSearch, LineChart } from 'lucide-react';

export function VisionAIIntelligence() {
  const capabilities = [
    {
      icon: FileSearch,
      title: 'Document Intelligence',
      description: 'Automatically interprets reports, transcripts, evaluations, and community feedback',
    },
    {
      icon: LineChart,
      title: 'Data Synthesis',
      description: 'Connects outcomes, indicators, and lived experience into coherent narratives',
    },
    {
      icon: Brain,
      title: 'Model Strengthening',
      description: 'Suggests improvements to logic models, theories of change, and pathways to impact',
    },
    {
      icon: Zap,
      title: 'Workflow Acceleration',
      description: 'Drafts strategy documents, impact reports, and stakeholder communications',
    },
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-[#007F5F] via-[#004D3D] to-[#001A33] text-white overflow-hidden">
      {/* Neural Mesh Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Mesh blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#00B88D] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#00D9A0] rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#007F5F] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" />

        {/* Pulsing nodes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#00B88D] rounded-full animate-pulse shadow-lg shadow-[#00B88D]/50"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#00D9A0] rounded-full animate-pulse shadow-lg shadow-[#00D9A0]/50" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#00B88D] rounded-full animate-pulse shadow-lg shadow-[#00B88D]/50" style={{ animationDelay: '0.6s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-[#00D9A0] rounded-full animate-pulse shadow-lg shadow-[#00D9A0]/50" style={{ animationDelay: '0.9s' }}></div>
      </div>

      <Container className="relative z-10">
        <div className="max-w-6xl mx-auto">
          <Stack spacing="2xl" align="center">
            {/* Pulsing AI Core Icon */}
            <div className="relative">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-[#00B88D]/30 animate-pulse"></div>
              {/* Inner core */}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#00B88D] to-[#007F5F] flex items-center justify-center shadow-2xl shadow-[#00B88D]/50">
                <Sparkles className="w-16 h-16 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Title */}
            <Stack spacing="md" align="center" className="text-center">
              <Title level={2} className="text-white text-5xl sm:text-6xl font-bold leading-tight">
                VISION AI™
              </Title>
              <Text className="text-[#00D9A0] text-xl font-semibold tracking-wide">
                The Intelligence Layer
              </Text>
            </Stack>

            {/* Main Description */}
            <div className="max-w-4xl mx-auto text-center">
              <Text className="text-white/90 leading-relaxed text-2xl font-medium">
                VISION AI™ is purpose-built intelligence for mission-driven organizations. It interprets documents, synthesizes data, strengthens models, drafts narratives, and reveals patterns — helping teams move faster, think clearer, and create measurable impact.
              </Text>
            </div>

            {/* 2x2 Capabilities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full max-w-5xl">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 hover:border-[#00B88D]/50 transition-all duration-300"
                  >
                    <Stack spacing="md">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-xl bg-[#00B88D]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-7 h-7 text-[#00D9A0]" strokeWidth={2} />
                      </div>

                      {/* Content */}
                      <Stack spacing="sm">
                        <Text weight="bold" size="xl" className="text-white leading-tight">
                          {capability.title}
                        </Text>
                        <Text className="text-white/80 leading-relaxed">
                          {capability.description}
                        </Text>
                      </Stack>
                    </Stack>
                  </div>
                );
              })}
            </div>

            {/* Supporting Statement */}
            <div className="mt-12 max-w-4xl mx-auto text-center">
              <Text className="text-white/80 leading-relaxed text-lg italic">
                VISION AI™ understands mission-driven language, organizational realities, and the complexity of social impact — making it uniquely powerful for nonprofits, consultants, and funders.
              </Text>
            </div>
          </Stack>
        </div>
      </Container>
    </section>
  );
}
