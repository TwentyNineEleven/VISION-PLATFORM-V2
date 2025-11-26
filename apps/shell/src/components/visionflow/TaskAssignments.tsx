/**
 * Task Assignments Component
 * Manages user assignments to tasks with role selection
 * Phase 1: Task Management
 * Uses Glow UI design system and 2911 Bold Color System
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useOrganization } from '@/contexts/OrganizationContext';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowInput } from '@/components/glow-ui/GlowInput';
import { GlowSelect } from '@/components/glow-ui/GlowSelect';
import { GlowBadge } from '@/components/glow-ui/GlowBadge';
import { GlowCard } from '@/components/glow-ui/GlowCard';
import { X, Plus, Search } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

interface Assignment {
  id: string;
  user_id?: string;
  assigned_to?: string;
  role: 'OWNER' | 'COLLABORATOR' | 'REVIEWER';
  user: User;
}

interface TaskAssignmentsProps {
  taskId: string;
  assignments: Assignment[];
  onAssignmentsChange?: () => void;
}

const ROLE_CONFIG = {
  OWNER: {
    label: 'Owner',
    variant: 'default' as const,
    bgClass: 'bg-vision-purple-50',
    textClass: 'text-vision-purple-900',
  },
  COLLABORATOR: {
    label: 'Collaborator',
    variant: 'info' as const,
    bgClass: 'bg-vision-blue-50',
    textClass: 'text-vision-blue-950',
  },
  REVIEWER: {
    label: 'Reviewer',
    variant: 'outline' as const,
    bgClass: 'bg-vision-gray-50',
    textClass: 'text-vision-gray-950',
  },
};

export function TaskAssignments({
  taskId,
  assignments,
  onAssignmentsChange,
}: TaskAssignmentsProps) {
  const { activeOrganization } = useOrganization();
  const [showAddForm, setShowAddForm] = useState(false);
  const [orgMembers, setOrgMembers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<'OWNER' | 'COLLABORATOR' | 'REVIEWER'>(
    'COLLABORATOR'
  );
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load organization members when add form is shown
  useEffect(() => {
    if (showAddForm && activeOrganization) {
      loadOrgMembers();
    }
  }, [showAddForm, activeOrganization]);

  const loadOrgMembers = async () => {
    if (!activeOrganization) return;

    try {
      setLoadingMembers(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from('organization_members')
        .select('user_id, users(id, name, email, avatar_url)')
        .eq('organization_id', activeOrganization.id);

      if (error) throw error;

      // Extract users and filter out already assigned ones
      const assignedUserIds = assignments.map(
        (assignment) => assignment.user_id || assignment.assigned_to
      );
      const users = data
        .map((member: any) => member.users)
        .filter((user: User) => user && !assignedUserIds.includes(user.id));

      setOrgMembers(users);
    } catch (error) {
      console.error('Error loading organization members:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleAssignUser = async () => {
    if (!selectedUserId) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/v1/apps/visionflow/tasks/${taskId}/assignments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: selectedUserId,
            role: selectedRole,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to assign user');
      }

      // Reset form
      setSelectedUserId('');
      setSelectedRole('COLLABORATOR');
      setShowAddForm(false);
      setSearchQuery('');

      // Notify parent to refresh
      if (onAssignmentsChange) {
        onAssignmentsChange();
      }
    } catch (error) {
      console.error('Error assigning user:', error);
      alert(error instanceof Error ? error.message : 'Failed to assign user');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this assignment?')) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/v1/apps/visionflow/tasks/${taskId}/assignments?user_id=${userId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to unassign user');
      }

      // Notify parent to refresh
      if (onAssignmentsChange) {
        onAssignmentsChange();
      }
    } catch (error) {
      console.error('Error unassigning user:', error);
      alert(error instanceof Error ? error.message : 'Failed to unassign user');
    } finally {
      setLoading(false);
    }
  };

  // Filter members based on search query
  const filteredMembers = orgMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="space-y-3">
      {/* Assigned Users List */}
      {assignments.length > 0 ? (
        <div className="space-y-2">
          {assignments.map((assignment) => {
            const assignmentUserId = assignment.user_id || assignment.assigned_to;
            const roleConfig = ROLE_CONFIG[assignment.role];
            return (
              <GlowCard
                key={assignment.id}
                variant="flat"
                padding="sm"
                className="shadow-ambient-card hover:shadow-ambient-card-hover transition-shadow"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {assignment.user.avatar_url ? (
                        <img
                          src={assignment.user.avatar_url}
                          alt={assignment.user.name}
                          className="h-8 w-8 rounded-full ring-2 ring-white"
                        />
                      ) : (
                        <div className={`h-8 w-8 rounded-full ${roleConfig.bgClass} flex items-center justify-center ring-2 ring-white`}>
                          <span className={`text-sm font-medium ${roleConfig.textClass}`}>
                            {getUserInitial(assignment.user.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {assignment.user.name}
                      </p>
                      <GlowBadge variant={roleConfig.variant} size="sm">
                        {roleConfig.label}
                      </GlowBadge>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <GlowButton
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      assignmentUserId && handleUnassignUser(assignmentUserId)
                    }
                    disabled={loading}
                    className="text-muted-foreground hover:text-vision-red-900"
                  >
                    <X className="h-4 w-4" />
                  </GlowButton>
                </div>
              </GlowCard>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic py-2">No one assigned yet</p>
      )}

      {/* Add Assignment Form */}
      {showAddForm ? (
        <GlowCard variant="elevated" padding="md" className="space-y-4">
          {/* Search User */}
          <GlowInput
            label="Search User"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            inputSize="sm"
          />

          {/* User List */}
          {loadingMembers ? (
            <p className="text-sm text-muted-foreground">Loading members...</p>
          ) : filteredMembers.length > 0 ? (
            <div className="max-h-48 overflow-y-auto space-y-1 p-1">
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => {
                    setSelectedUserId(member.id);
                    setSearchQuery(member.name);
                  }}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
                    selectedUserId === member.id
                      ? 'bg-vision-blue-50 ring-2 ring-vision-blue-950 shadow-glow-primary-sm'
                      : 'hover:bg-muted'
                  }`}
                >
                  {/* Avatar */}
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-vision-gray-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-vision-gray-700">
                        {getUserInitial(member.name)}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              {searchQuery ? 'No members found' : 'All members are already assigned'}
            </p>
          )}

          {/* Role Selection */}
          {selectedUserId && (
            <GlowSelect
              label="Role"
              value={selectedRole}
              onChange={(e) =>
                setSelectedRole(e.target.value as 'OWNER' | 'COLLABORATOR' | 'REVIEWER')
              }
              controlSize="sm"
            >
              <option value="COLLABORATOR">Collaborator - Can edit the task</option>
              <option value="REVIEWER">Reviewer - Can review and comment</option>
              <option value="OWNER">Owner - Full control</option>
            </GlowSelect>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <GlowButton
              variant="default"
              size="sm"
              glow="medium"
              onClick={handleAssignUser}
              disabled={!selectedUserId || loading}
              loading={loading}
              className="flex-1"
            >
              {loading ? 'Assigning...' : 'Assign'}
            </GlowButton>
            <GlowButton
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAddForm(false);
                setSelectedUserId('');
                setSearchQuery('');
              }}
              disabled={loading}
            >
              Cancel
            </GlowButton>
          </div>
        </GlowCard>
      ) : (
        <GlowButton
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Assignment
        </GlowButton>
      )}
    </div>
  );
}
