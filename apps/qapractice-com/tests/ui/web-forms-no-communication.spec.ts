// spec: apps/qapractice-com/specs/web-forms.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { validFormDetails } from '@apps/qapractice-com/data/web-forms';

test.describe('Web forms', () => {
  test('Missing communication preference is reported', async ({ webFormsPage }) => {
    // 1. Fill valid values but select no radio, click Submit.
    await webFormsPage.goto();
    await webFormsPage.fill({ ...validFormDetails, communication: null });
    await webFormsPage.submit();
    await expect(webFormsPage.fieldErrors).toHaveText(['Please select a Communication Preference']);
    await expect(webFormsPage.success).toBeHidden();
  });
});
