// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Functional testing area', () => {
  test('Search with no match shows an empty state', async ({ practicePage }) => {
    // 1. Type zzzz into #search-input.
    await practicePage.goto();
    const area = practicePage.functional;
    await area.searchFor('potato');
    await expect(area.table).toContainText('No results found');
    await expect(area.pageIndicator).toHaveText('Page 1 of 1');
  });
});
