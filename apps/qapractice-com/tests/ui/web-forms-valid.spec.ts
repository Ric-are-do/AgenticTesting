// spec: apps/qapractice-com/specs/web-forms.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { validFormDetails } from '@apps/qapractice-com/data/web-forms';

test.describe('Web forms', () => {
  test('Fully valid form is accepted', async ({ webFormsPage }) => {
    // 1. Fill every field from validFormDetails, click Submit.
    await webFormsPage.goto();
    await webFormsPage.fill(validFormDetails);
    await webFormsPage.submit();
    await expect(webFormsPage.success).toHaveText('Details Successfully Added!');
  });
});
