import { z } from 'zod';

// Step 1: Basic Info
export const basicInfoSchema = z.object({
  appName: z
    .string()
    .min(1, 'App name is required')
    .max(50, 'App name must be less than 50 characters'),
  appDescription: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must be less than 200 characters'),
  category: z.string().min(1, 'Please select a category'),
});

// Step 2: Configuration
export const configurationSchema = z.object({
  apiKey: z
    .string()
    .min(10, 'API key must be at least 10 characters')
    .max(100, 'API key is too long'),
  webhookUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  environment: z.enum(['development', 'staging', 'production'], {
    errorMap: () => ({ message: 'Please select an environment' }),
  }),
  autoSync: z.boolean().default(false),
});

// Step 3: Permissions
export const permissionsSchema = z.object({
  permissions: z
    .array(z.string())
    .min(1, 'Select at least one permission')
    .max(10, 'Too many permissions selected'),
  notificationPreferences: z.object({
    email: z.boolean().default(true),
    inApp: z.boolean().default(true),
    webhook: z.boolean().default(false),
  }),
});

// Complete onboarding schema
export const onboardingSchema = z.object({
  basicInfo: basicInfoSchema,
  configuration: configurationSchema,
  permissions: permissionsSchema,
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
export type BasicInfoData = z.infer<typeof basicInfoSchema>;
export type ConfigurationData = z.infer<typeof configurationSchema>;
export type PermissionsData = z.infer<typeof permissionsSchema>;
