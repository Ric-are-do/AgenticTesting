// spec: apps/qapractice-com/specs/web-forms.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Web forms', () => {
  test('Clear resets the form', async ({ webFormsPage }) => {
    // 1. Select India, fill first name Jane and email a@b.com, choose Phone, click Clear.
    await webFormsPage.goto();
    await webFormsPage.country.selectOption({ label: 'India' });
    await webFormsPage.firstName.fill('Jane');
    await webFormsPage.email.fill('a@b.com');
    await webFormsPage.communicationPhone.check();
    await webFormsPage.clear();
    await expect(webFormsPage.country).toHaveValue('');
    await expect(webFormsPage.firstName).toHaveValue('');
    await expect(webFormsPage.email).toHaveValue('');
    await expect(webFormsPage.communicationPhone).not.toBeChecked();
  });
});
