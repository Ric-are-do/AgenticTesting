// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Complex and advanced components', () => {
  test('Date input reports the date', async ({ uiElementsPage }) => {
    // 1. Type 2027-01-15 in the date input.
    await uiElementsPage.goto();
    await uiElementsPage.datePicker.fill('2027-01-15');
    await expect(uiElementsPage.output('ui-datepicker')).toHaveText('2027-01-15');
  });
});
