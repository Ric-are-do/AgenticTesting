// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Basic elements', () => {
  test('Text field and text area mirror the input', async ({ uiElementsPage }) => {
    // 1. Type "Hello QA" in the text field and "line one" in the text area.
    await uiElementsPage.goto();
    await uiElementsPage.textField.fill('Hello QA');
    await uiElementsPage.textArea.fill('line one');
    await expect(uiElementsPage.output('ui-text-field')).toHaveText('Hello QA');
    await expect(uiElementsPage.output('ui-textarea')).toHaveText('line one');
  });
});
