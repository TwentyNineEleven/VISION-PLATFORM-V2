import { redirect } from 'next/navigation';

/**
 * /apps Route - REDIRECTED
 *
 * This route is a duplicate and has been redirected to /applications.
 * All app catalog functionality is now consolidated at /applications.
 *
 * Related routes that remain active:
 * - /apps/[slug] - Individual app detail pages
 * - /apps/[slug]/onboarding - App onboarding flows
 */

export default function AppsRedirect() {
  redirect('/applications');
}
