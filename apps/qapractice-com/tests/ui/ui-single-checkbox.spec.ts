// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Basic elements', () => {
  test('Single checkbox toggles', async ({ uiElementsPage }) => {
    // 1. Check the single checkbox.
    await uiElementsPage.goto();
    await uiElementsPage.singleCheckbox.check();
    await expect(uiElementsPage.output('ui-single-checkbox')).toHaveText('Checked');

    // 2. Uncheck it.
    await uiElementsPage.singleCheckbox.uncheck();
    await expect(uiElementsPage.output('ui-single-checkbox')).toHaveText('Unchecked');
  });
});
