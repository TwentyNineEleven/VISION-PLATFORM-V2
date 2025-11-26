import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Document Management E2E Tests
 *
 * Tests the complete document management flow including:
 * - Document upload
 * - Document list/grid view
 * - Document search and filtering
 * - Document download
 * - Document deletion
 * - Folder creation and navigation
 */

test.describe('Document Management', () => {
  // Setup: Sign in before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // Navigate to documents page
    await page.click('text=Files');
    await expect(page).toHaveURL('/files');
  });

  test.describe('Document Upload', () => {
    test('should display upload button', async ({ page }) => {
      await expect(page.locator('button:has-text("Upload")')).toBeVisible();
    });

    test('should open upload modal', async ({ page }) => {
      await page.click('button:has-text("Upload")');

      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.locator('text=Upload Document')).toBeVisible();
    });

    test('should upload single document', async ({ page }) => {
      await page.click('button:has-text("Upload")');

      // Create a test file
      const fileContent = 'Test document content';
      const buffer = Buffer.from(fileContent);

      // Upload file
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: 'test-document.pdf',
        mimeType: 'application/pdf',
        buffer,
      });

      // Fill in document details
      await page.fill('input[name="name"]', 'Test Document');
      await page.fill('textarea[name="description"]', 'This is a test document');

      // Submit upload
      await page.click('button[type="submit"]');

      // Wait for success message
      await expect(page.locator('text=uploaded successfully')).toBeVisible();

      // Verify document appears in list
      await expect(page.locator('text=Test Document')).toBeVisible();
    });

    test('should validate file size limit (15MB)', async ({ page }) => {
      await page.click('button:has-text("Upload")');

      // Create a large file (16MB)
      const largeBuffer = Buffer.alloc(16 * 1024 * 1024);

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: 'large-file.pdf',
        mimeType: 'application/pdf',
        buffer: largeBuffer,
      });

      await expect(page.locator('text=exceeds maximum')).toBeVisible();
    });

    test('should add tags to document', async ({ page }) => {
      await page.click('button:has-text("Upload")');

      const buffer = Buffer.from('Test content');
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: 'tagged-doc.pdf',
        mimeType: 'application/pdf',
        buffer,
      });

      await page.fill('input[name="name"]', 'Tagged Document');

      // Add tags
      await page.fill('input[name="tags"]', 'important');
      await page.press('input[name="tags"]', 'Enter');
      await page.fill('input[name="tags"]', 'urgent');
      await page.press('input[name="tags"]', 'Enter');

      await page.click('button[type="submit"]');

      await expect(page.locator('text=uploaded successfully')).toBeVisible();

      // Verify tags are displayed
      await expect(page.locator('text=important')).toBeVisible();
      await expect(page.locator('text=urgent')).toBeVisible();
    });
  });

  test.describe('Document List', () => {
    test('should display documents in list view', async ({ page }) => {
      await expect(page.locator('[data-testid="document-list"]')).toBeVisible();
    });

    test('should switch to grid view', async ({ page }) => {
      await page.click('[aria-label="Grid view"]');

      await expect(page.locator('[data-testid="document-grid"]')).toBeVisible();
    });

    test('should display document metadata', async ({ page }) => {
      const firstDoc = page.locator('[data-testid="document-item"]').first();

      await expect(firstDoc.locator('.document-name')).toBeVisible();
      await expect(firstDoc.locator('.document-size')).toBeVisible();
      await expect(firstDoc.locator('.document-date')).toBeVisible();
    });
  });

  test.describe('Document Search and Filtering', () => {
    test('should search documents by name', async ({ page }) => {
      await page.fill('input[placeholder="Search documents"]', 'Test Document');

      // Wait for search results
      await page.waitForTimeout(500);

      // Verify filtered results
      await expect(page.locator('text=Test Document')).toBeVisible();
    });

    test('should filter by tags', async ({ page }) => {
      await page.click('button:has-text("Filter")');
      await page.click('text=Tags');
      await page.click('text=important');

      // Verify filtered results show only tagged documents
      await expect(page.locator('.tag:has-text("important")')).toBeVisible();
    });

    test('should filter by date range', async ({ page }) => {
      await page.click('button:has-text("Filter")');
      await page.click('text=Date Range');

      await page.fill('input[name="dateFrom"]', '2024-01-01');
      await page.fill('input[name="dateTo"]', '2024-12-31');
      await page.click('button:has-text("Apply")');

      // Verify results are within date range
      await expect(page.locator('[data-testid="document-item"]')).toBeVisible();
    });

    test('should sort documents by name', async ({ page }) => {
      await page.click('button:has-text("Sort")');
      await page.click('text=Name A-Z');

      // Verify sorting order
      const docNames = await page.locator('.document-name').allTextContents();
      const sortedNames = [...docNames].sort();
      expect(docNames).toEqual(sortedNames);
    });

    test('should sort documents by date', async ({ page }) => {
      await page.click('button:has-text("Sort")');
      await page.click('text=Newest First');

      // Verify sorting order
      const dates = await page.locator('.document-date').allTextContents();
      // Dates should be in descending order
      expect(dates[0] >= dates[dates.length - 1]).toBeTruthy();
    });
  });

  test.describe('Document Actions', () => {
    test('should open document details', async ({ page }) => {
      await page.click('[data-testid="document-item"]').first();

      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.locator('text=Document Details')).toBeVisible();
    });

    test('should download document', async ({ page }) => {
      // Click on document
      await page.click('[data-testid="document-item"]').first();

      // Start waiting for download
      const downloadPromise = page.waitForEvent('download');

      // Click download button
      await page.click('button:has-text("Download")');

      // Wait for download to complete
      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toBeTruthy();
    });

    test('should rename document', async ({ page }) => {
      await page.click('[data-testid="document-item"]').first();

      await page.click('button:has-text("Rename")');
      await page.fill('input[name="name"]', 'Renamed Document');
      await page.click('button:has-text("Save")');

      await expect(page.locator('text=Renamed Document')).toBeVisible();
    });

    test('should delete document', async ({ page }) => {
      await page.click('[data-testid="document-item"]').first();

      await page.click('button:has-text("Delete")');

      // Confirm deletion
      await page.click('button:has-text("Confirm")');

      await expect(page.locator('text=deleted successfully')).toBeVisible();
    });

    test('should move document to folder', async ({ page }) => {
      await page.click('[data-testid="document-item"]').first();

      await page.click('button:has-text("Move")');
      await page.click('text=Select Folder');
      await page.click('text=My Folder');
      await page.click('button:has-text("Move")');

      await expect(page.locator('text=moved successfully')).toBeVisible();
    });
  });

  test.describe('Folder Management', () => {
    test('should create new folder', async ({ page }) => {
      await page.click('button:has-text("New Folder")');

      await page.fill('input[name="name"]', 'Test Folder');
      await page.click('button[type="submit"]');

      await expect(page.locator('text=Test Folder')).toBeVisible();
    });

    test('should navigate into folder', async ({ page }) => {
      await page.click('text=Test Folder');

      // Verify folder navigation
      await expect(page.locator('text=Test Folder')).toBeVisible();
      await expect(page.locator('[aria-label="Breadcrumb"]')).toContainText('Test Folder');
    });

    test('should navigate back using breadcrumbs', async ({ page }) => {
      await page.click('text=Test Folder');
      await page.click('[aria-label="Breadcrumb"] >> text=Home');

      // Verify back to root
      await expect(page).toHaveURL('/files');
    });

    test('should delete empty folder', async ({ page }) => {
      // Right-click on folder
      await page.click('text=Test Folder', { button: 'right' });
      await page.click('text=Delete');
      await page.click('button:has-text("Confirm")');

      await expect(page.locator('text=deleted successfully')).toBeVisible();
    });
  });

  test.describe('Bulk Operations', () => {
    test('should select multiple documents', async ({ page }) => {
      await page.click('[data-testid="select-all"]');

      const selectedCount = await page.locator('[data-testid="selected-count"]').textContent();
      expect(parseInt(selectedCount!)).toBeGreaterThan(0);
    });

    test('should bulk delete documents', async ({ page }) => {
      await page.click('[data-testid="select-all"]');
      await page.click('button:has-text("Delete Selected")');
      await page.click('button:has-text("Confirm")');

      await expect(page.locator('text=deleted successfully')).toBeVisible();
    });

    test('should bulk move documents', async ({ page }) => {
      await page.click('[data-testid="select-all"]');
      await page.click('button:has-text("Move Selected")');
      await page.click('text=Select Folder');
      await page.click('text=My Folder');
      await page.click('button:has-text("Move")');

      await expect(page.locator('text=moved successfully')).toBeVisible();
    });
  });
});
