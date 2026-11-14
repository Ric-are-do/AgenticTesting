// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Basic elements', () => {
  test('Radio group is exclusive', async ({ uiElementsPage }) => {
    // 1. Select Radio 1, then Radio 3.
    await uiElementsPage.goto();
    await uiElementsPage.radio(1).check();
    await uiElementsPage.radio(3).check();
    await expect(uiElementsPage.radio(1)).not.toBeChecked();
    await expect(uiElementsPage.output('ui-radio-Radio 1')).toHaveText('Radio 3');
  });
});
