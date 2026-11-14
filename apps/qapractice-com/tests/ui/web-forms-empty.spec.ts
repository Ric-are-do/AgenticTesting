// spec: apps/qapractice-com/specs/web-forms.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Web forms', () => {
  test('Empty form lists every required field', async ({ webFormsPage }) => {
    // 1. Click Submit with everything empty.
    await webFormsPage.goto();
    await webFormsPage.submit();
    await expect(webFormsPage.fieldErrors).toHaveText([
      'Country of Residence is required',
      'Title is required',
      'First Name is required',
      'Last Name is required',
      'Date of Birth is required',
      'Date of Joining is required (dd/mm/yyyy)',
      'Email Address is required',
      'Phone Number is required',
      'Please select a Communication Preference',
    ]);
  });
});
