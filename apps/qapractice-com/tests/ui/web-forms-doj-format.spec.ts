// spec: apps/qapractice-com/specs/web-forms.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { validFormDetails } from '@apps/qapractice-com/data/web-forms';

test.describe('Web forms', () => {
  test('Wrong date-of-joining format is reported', async ({ webFormsPage }) => {
    // 1. Fill valid values but date of joining 2021-06-01, click Submit.
    await webFormsPage.goto();
    await webFormsPage.fill({ ...validFormDetails, dateOfJoining: '2021-06-01' });
    await webFormsPage.submit();
    await expect(webFormsPage.fieldErrors).toHaveText(['Date of Joining format should be dd/mm/yyyy']);
    await expect(webFormsPage.success).toBeHidden();
  });
});
