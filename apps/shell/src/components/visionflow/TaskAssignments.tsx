/**
 * Task Assignments Component
 * Manages user assignments to tasks with role selection
 * Phase 1: Task Management
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useOrganization } from '@/contexts/OrganizationContext';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

interface Assignment {
  id: string;
  user_id: string;
  role: 'OWNER' | 'COLLABORATOR' | 'REVIEWER';
  user: User;
}

interface TaskAssignmentsProps {
  taskId: string;
  assignments: Assignment[];
  onAssignmentsChange?: () => void;
}

const ROLE_LABELS = {
  OWNER: 'Owner',
  COLLABORATOR: 'Collaborator',
  REVIEWER: 'Reviewer',
};

const ROLE_COLORS = {
  OWNER: 'bg-purple-100 text-purple-700',
  COLLABORATOR: 'bg-blue-100 text-blue-700',
  REVIEWER: 'bg-gray-100 text-gray-700',
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
  const [selectedRole, setSelectedRole] = useState<'OWNER' | 'COLLABORATOR' | 'REVIEWER'>('COLLABORATOR');
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
      const assignedUserIds = assignments.map((a) => a.user_id);
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

  return (
    <div className="space-y-3">
      {/* Assigned Users List */}
      {assignments.length > 0 ? (
        <div className="space-y-2">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {assignment.user.avatar_url ? (
                    <img
                      src={assignment.user.avatar_url}
                      alt={assignment.user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-vision-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-vision-blue-700">
                        {assignment.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {assignment.user.name}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      ROLE_COLORS[assignment.role]
                    }`}
                  >
                    {ROLE_LABELS[assignment.role]}
                  </span>
                </div>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleUnassignUser(assignment.user_id)}
                disabled={loading}
                className="flex-shrink-0 text-gray-400 hover:text-red-600 disabled:opacity-50"
                title="Remove assignment"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No one assigned yet</p>
      )}

      {/* Add Assignment Form */}
      {showAddForm ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
          {/* Search/Select User */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search User
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* User List */}
          {loadingMembers ? (
            <p className="text-sm text-gray-500">Loading members...</p>
          ) : filteredMembers.length > 0 ? (
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => {
                    setSelectedUserId(member.id);
                    setSearchQuery(member.name);
                  }}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-white ${
                    selectedUserId === member.id ? 'bg-blue-50 ring-2 ring-blue-500' : ''
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
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {searchQuery ? 'No members found' : 'All members are already assigned'}
            </p>
          )}

          {/* Role Selection */}
          {selectedUserId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) =>
                  setSelectedRole(e.target.value as 'OWNER' | 'COLLABORATOR' | 'REVIEWER')
                }
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="COLLABORATOR">Collaborator - Can edit the task</option>
                <option value="REVIEWER">Reviewer - Can review and comment</option>
                <option value="OWNER">Owner - Full control</option>
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAssignUser}
              disabled={!selectedUserId || loading}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Assigning...' : 'Assign'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setSelectedUserId('');
                setSearchQuery('');
              }}
              disabled={loading}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Assignment
        </button>
      )}
    </div>
  );
}
