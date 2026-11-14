// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Interactive elements', () => {
  test('Tooltip appears on hover', async ({ uiElementsPage }) => {
    // 1. Hover Hover Me.
    await uiElementsPage.goto();
    await uiElementsPage.tooltipTrigger.hover();
    await expect(uiElementsPage.tooltip).toHaveText('This is a tooltip!');
  });
});
