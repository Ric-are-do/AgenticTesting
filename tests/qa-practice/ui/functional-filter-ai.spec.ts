// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Functional testing area', () => {
  test('Category filter shows only that category', async ({ practicePage }) => {
    // 1. Click #filter-ai.
    await practicePage.goto();
    const area = practicePage.functional;
    await area.filterBy('ai');
    await expect(area.rows).toHaveCount(2);
    await expect(area.row(5)).toContainText('GitHub Copilot for QA');
    await expect(area.row(8)).toContainText('AI Test Generation');
    await expect(area.pageIndicator).toHaveText('Page 1 of 1');

    // 2. Click #filter-all.
    await area.filterBy('all');
    await expect(area.pageIndicator).toHaveText('Page 1 of 3');
  });
});
