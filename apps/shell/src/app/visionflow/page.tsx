/**
 * VisionFlow Root Page
 * Redirects to the Dashboard page
 */

import { redirect } from 'next/navigation';

export default function VisionFlowPage() {
  redirect('/visionflow/dashboard');
}
