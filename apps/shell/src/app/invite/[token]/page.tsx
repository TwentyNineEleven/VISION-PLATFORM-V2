'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowButton, GlowBadge } from '@/components/glow-ui';
import { toast } from '@/lib/toast';
import { Building2, Mail, UserCircle, CheckCircle2, XCircle, Clock, Loader2, ArrowRight } from 'lucide-react';
import { Stack } from '@/design-system';

interface InviteData {
  inviteId: string;
  email: string;
  role: string;
  message: string | null;
  invitedBy: string;
  invitedByEmail: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  isValid: boolean;
  organization: {
    id: string;
    name: string;
    logoUrl: string | null;
  };
}

export default function InviteAcceptancePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [inviteData, setInviteData] = React.useState<InviteData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAccepting, setIsAccepting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Load invite data and check authentication
  React.useEffect(() => {
    loadInviteData();
    checkAuthentication();
  }, [token]);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/auth/check');
      setIsAuthenticated(response.ok);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const loadInviteData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/invites/${token}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Invitation not found. It may have been cancelled or deleted.');
        }
        throw new Error('Failed to load invitation details');
      }

      const { data } = await response.json();
      setInviteData(data);

      // Check if invite is invalid
      if (!data.isValid) {
        if (data.status === 'expired') {
          setError('This invitation has expired. Please request a new invitation from your organization.');
        } else if (data.status === 'accepted') {
          setError('This invitation has already been accepted.');
        } else if (data.status === 'cancelled') {
          setError('This invitation has been cancelled.');
        } else {
          setError('This invitation is no longer valid.');
        }
      }
    } catch (err: any) {
      console.error('Error loading invite:', err);
      setError(err.message || 'Failed to load invitation details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!inviteData || !isAuthenticated) return;

    setIsAccepting(true);

    try {
      const response = await fetch(`/api/v1/invites/${token}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to accept invitation');
      }

      const { data } = await response.json();

      toast.success(
        'Welcome to the team!',
        `You've successfully joined ${inviteData.organization.name}`
      );

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Error accepting invite:', err);
      toast.error('Failed to Accept', err.message || 'Could not accept invitation');
      setIsAccepting(false);
    }
  };

  const handleSignIn = () => {
    // Store the invite token in session storage to retrieve after sign in
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pendingInviteToken', token);
    }
    router.push(`/signin?invite=${token}`);
  };

  const handleSignUp = () => {
    // Store the invite token in session storage to retrieve after sign up
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pendingInviteToken', token);
    }
    router.push(`/signup?invite=${token}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <GlowCard className="w-full max-w-md">
          <GlowCardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <GlowCardTitle>Invalid Invitation</GlowCardTitle>
            <GlowCardDescription>
              {error || 'This invitation link is not valid'}
            </GlowCardDescription>
          </GlowCardHeader>
          <GlowCardContent>
            <GlowButton
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="w-full"
            >
              Go to Dashboard
            </GlowButton>
          </GlowCardContent>
        </GlowCard>
      </div>
    );
  }

  const isExpired = !inviteData.isValid && inviteData.status === 'expired';
  const isAccepted = inviteData.status === 'accepted';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <GlowCard className="w-full max-w-2xl" variant="elevated">
        <GlowCardHeader className="text-center">
          {inviteData.organization.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={inviteData.organization.logoUrl}
              alt={`${inviteData.organization.name} logo`}
              className="h-16 w-auto mx-auto mb-4 object-contain"
            />
          ) : (
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          )}
          <GlowCardTitle className="text-2xl mb-2">
            You're invited to join {inviteData.organization.name}
          </GlowCardTitle>
          <GlowCardDescription className="text-base">
            {inviteData.invitedBy} has invited you to collaborate
          </GlowCardDescription>
        </GlowCardHeader>

        <GlowCardContent>
          <Stack gap="6xl">
            {/* Invitation Details */}
            <Stack gap="lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/50">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Invited Email</p>
                    <p className="text-sm text-muted-foreground">{inviteData.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/50">
                  <UserCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Your Role</p>
                    <GlowBadge variant="outline" size="sm" className="mt-1">
                      {inviteData.role}
                    </GlowBadge>
                  </div>
                </div>
              </div>

              {inviteData.message && (
                <div className="p-4 rounded-lg border border-border bg-muted/50">
                  <p className="text-sm font-medium text-foreground mb-2">Personal Message</p>
                  <p className="text-sm text-muted-foreground italic">"{inviteData.message}"</p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Invited on {new Date(inviteData.createdAt).toLocaleDateString()} by {inviteData.invitedBy}
                </span>
              </div>
            </Stack>

            {/* Status Messages */}
            {isExpired && (
              <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
                <p className="text-sm text-destructive text-center">
                  This invitation has expired. Please contact {inviteData.invitedBy} ({inviteData.invitedByEmail}) to request a new invitation.
                </p>
              </div>
            )}

            {isAccepted && (
              <div className="p-4 rounded-lg border border-success/50 bg-success/10">
                <p className="text-sm text-success text-center">
                  This invitation has already been accepted. If you're having trouble accessing the organization, please contact support.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {inviteData.isValid && (
              <Stack gap="md">
                {isAuthenticated ? (
                  <>
                    <GlowButton
                      onClick={handleAccept}
                      disabled={isAccepting}
                      glow="subtle"
                      size="lg"
                      className="w-full"
                      leftIcon={
                        isAccepting ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5" />
                        )
                      }
                    >
                      {isAccepting ? 'Joining...' : 'Accept Invitation'}
                    </GlowButton>
                    <p className="text-xs text-center text-muted-foreground">
                      By accepting, you'll gain {inviteData.role} access to {inviteData.organization.name}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-lg border border-border bg-muted/50 text-center">
                      <p className="text-sm text-foreground mb-4">
                        Sign in or create an account to accept this invitation
                      </p>
                      <Stack gap="sm">
                        <GlowButton
                          onClick={handleSignIn}
                          variant="default"
                          size="lg"
                          className="w-full"
                          rightIcon={<ArrowRight className="h-5 w-5" />}
                        >
                          Sign in to Accept
                        </GlowButton>
                        <GlowButton
                          onClick={handleSignUp}
                          variant="outline"
                          size="lg"
                          className="w-full"
                          rightIcon={<ArrowRight className="h-5 w-5" />}
                        >
                          Sign up to Accept
                        </GlowButton>
                      </Stack>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      Make sure to sign in with <strong>{inviteData.email}</strong>
                    </p>
                  </>
                )}
              </Stack>
            )}

            {!inviteData.isValid && (
              <GlowButton
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="w-full"
              >
                Go to Dashboard
              </GlowButton>
            )}
          </Stack>
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
