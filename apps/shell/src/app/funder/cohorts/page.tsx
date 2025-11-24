'use client';

import * as React from 'react';
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from '@/components/glow-ui/GlowCard';
import { GlowBadge, GlowButton, GlowInput, GlowModal, GlowModalClose } from '@/components/glow-ui';
import { cohortService } from '@/services/cohortService';
import type { Cohort, CohortFormData, CohortFormErrors } from '@/types/cohort';
import { CalendarClock, Users, Plus, Pencil, Trash2, Archive } from 'lucide-react';

export default function FunderCohortsPage() {
  const [cohorts, setCohorts] = React.useState<Cohort[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedCohort, setSelectedCohort] = React.useState<Cohort | null>(null);
  const [formData, setFormData] = React.useState<CohortFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = React.useState<CohortFormErrors>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadCohorts();
  }, []);

  const loadCohorts = async () => {
    try {
      const data = await cohortService.getCohorts();
      setCohorts(data);
    } catch (err) {
      setError('Failed to load cohorts');
      console.error(err);
    }
  };

  const handleCreateOpen = () => {
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
    });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const handleEditOpen = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setFormData({
      name: cohort.name,
      description: cohort.description,
      startDate: cohort.startDate.split('T')[0], // Convert to YYYY-MM-DD
      endDate: cohort.endDate.split('T')[0],
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleCreate = async () => {
    setErrors({});
    setError(null);
    setIsLoading(true);

    try {
      await cohortService.createCohort(formData);
      await loadCohorts();
      setIsCreateModalOpen(false);
      setSuccess('Cohort created successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setErrors({ _form: err.message });
      } else {
        setErrors({ _form: 'Failed to create cohort' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCohort) return;

    setErrors({});
    setError(null);
    setIsLoading(true);

    try {
      await cohortService.updateCohort(selectedCohort.id, formData);
      await loadCohorts();
      setIsEditModalOpen(false);
      setSelectedCohort(null);
      setSuccess('Cohort updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setErrors({ _form: err.message });
      } else {
        setErrors({ _form: 'Failed to update cohort' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (cohort: Cohort) => {
    if (!confirm(`Archive cohort "${cohort.name}"? This action can be reversed later.`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await cohortService.archiveCohort(cohort.id);
      await loadCohorts();
      setSuccess('Cohort archived successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to archive cohort');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (cohort: Cohort) => {
    if (!confirm(`Delete cohort "${cohort.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await cohortService.deleteCohort(cohort.id);
      await loadCohorts();
      setSuccess('Cohort deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete cohort');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Cohort['status']) => {
    const styles = {
      active: 'bg-vision-green-50 text-vision-green-700 border-vision-green-200',
      upcoming: 'bg-vision-blue-50 text-vision-blue-700 border-vision-blue-200',
      archived: 'bg-vision-gray-100 text-vision-gray-700 border-vision-gray-300',
    };

    const labels = {
      active: 'Active',
      upcoming: 'Upcoming',
      archived: 'Archived',
    };

    return (
      <GlowBadge variant="outline" size="sm" className={styles[status]}>
        {labels[status]}
        <span className="sr-only">cohort status</span>
      </GlowBadge>
    );
  };

  return (
    <>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-vision-blue-700">Funder</p>
            <h1 className="text-3xl font-semibold text-vision-gray-950">Cohorts</h1>
            <p className="text-sm text-vision-gray-700">
              Organize grantees into cohorts for learning, pilots, and capacity building.
            </p>
          </div>
          <GlowButton
            glow="subtle"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={handleCreateOpen}
            disabled={isLoading}
            aria-label="Create new cohort"
          >
            New cohort
          </GlowButton>
        </div>

        {/* Status Messages */}
        <div aria-live="polite" aria-atomic="true">
          {error && (
            <div
              className="bg-vision-red-50 border border-vision-red-600 text-vision-red-900 px-4 py-3 rounded"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="bg-vision-green-50 border border-vision-green-600 text-vision-green-900 px-4 py-3 rounded"
              role="status"
            >
              {success}
            </div>
          )}
        </div>

        {/* Cohorts Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cohorts.length === 0 ? (
            <div className="col-span-full bg-vision-gray-50 rounded-lg p-8 text-center border border-vision-gray-200">
              <p className="text-vision-gray-700">
                No cohorts yet. Create your first cohort to get started.
              </p>
            </div>
          ) : (
            cohorts.map((cohort) => (
              <GlowCard key={cohort.id} variant="interactive" padding="md" className="h-full">
                <GlowCardHeader className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <GlowCardTitle className="text-lg text-vision-gray-950">
                      {cohort.name}
                    </GlowCardTitle>
                    {getStatusBadge(cohort.status)}
                  </div>
                  <GlowCardDescription className="text-vision-gray-700">
                    {cohort.description}
                  </GlowCardDescription>
                </GlowCardHeader>
                <GlowCardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-vision-gray-700">
                    <span className="inline-flex items-center gap-2">
                      <CalendarClock className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Start date:</span>
                      {new Date(cohort.startDate).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <CalendarClock className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">End date:</span>
                      {new Date(cohort.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-vision-gray-200">
                    <span className="inline-flex items-center gap-2 text-sm text-vision-gray-700">
                      <Users className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Number of members:</span>
                      {cohort.granteeCount} {cohort.granteeCount === 1 ? 'member' : 'members'}
                    </span>
                    <span className="text-sm font-medium text-vision-gray-950">
                      ${cohort.totalFunding.toLocaleString()}
                      <span className="sr-only">total funding</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-vision-gray-200">
                    <GlowButton
                      variant="ghost"
                      size="sm"
                      leftIcon={<Pencil className="h-4 w-4" />}
                      onClick={() => handleEditOpen(cohort)}
                      disabled={isLoading}
                      aria-label={`Edit ${cohort.name} cohort`}
                    >
                      Edit
                    </GlowButton>

                    {cohort.status !== 'archived' && (
                      <GlowButton
                        variant="ghost"
                        size="sm"
                        leftIcon={<Archive className="h-4 w-4" />}
                        onClick={() => handleArchive(cohort)}
                        disabled={isLoading}
                        aria-label={`Archive ${cohort.name} cohort`}
                      >
                        Archive
                      </GlowButton>
                    )}

                    <GlowButton
                      variant="ghost"
                      size="sm"
                      leftIcon={<Trash2 className="h-4 w-4" />}
                      onClick={() => handleDelete(cohort)}
                      disabled={isLoading}
                      aria-label={`Delete ${cohort.name} cohort`}
                    >
                      Delete
                    </GlowButton>
                  </div>
                </GlowCardContent>
              </GlowCard>
            ))
          )}
        </div>
      </div>

      {/* Create Modal */}
      <GlowModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Create cohort"
        description="Define the cohort name, description, and dates. You can add members later."
        size="lg"
        footer={
          <>
            <GlowModalClose asChild>
              <GlowButton variant="outline" disabled={isLoading}>
                Cancel
              </GlowButton>
            </GlowModalClose>
            <GlowButton
              glow="subtle"
              onClick={handleCreate}
              disabled={isLoading}
              aria-label="Create new cohort"
            >
              {isLoading ? 'Creating...' : 'Create cohort'}
            </GlowButton>
          </>
        }
      >
        <div className="space-y-4">
          {errors._form && (
            <div
              className="bg-vision-red-50 border border-vision-red-600 text-vision-red-900 px-4 py-3 rounded"
              role="alert"
            >
              {errors._form}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="create-cohort-name" className="text-sm font-medium text-vision-gray-950">
              Cohort name
              <span className="text-vision-red-700" aria-label="required">
                {' '}
                *
              </span>
            </label>
            <GlowInput
              id="create-cohort-name"
              placeholder="Innovation Lab 2025"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'create-name-error' : undefined}
            />
            {errors.name && (
              <p id="create-name-error" className="text-sm text-vision-red-900" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="create-cohort-description" className="text-sm font-medium text-vision-gray-950">
              Description
              <span className="text-vision-red-700" aria-label="required">
                {' '}
                *
              </span>
            </label>
            <textarea
              id="create-cohort-description"
              placeholder="Capacity building for youth programs"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-2 w-full rounded-md border border-vision-gray-300 bg-white p-3 text-sm text-vision-gray-950 focus:border-vision-blue-700 focus:ring-2 focus:ring-vision-blue-700"
              rows={3}
              disabled={isLoading}
              required
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'create-description-error' : undefined}
            />
            {errors.description && (
              <p id="create-description-error" className="text-sm text-vision-red-900" role="alert">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="create-cohort-start-date" className="text-sm font-medium text-vision-gray-950">
                Start date
                <span className="text-vision-red-700" aria-label="required">
                  {' '}
                  *
                </span>
              </label>
              <GlowInput
                id="create-cohort-start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                disabled={isLoading}
                required
                aria-invalid={!!errors.startDate}
                aria-describedby={errors.startDate ? 'create-start-date-error' : undefined}
              />
              {errors.startDate && (
                <p id="create-start-date-error" className="text-sm text-vision-red-900" role="alert">
                  {errors.startDate}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="create-cohort-end-date" className="text-sm font-medium text-vision-gray-950">
                End date
                <span className="text-vision-red-700" aria-label="required">
                  {' '}
                  *
                </span>
              </label>
              <GlowInput
                id="create-cohort-end-date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={isLoading}
                required
                aria-invalid={!!errors.endDate}
                aria-describedby={errors.endDate ? 'create-end-date-error' : undefined}
              />
              {errors.endDate && (
                <p id="create-end-date-error" className="text-sm text-vision-red-900" role="alert">
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-vision-gray-700">
            After creating the cohort you&apos;ll be able to add members, assign facilitators, and track shared
            outcomes.
          </p>
        </div>
      </GlowModal>

      {/* Edit Modal */}
      <GlowModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit cohort"
        description="Update the cohort details. Changes will be saved immediately."
        size="lg"
        footer={
          <>
            <GlowModalClose asChild>
              <GlowButton variant="outline" disabled={isLoading}>
                Cancel
              </GlowButton>
            </GlowModalClose>
            <GlowButton
              glow="subtle"
              onClick={handleUpdate}
              disabled={isLoading}
              aria-label={`Save changes to ${selectedCohort?.name || 'cohort'}`}
            >
              {isLoading ? 'Saving...' : 'Save changes'}
            </GlowButton>
          </>
        }
      >
        <div className="space-y-4">
          {errors._form && (
            <div
              className="bg-vision-red-50 border border-vision-red-600 text-vision-red-900 px-4 py-3 rounded"
              role="alert"
            >
              {errors._form}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="edit-cohort-name" className="text-sm font-medium text-vision-gray-950">
              Cohort name
              <span className="text-vision-red-700" aria-label="required">
                {' '}
                *
              </span>
            </label>
            <GlowInput
              id="edit-cohort-name"
              placeholder="Innovation Lab 2025"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'edit-name-error' : undefined}
            />
            {errors.name && (
              <p id="edit-name-error" className="text-sm text-vision-red-900" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-cohort-description" className="text-sm font-medium text-vision-gray-950">
              Description
              <span className="text-vision-red-700" aria-label="required">
                {' '}
                *
              </span>
            </label>
            <textarea
              id="edit-cohort-description"
              placeholder="Capacity building for youth programs"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-2 w-full rounded-md border border-vision-gray-300 bg-white p-3 text-sm text-vision-gray-950 focus:border-vision-blue-700 focus:ring-2 focus:ring-vision-blue-700"
              rows={3}
              disabled={isLoading}
              required
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'edit-description-error' : undefined}
            />
            {errors.description && (
              <p id="edit-description-error" className="text-sm text-vision-red-900" role="alert">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="edit-cohort-start-date" className="text-sm font-medium text-vision-gray-950">
                Start date
                <span className="text-vision-red-700" aria-label="required">
                  {' '}
                  *
                </span>
              </label>
              <GlowInput
                id="edit-cohort-start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                disabled={isLoading}
                required
                aria-invalid={!!errors.startDate}
                aria-describedby={errors.startDate ? 'edit-start-date-error' : undefined}
              />
              {errors.startDate && (
                <p id="edit-start-date-error" className="text-sm text-vision-red-900" role="alert">
                  {errors.startDate}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="edit-cohort-end-date" className="text-sm font-medium text-vision-gray-950">
                End date
                <span className="text-vision-red-700" aria-label="required">
                  {' '}
                  *
                </span>
              </label>
              <GlowInput
                id="edit-cohort-end-date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={isLoading}
                required
                aria-invalid={!!errors.endDate}
                aria-describedby={errors.endDate ? 'edit-end-date-error' : undefined}
              />
              {errors.endDate && (
                <p id="edit-end-date-error" className="text-sm text-vision-red-900" role="alert">
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>
        </div>
      </GlowModal>
    </>
  );
}
