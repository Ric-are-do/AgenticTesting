// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Functional testing area', () => {
  test('The table starts on page 1 of 3 with four rows', async ({ practicePage }) => {
    // 1. Open the practice page and look at #data-table.
    await practicePage.goto();
    const area = practicePage.functional;
    await expect(area.rows).toHaveCount(4);
    await expect(area.row(1)).toContainText('Playwright Tutorial');
    await expect(area.row(2)).toContainText('Manual Testing Basics');
    await expect(area.row(3)).toContainText('Selenium Guide');
    await expect(area.row(4)).toContainText('Bug Report Writing');
    await expect(area.pageIndicator).toHaveText('Page 1 of 3');
    await expect(area.previousButton).toBeDisabled();
    await expect(area.nextButton).toBeEnabled();
  });
});
