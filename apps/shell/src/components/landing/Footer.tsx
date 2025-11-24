import { Container, Stack, Grid, Title, Text } from '@/components/glow-ui';

const footerLinks = {
  Product: [
    { name: 'Features', href: '/applications' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Apps', href: '/applications' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
  ],
  Support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact', href: '/contact' },
    { name: 'Status', href: '/status' },
  ],
  Legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Security', href: '/security' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <Container className="py-12">
        <Stack spacing="lg">
          <Grid columns={4} gap="lg">
            {Object.entries(footerLinks).map(([category, links]) => (
              <Stack key={category} spacing="md">
                <Title level={6} className="text-white">
                  {category}
                </Title>
                <Stack spacing="sm">
                  {links.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      <Text size="sm" as="span">
                        {link.name}
                      </Text>
                    </a>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Grid>
          <div className="border-t border-gray-800 pt-8">
            <Stack spacing="md" align="center" className="text-center">
              <Stack spacing="sm">
                <Title level={5} className="text-white">
                  About TwentyNine Eleven Impact Partners, LLC
                </Title>
                <Text size="sm" className="max-w-2xl">
                  We build tools and provide capacity-building support that strengthens mission-driven organizations and the communities they serve.
                </Text>
                <Text size="sm" className="max-w-2xl">
                  The VISION Platform is part of our commitment to sustainable, community-centered impact.
                </Text>
              </Stack>
              <Text size="sm">
                &copy; {new Date().getFullYear()} TwentyNine Eleven Impact Partners, LLC. All rights reserved.
              </Text>
            </Stack>
          </div>
        </Stack>
      </Container>
    </footer>
  );
}

