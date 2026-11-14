// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Basic elements', () => {
  test('Multiple checkboxes are listed', async ({ uiElementsPage }) => {
    // 1. Check Option 1 and Option 3.
    await uiElementsPage.goto();
    await uiElementsPage.checkbox(1).check();
    await uiElementsPage.checkbox(3).check();
    await expect(uiElementsPage.output('ui-checkbox-option1')).toHaveText('Checked: option1, option3');
  });
});
