// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Functional testing area', () => {
  test('Search narrows the rows', async ({ practicePage }) => {
    // 1. Type sel into #search-input.
    await practicePage.goto();
    const area = practicePage.functional;
    await area.searchFor('sel');
    await expect(area.rows).toHaveCount(1);
    await expect(area.row(3)).toContainText('Selenium Guide');
    await expect(area.pageIndicator).toHaveText('Page 1 of 1');
  });
});
