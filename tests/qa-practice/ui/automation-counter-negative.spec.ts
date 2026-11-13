// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Automation practice', () => {
  test('Counter goes below zero', async ({ practicePage }) => {
    // 1. Click #counter-decrement twice.
    await practicePage.goto();
    await practicePage.automation.decrement(2);
    await expect(practicePage.automation.counter).toHaveText('-2');
  });
});
