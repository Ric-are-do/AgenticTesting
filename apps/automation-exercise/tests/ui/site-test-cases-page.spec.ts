// spec: apps/automation-exercise/specs/site.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Site pages', () => {
  test('Verify Test Cases Page', async ({ homePage }) => {
    // 1. Open the home page and click 'Test Cases'
    await homePage.goto();
    const testCases = await homePage.header.openTestCases();
    await expect(testCases.page).toHaveURL(/\/test_cases$/);
    await expect(testCases.heading).toBeVisible();
    await expect(testCases.testCase('Test Case 1: Register User')).toBeVisible();
  });
});
