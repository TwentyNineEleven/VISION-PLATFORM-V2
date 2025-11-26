import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 *
 * Tests the complete authentication flow including:
 * - User signup
 * - User login
 * - User logout
 * - Password reset
 */

test.describe('Authentication', () => {
  test.describe('Sign Up', () => {
    test('should display signup form', async ({ page }) => {
      await page.goto('/signup');

      await expect(page.locator('h1')).toContainText('Create Account');
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/signup');

      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="password"]', 'Password123!');
      await page.click('button[type="submit"]');

      await expect(page.locator('text=Invalid email')).toBeVisible();
    });

    test('should validate password strength', async ({ page }) => {
      await page.goto('/signup');

      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', '123');
      await page.click('button[type="submit"]');

      await expect(page.locator('text=Password must be')).toBeVisible();
    });

    test('should successfully sign up new user', async ({ page }) => {
      const email = `test-${Date.now()}@example.com`;

      await page.goto('/signup');

      await page.fill('input[name="firstName"]', 'Test');
      await page.fill('input[name="lastName"]', 'User');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', 'Password123!');
      await page.click('button[type="submit"]');

      // Should redirect to onboarding or dashboard
      await expect(page).toHaveURL(/\/(onboarding|dashboard)/);
    });

    test('should show error for existing email', async ({ page }) => {
      await page.goto('/signup');

      await page.fill('input[name="email"]', 'existing@example.com');
      await page.fill('input[name="password"]', 'Password123!');
      await page.click('button[type="submit"]');

      await expect(page.locator('text=already exists')).toBeVisible();
    });
  });

  test.describe('Sign In', () => {
    test('should display signin form', async ({ page }) => {
      await page.goto('/signin');

      await expect(page.locator('h1')).toContainText('Sign In');
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should successfully sign in with valid credentials', async ({ page }) => {
      await page.goto('/signin');

      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'Password123!');
      await page.click('button[type="submit"]');

      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard');
      await expect(page.locator('text=Welcome')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/signin');

      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'WrongPassword');
      await page.click('button[type="submit"]');

      await expect(page.locator('text=Invalid')).toBeVisible();
    });

    test('should redirect to signin when accessing protected route', async ({ page }) => {
      await page.goto('/dashboard');

      // Should redirect to signin
      await expect(page).toHaveURL('/signin');
    });

    test('should remember user session', async ({ page, context }) => {
      // Sign in
      await page.goto('/signin');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'Password123!');
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL('/dashboard');

      // Reload page
      await page.reload();

      // Should still be on dashboard (session persisted)
      await expect(page).toHaveURL('/dashboard');
    });
  });

  test.describe('Sign Out', () => {
    test('should successfully sign out user', async ({ page }) => {
      // Sign in first
      await page.goto('/signin');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'Password123!');
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL('/dashboard');

      // Sign out
      await page.click('[aria-label="User menu"]');
      await page.click('text=Sign Out');

      // Should redirect to home or signin
      await expect(page).toHaveURL(/\/(signin|$)/);
    });

    test('should clear session after sign out', async ({ page }) => {
      // Sign in
      await page.goto('/signin');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'Password123!');
      await page.click('button[type="submit"]');

      // Sign out
      await page.click('[aria-label="User menu"]');
      await page.click('text=Sign Out');

      // Try to access protected route
      await page.goto('/dashboard');

      // Should redirect to signin
      await expect(page).toHaveURL('/signin');
    });
  });

  test.describe('Password Reset', () => {
    test('should display forgot password form', async ({ page }) => {
      await page.goto('/forgot-password');

      await expect(page.locator('h1')).toContainText('Forgot Password');
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should send password reset email', async ({ page }) => {
      await page.goto('/forgot-password');

      await page.fill('input[name="email"]', 'test@example.com');
      await page.click('button[type="submit"]');

      await expect(page.locator('text=Check your email')).toBeVisible();
    });

    test('should handle non-existent email gracefully', async ({ page }) => {
      await page.goto('/forgot-password');

      await page.fill('input[name="email"]', 'nonexistent@example.com');
      await page.click('button[type="submit"]');

      // Should show same message (security best practice)
      await expect(page.locator('text=Check your email')).toBeVisible();
    });
  });
});
