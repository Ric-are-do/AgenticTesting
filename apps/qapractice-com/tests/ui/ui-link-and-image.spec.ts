// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Interactive elements', () => {
  test('Link and image report clicks', async ({ uiElementsPage }) => {
    // 1. Click the link.
    await uiElementsPage.goto();
    await uiElementsPage.link.click();
    await expect(uiElementsPage.output('ui-link')).toHaveText('Link Clicked!');
    await expect(uiElementsPage.page).toHaveURL(/\/practice-different-ui-elements$/);

    // 2. Click the image.
    await uiElementsPage.image.click();
    await expect(uiElementsPage.output('ui-image')).toHaveText('Image Clicked!');
  });
});
