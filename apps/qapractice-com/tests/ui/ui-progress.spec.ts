// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Interactive elements', () => {
  test('Progress increments and stops at 100%', async ({ uiElementsPage }) => {
    // 1. Click Increment Progress once.
    await uiElementsPage.goto();
    await uiElementsPage.progressIncrement.click();
    await expect(uiElementsPage.output('ui-progress-increment')).toHaveText('Progress: 40%');

    // 2. Click it eight more times.
    for (let i = 0; i < 8; i++) await uiElementsPage.progressIncrement.click();
    await expect(uiElementsPage.output('ui-progress-increment')).toHaveText('Progress: 100%');
  });
});
