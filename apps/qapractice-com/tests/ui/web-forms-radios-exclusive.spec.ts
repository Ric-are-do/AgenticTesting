// spec: apps/qapractice-com/specs/web-forms.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Web forms', () => {
  test('Communication radios are exclusive', async ({ webFormsPage }) => {
    // 1. Check Email, then Phone.
    await webFormsPage.goto();
    await webFormsPage.communicationEmail.check();
    await webFormsPage.communicationPhone.check();
    await expect(webFormsPage.communicationPhone).toBeChecked();
    await expect(webFormsPage.communicationEmail).not.toBeChecked();
  });
});
