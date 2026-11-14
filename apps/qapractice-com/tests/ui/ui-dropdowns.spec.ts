// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Basic elements', () => {
  test('Dropdowns report the selection', async ({ uiElementsPage }) => {
    // 1. Choose India in the single dropdown.
    await uiElementsPage.goto();
    await uiElementsPage.singleDropdown.selectOption({ label: 'India' });
    await expect(uiElementsPage.output('ui-single-dropdown')).toHaveText('India');

    // 2. Choose Option A and Option C in the multi dropdown.
    await uiElementsPage.multiDropdown.selectOption([{ label: 'Option A' }, { label: 'Option C' }]);
    await expect(uiElementsPage.output('ui-multi-dropdown')).toHaveText('Option A, Option C');
  });
});
