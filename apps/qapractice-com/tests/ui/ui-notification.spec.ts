// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Complex and advanced components', () => {
  test('Notification shows a toast', async ({ uiElementsPage }) => {
    // 1. Click Show Notification.
    await uiElementsPage.goto();
    await uiElementsPage.showNotification.click();
    await expect(uiElementsPage.toast).toBeVisible();
    await expect(uiElementsPage.output('ui-show-notification')).toHaveText('Notification shown');
  });
});
