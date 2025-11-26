import type { Cohort, CohortFormData } from '@/types/cohort';

const COHORT_STORAGE_KEY = 'vision_cohorts';

export const cohortService = {
  /**
   * Get all cohorts
   */
  async getCohorts(): Promise<Cohort[]> {
    try {
      const cohorts = localStorage.getItem(COHORT_STORAGE_KEY);
      const parsed = cohorts ? JSON.parse(cohorts) : [];

      // Sort by start date (newest first)
      return parsed.sort((a: Cohort, b: Cohort) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    } catch (err) {
      console.error('Failed to get cohorts from localStorage:', err);
      return [];
    }
  },

  /**
   * Get cohort by ID
   */
  async getCohortById(id: string): Promise<Cohort | null> {
    const cohorts = await this.getCohorts();
    return cohorts.find(c => c.id === id) || null;
  },

  /**
   * Create new cohort
   */
  async createCohort(data: CohortFormData): Promise<Cohort> {
    // Validate
    const validation = this.validateCohort(data);
    if (!validation.valid) {
      throw new Error(Object.values(validation.errors)[0]);
    }

    const newCohort: Cohort = {
      id: `cohort_${Date.now()}`,
      ...data,
      status: this.determineStatus(data.startDate, data.endDate),
      granteeCount: 0,
      totalFunding: 0,
      fundingAllocated: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user', // TODO: Get from auth context
    };

    const cohorts = await this.getCohorts();
    cohorts.push(newCohort);

    try {
      localStorage.setItem(COHORT_STORAGE_KEY, JSON.stringify(cohorts));
      return newCohort;
    } catch (err) {
      console.error('Failed to save cohort to localStorage:', err);
      throw new Error('Failed to save cohort');
    }
  },

  /**
   * Update existing cohort
   */
  async updateCohort(id: string, updates: Partial<CohortFormData>): Promise<Cohort> {
    const cohorts = await this.getCohorts();
    const index = cohorts.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error('Cohort not found');
    }

    // Validate if updating dates
    if (updates.startDate || updates.endDate) {
      const validation = this.validateCohort({
        name: cohorts[index].name,
        description: cohorts[index].description,
        startDate: updates.startDate || cohorts[index].startDate,
        endDate: updates.endDate || cohorts[index].endDate,
      });

      if (!validation.valid) {
        throw new Error(Object.values(validation.errors)[0]);
      }
    }

    cohorts[index] = {
      ...cohorts[index],
      ...updates,
      status: updates.startDate || updates.endDate
        ? this.determineStatus(
            updates.startDate || cohorts[index].startDate,
            updates.endDate || cohorts[index].endDate
          )
        : cohorts[index].status,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(COHORT_STORAGE_KEY, JSON.stringify(cohorts));
      return cohorts[index];
    } catch (err) {
      console.error('Failed to update cohort in localStorage:', err);
      throw new Error('Failed to update cohort');
    }
  },

  /**
   * Archive a cohort
   */
  async archiveCohort(id: string): Promise<void> {
    const cohorts = await this.getCohorts();
    const index = cohorts.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error('Cohort not found');
    }

    cohorts[index] = {
      ...cohorts[index],
      status: 'archived',
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(COHORT_STORAGE_KEY, JSON.stringify(cohorts));
    } catch (err) {
      console.error('Failed to archive cohort in localStorage:', err);
      throw new Error('Failed to archive cohort');
    }
  },

  /**
   * Delete a cohort
   */
  async deleteCohort(id: string): Promise<void> {
    const cohorts = await this.getCohorts();
    const filtered = cohorts.filter(c => c.id !== id);

    if (filtered.length === cohorts.length) {
      throw new Error('Cohort not found');
    }

    try {
      localStorage.setItem(COHORT_STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error('Failed to delete cohort from localStorage:', err);
      throw new Error('Failed to delete cohort');
    }
  },

  /**
   * Validate cohort data
   */
  validateCohort(data: CohortFormData): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Name validation
    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Cohort name is required';
    } else if (data.name.length < 3) {
      errors.name = 'Cohort name must be at least 3 characters';
    } else if (data.name.length > 100) {
      errors.name = 'Cohort name must be less than 100 characters';
    }

    // Description validation
    if (!data.description || data.description.trim().length === 0) {
      errors.description = 'Description is required';
    } else if (data.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (data.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    // Date validation
    if (!data.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!data.endDate) {
      errors.endDate = 'End date is required';
    }

    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (end <= start) {
        errors.endDate = 'End date must be after start date';
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Determine cohort status based on dates
   */
  determineStatus(startDate: string, endDate: string): 'active' | 'upcoming' | 'archived' {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return 'upcoming';
    } else if (now > end) {
      return 'archived';
    } else {
      return 'active';
    }
  },
};
