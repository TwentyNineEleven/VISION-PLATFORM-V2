import { Container, Stack, Title, Text } from '@/components/glow-ui';
import { Database, Users, BarChart3, FileText, ArrowRight } from 'lucide-react';

export function CompleteInfrastructure() {
  const infrastructure = [
    {
      icon: Database,
      title: 'Data Warehouse',
      description: 'The centralized store for outcomes, KPIs, assessments, and performance metrics.',
    },
    {
      icon: FileText,
      title: 'Document Intelligence (DocAI)',
      description: 'Automated interpretation of reports, evaluations, plans, transcripts, and community inputs.',
    },
    {
      icon: Users,
      title: 'CRM',
      description: 'A structured home for every partner, donor, client, and stakeholder relationship.',
    },
    {
      icon: BarChart3,
      title: 'Data Analytics',
      description: 'Dashboards and visual insights that reveal patterns, progress, and opportunities.',
    },
  ];

  return (
    <section className="py-28 bg-gray-50">
      <Container>
        <div className="max-w-7xl mx-auto">
          <Stack spacing="2xl">
            {/* Section Header */}
            <Stack spacing="md" align="center" className="text-center">
              <Title level={2} className="text-4xl sm:text-5xl font-bold text-[#001A33]">
                The Core Infrastructure
              </Title>
              <div className="w-20 h-1.5 bg-gradient-to-r from-[#007F5F] to-[#00B88D] mx-auto rounded-full"></div>
              <Text size="lg" className="max-w-3xl text-gray-600 mt-4">
                Four foundational systems that work together to power every application and workflow.
              </Text>
            </Stack>

            {/* Horizontal Architecture Diagram */}
            <div className="relative mt-16">
              {/* Infrastructure Components in a horizontal flow */}
              <div className="flex items-center justify-between gap-4">
                {infrastructure.map((item, index) => {
                  const Icon = item.icon;
                  const isLast = index === infrastructure.length - 1;

                  return (
                    <div key={index} className="flex items-center flex-1">
                      {/* Component Card */}
                      <div className="group relative bg-white p-6 rounded-2xl border-2 border-[#007F5F]/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex-1">
                        {/* Icon */}
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#007F5F] to-[#00B88D] flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        {/* Content */}
                        <Stack spacing="sm" align="center" className="text-center">
                          <Text weight="bold" size="lg" className="text-[#001A33] leading-tight">
                            {item.title}
                          </Text>
                          <Text size="sm" className="text-gray-600 leading-relaxed">
                            {item.description}
                          </Text>
                        </Stack>

                        {/* Bottom accent */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#007F5F] to-[#00B88D] rounded-b-2xl"></div>
                      </div>

                      {/* Connector Arrow (not on last item) */}
                      {!isLast && (
                        <div className="flex items-center justify-center mx-2">
                          <ArrowRight className="w-8 h-8 text-[#007F5F]" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Supporting Text Below Diagram */}
              <div className="mt-12 text-center max-w-4xl mx-auto">
                <Text className="text-gray-700 leading-relaxed text-lg">
                  These four infrastructure components form the foundation of the Vision Impact Hub. Data flows seamlessly from warehouse to intelligence to relationships to insights — creating a unified system that powers every workflow, application, and decision.
                </Text>
              </div>
            </div>
          </Stack>
        </div>
      </Container>
    </section>
  );
}
