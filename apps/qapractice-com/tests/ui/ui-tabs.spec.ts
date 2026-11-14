// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Complex and advanced components', () => {
  test('Tabs report the active tab', async ({ uiElementsPage }) => {
    // 1. Open the page.
    await uiElementsPage.goto();
    await expect(uiElementsPage.tabsOutput).toHaveText('Active Tab: tab1');

    // 2. Click Tab 2.
    await uiElementsPage.openTab('Tab 2');
    await expect(uiElementsPage.tabsOutput).toHaveText('Active Tab: tab2');
  });
});
