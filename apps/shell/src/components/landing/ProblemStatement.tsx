import { Container, Stack, Title, Text } from '@/components/glow-ui';
import { FileSpreadsheet, RefreshCw, HelpCircle, MessageSquare } from 'lucide-react';

const challenges = [
  {
    icon: FileSpreadsheet,
    text: 'Scattered information',
  },
  {
    icon: RefreshCw,
    text: 'Repeated work',
  },
  {
    icon: HelpCircle,
    text: 'Unclear strategies',
  },
  {
    icon: MessageSquare,
    text: 'Challenges communicating impact with funders',
  },
];

export function ProblemStatement() {
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <Stack spacing="xl" align="center" className="text-center">
          <Stack spacing="md">
            <Title level={2}>The work is important — but the tools haven&apos;t caught up.</Title>
            <Text size="lg" color="secondary" className="max-w-3xl">
              Most mission-driven organizations rely on disconnected documents, outdated templates, and time-consuming processes.
            </Text>
          </Stack>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-4xl w-full">
            {challenges.map((challenge, index) => {
              const Icon = challenge.icon;
              return (
                <div key={index} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-red-600" />
                  </div>
                  <Text size="sm" color="secondary" className="text-center">
                    {challenge.text}
                  </Text>
                </div>
              );
            })}
          </div>

          <Text size="lg" className="max-w-2xl mt-8 font-medium">
            VISION brings everything together in one place, with guidance that feels like having a strategic advisor by your side.
          </Text>
        </Stack>
      </Container>
    </section>
  );
}
