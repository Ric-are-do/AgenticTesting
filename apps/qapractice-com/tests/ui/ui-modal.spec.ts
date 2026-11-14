// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Complex and advanced components', () => {
  test('Modal opens and closes', async ({ uiElementsPage }) => {
    // 1. Click Show Modal.
    await uiElementsPage.goto();
    await uiElementsPage.modalOpen.click();
    await expect(uiElementsPage.modal).toContainText('This is a Modal');
    await expect(uiElementsPage.output('ui-modal-open')).toHaveText('Modal is open');

    // 2. Click the footer Close button.
    await uiElementsPage.closeModal();
    await expect(uiElementsPage.modal).toBeHidden();
    await expect(uiElementsPage.output('ui-modal-open')).toHaveText('Click "Show Modal"');
  });
});
