import Link from 'next/link';
import { GlowButton } from '@/components/glow-ui';
import { Hero } from '@/components/landing/Hero';
import { ValueStrip } from '@/components/landing/ValueStrip';
import { OnePlatform } from '@/components/landing/OnePlatform';
import { ProblemsSolved } from '@/components/landing/ProblemsSolved';
import { CompleteInfrastructure } from '@/components/landing/CompleteInfrastructure';
import { VisionAIIntelligence } from '@/components/landing/VisionAIIntelligence';
import { SixTransformationAreas } from '@/components/landing/SixTransformationAreas';
import { ApplicationLayer } from '@/components/landing/ApplicationLayer';
import { WhyDifferent } from '@/components/landing/WhyDifferent';
import { RealWorldOutcomes } from '@/components/landing/RealWorldOutcomes';
import { TargetAudience } from '@/components/landing/TargetAudience';
import { Pricing } from '@/components/landing/Pricing';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b bg-card backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vision-gray-950 to-vision-green-700 shadow-lg" />
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-vision-gray-950">Vision Impact Hub</span>
                <span className="text-xs text-muted-foreground leading-tight">Powered by VISION AI™</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="/#platform"
                className="text-sm font-medium text-vision-gray-700 hover:text-vision-green-700 transition-colors"
              >
                Platform
              </a>
              <a
                href="/#transformation"
                className="text-sm font-medium text-vision-gray-700 hover:text-vision-green-700 transition-colors"
              >
                Transformation Areas
              </a>
              <a
                href="/#pricing"
                className="text-sm font-medium text-vision-gray-700 hover:text-vision-green-700 transition-colors"
              >
                Pricing
              </a>
              <Link href="/signin">
                <GlowButton variant="ghost" size="sm">
                  Sign In
                </GlowButton>
              </Link>
              <Link href="/signup">
                <GlowButton
                  variant="default"
                  size="sm"
                  glow="subtle"
                  className="bg-vision-green-700 hover:bg-vision-green-600"
                >
                  Book a Demo
                </GlowButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Hero />
      <ValueStrip />
      <OnePlatform />
      <ProblemsSolved />
      <div id="platform">
        <CompleteInfrastructure />
      </div>
      <VisionAIIntelligence />
      <div id="transformation">
        <SixTransformationAreas />
      </div>
      <ApplicationLayer />
      <WhyDifferent />
      <RealWorldOutcomes />
      <TargetAudience />
      <div id="pricing">
        <Pricing />
      </div>
      <FinalCTA />
      <Footer />
    </div>
  );
}
