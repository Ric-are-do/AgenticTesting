// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Interactive elements', () => {
  test('Table sorts by name', async ({ uiElementsPage }) => {
    // 1. Open the page.
    await uiElementsPage.goto();
    await expect(uiElementsPage.tableRows.first()).toHaveText(/1\s*Zui\s*30/);

    // 2. Click the Name header.
    await uiElementsPage.nameHeader.click();
    await expect(uiElementsPage.tableRows.first()).toHaveText(/5\s*Ashley\s*30/);
    await expect(uiElementsPage.tableRows.last()).toHaveText(/1\s*Zui\s*30/);
    await expect(uiElementsPage.output('ui-th-name')).toHaveText('Table sorted by name');
  });
});
