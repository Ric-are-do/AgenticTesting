// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Functional testing area', () => {
  test('Paging moves through the rows', async ({ practicePage }) => {
    // 1. Click #next-page.
    await practicePage.goto();
    const area = practicePage.functional;
    await area.nextPage();
    await expect(area.pageIndicator).toHaveText('Page 2 of 3');
    await expect(area.rows).toHaveCount(4);
    await expect(area.row(5)).toContainText('GitHub Copilot for QA');
    await expect(area.row(6)).toContainText('API Testing Intro');
    await expect(area.row(7)).toContainText('Test Case Design');
    await expect(area.row(8)).toContainText('AI Test Generation');

    // 2. Click #next-page again.
    await area.nextPage();
    await expect(area.pageIndicator).toHaveText('Page 3 of 3');
    await expect(area.nextButton).toBeDisabled();
  });
});
