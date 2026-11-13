// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Automation practice', () => {
  test('Tools table lists five tools', async ({ practicePage }) => {
    // 1. Read #automation-table.
    await practicePage.goto();
    const automation = practicePage.automation;
    await expect(automation.toolsHeaders).toHaveText(['Tool', 'Type', 'Level']);
    await expect(automation.toolRows).toHaveText([
      'PlaywrightE2EAdvanced',
      'SeleniumE2EIntermediate',
      'CypressE2EIntermediate',
      'JUnitUnitBeginner',
      'PostmanAPIBeginner',
    ]);
  });
});
