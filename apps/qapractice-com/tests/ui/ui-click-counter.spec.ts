// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Basic elements', () => {
  test('Click counter counts clicks', async ({ uiElementsPage }) => {
    // 1. Open the page.
    await uiElementsPage.goto();
    await expect(uiElementsPage.output('ui-click-button')).toHaveText('Clicked 0 times');

    // 2. Click Click Me three times.
    await uiElementsPage.clickTimes(3);
    await expect(uiElementsPage.output('ui-click-button')).toHaveText('Clicked 3 times');
  });
});
