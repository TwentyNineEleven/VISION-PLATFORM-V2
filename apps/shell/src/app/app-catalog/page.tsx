import { redirect } from 'next/navigation';

/**
 * /app-catalog Route - REDIRECTED
 *
 * This is a legacy route that has been redirected to /applications.
 * All app catalog functionality is now consolidated at /applications.
 */

export default function AppCatalogRedirect() {
  redirect('/applications');
}
