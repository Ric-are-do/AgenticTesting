// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Automation practice', () => {
  test('Toggle hides and shows the element', async ({ practicePage }) => {
    // 1. Check #toggle-button.
    await practicePage.goto();
    const automation = practicePage.automation;
    await expect(automation.toggleButton).toHaveText('Hide Element');
    await expect(automation.toggleContent).toHaveText('This element can be toggled — great for testing visibility assertions!');

    // 2. Click #toggle-button.
    await automation.toggle();
    await expect(automation.toggleContent).toBeHidden();
    await expect(automation.toggleButton).toHaveText('Show Element');

    // 3. Click it again.
    await automation.toggle();
    await expect(automation.toggleContent).toBeVisible();
    await expect(automation.toggleButton).toHaveText('Hide Element');
  });
});
