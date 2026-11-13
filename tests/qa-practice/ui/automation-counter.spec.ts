// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Automation practice', () => {
  test('Counter increments, decrements and resets', async ({ practicePage }) => {
    // 1. Check #counter-value.
    await practicePage.goto();
    const automation = practicePage.automation;
    await expect(automation.counter).toHaveText('0');

    // 2. Click #counter-increment twice, then #counter-decrement once.
    await automation.increment(2);
    await automation.decrement();
    await expect(automation.counter).toHaveText('1');

    // 3. Click #counter-reset.
    await automation.reset();
    await expect(automation.counter).toHaveText('0');
  });
});
