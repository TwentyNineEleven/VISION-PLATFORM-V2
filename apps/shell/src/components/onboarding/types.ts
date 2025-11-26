import * as z from 'zod';

export const onboardingSchema = z
  .object({
    displayName: z.string().min(1, 'Display name is required'),
    title: z.string().min(1, 'Title or role is required'),
    phone: z.string().optional(),
    avatar: z.string().optional(),
    organizationChoice: z.enum(['create', 'join']),
    organizationName: z.string().optional(),
    organizationType: z.string().optional(),
    ein: z.string().optional(),
    website: z
      .string()
      .url('Enter a valid URL')
      .optional()
      .or(z.literal('')),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    }),
    inviteCode: z.string().optional(),
    selectedApps: z.array(z.string()).default([]),
    plan: z.enum(['free', 'pro', 'enterprise']),
    skipTour: z.boolean().optional(),
    enableEmailNotifications: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.displayName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['displayName'],
        message: 'Display name is required',
      });
    }

    if (!data.title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['title'],
        message: 'Title or role is required',
      });
    }

    if (data.organizationChoice === 'create') {
      if (!data.organizationName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['organizationName'],
          message: 'Organization name is required',
        });
      }
      if (!data.organizationType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['organizationType'],
          message: 'Select an organization type',
        });
      }
    } else if (data.organizationChoice === 'join' && !data.inviteCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['inviteCode'],
        message: 'Invite code is required to join',
      });
    }
  });

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
