// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('UI/UX issues', () => {
  test('The broken button is disabled (known bug)', async ({ practicePage }) => {
    // 1. Find #broken-button.
    await practicePage.goto();
    await expect(practicePage.uiIssues.brokenButton).toHaveText('Click Me (Disabled Bug)');
    await expect(practicePage.uiIssues.brokenButton).toBeDisabled();
  });
});
