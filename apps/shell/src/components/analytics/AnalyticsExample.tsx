'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  authEvents,
  documentEvents,
  organizationEvents,
  teamEvents,
} from '@/lib/analytics/events';

/**
 * Analytics Example Component
 *
 * Demonstrates how to implement analytics tracking in your components.
 * This file serves as documentation and examples for developers.
 *
 * DO NOT USE IN PRODUCTION - This is for reference only
 */

export function AnalyticsExample() {
  const { track, identify, setProperties, checkFeature } = useAnalytics();

  // Example 1: Track component mount
  useEffect(() => {
    track('Example Component Viewed');
  }, [track]);

  // Example 2: Track user actions
  const handleButtonClick = () => {
    track('Example Button Clicked', {
      buttonName: 'Example Button',
      location: 'Analytics Example',
    });
  };

  // Example 3: Using predefined events
  const handleDocumentUpload = (file: File) => {
    documentEvents.uploaded({
      fileType: file.type,
      fileSize: file.size,
      folderId: 'example-folder-id',
    });
  };

  // Example 4: Identify user on authentication
  const handleUserAuthentication = (user: any) => {
    identify(user.id, {
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    });

    // Track auth event
    authEvents.signIn({ method: 'email' });
  };

  // Example 5: Update user properties
  const handleProfileUpdate = (updates: any) => {
    setProperties({
      name: updates.name,
      avatar: updates.avatar,
      updated_at: new Date().toISOString(),
    });
  };

  // Example 6: Organization events
  const handleOrganizationSwitch = (org: any) => {
    organizationEvents.switched({
      organizationId: org.id,
      organizationName: org.name,
    });
  };

  // Example 7: Team events
  const handleMemberInvite = (email: string, role: string) => {
    teamEvents.memberInvited({
      role,
      inviteMethod: 'email',
    });
  };

  // Example 8: Feature flag usage
  const handleFeatureFlagCheck = () => {
    const isNewUIEnabled = checkFeature('new-ui-design');

    if (isNewUIEnabled) {
      // Show new UI
      track('New UI Shown', { flagKey: 'new-ui-design' });
    } else {
      // Show old UI
      track('Old UI Shown', { flagKey: 'new-ui-design' });
    }
  };

  // Example 9: Track form submissions
  const handleFormSubmit = (formData: any) => {
    track('Form Submitted', {
      formName: 'Example Form',
      fields: Object.keys(formData),
      fieldCount: Object.keys(formData).length,
    });
  };

  // Example 10: Track errors
  const handleError = (error: Error) => {
    track('Error Occurred', {
      errorMessage: error.message,
      errorStack: error.stack,
      location: 'Analytics Example',
      severity: 'medium',
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Analytics Examples</h2>
      <p className="text-gray-600 mb-6">
        This component demonstrates various analytics tracking patterns.
        See the source code for implementation details.
      </p>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">1. Basic Event Tracking</h3>
          <button
            onClick={handleButtonClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Track Button Click
          </button>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">2. Document Upload Tracking</h3>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleDocumentUpload(file);
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">3. Feature Flag Check</h3>
          <button
            onClick={handleFeatureFlagCheck}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Check Feature Flag
          </button>
        </div>

        <div className="p-4 border rounded bg-yellow-50">
          <h3 className="font-semibold mb-2">💡 Key Principles</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>Track meaningful user actions, not every click</li>
            <li>Use predefined events from @/lib/analytics/events</li>
            <li>Include relevant context in event properties</li>
            <li>Identify users on authentication</li>
            <li>Reset analytics on logout</li>
            <li>Respect user privacy (DNT, opt-out)</li>
            <li>Mask sensitive data in session recordings</li>
          </ul>
        </div>

        <div className="p-4 border rounded bg-blue-50">
          <h3 className="font-semibold mb-2">📚 Common Events to Track</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>Authentication: sign up, sign in, sign out</li>
            <li>Documents: upload, view, download, share</li>
            <li>Organizations: create, switch, update</li>
            <li>Team: invite, join, remove, role change</li>
            <li>Applications: open, feature use, task complete</li>
            <li>Onboarding: start, step complete, finish</li>
            <li>Errors: API errors, client errors</li>
            <li>Performance: page load, API response time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
