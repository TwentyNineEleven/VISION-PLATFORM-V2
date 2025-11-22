import Link from 'next/link';
import { GlowButton } from '@/components/glow-ui';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-purple-600" />
              <span className="text-xl font-bold">VISION</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/applications" className="text-sm font-medium hover:text-blue-600">
                Apps
              </Link>
              <a href="/#pricing" className="text-sm font-medium hover:text-blue-600">
                Pricing
              </a>
              <Link href="/signin">
                <GlowButton variant="ghost" size="sm">
                  Sign In
                </GlowButton>
              </Link>
              <Link href="/signup">
                <GlowButton variant="default" size="sm" glow="subtle">
                  Get Started
                </GlowButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Hero />
      <Features />
      <HowItWorks />
      <div id="pricing">
        <Pricing />
      </div>
      <Footer />
    </div>
  );
}
