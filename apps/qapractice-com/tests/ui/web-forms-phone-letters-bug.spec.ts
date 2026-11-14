// spec: apps/qapractice-com/specs/web-forms.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { validFormDetails } from '@apps/qapractice-com/data/web-forms';

test.describe('Web forms', () => {
  test('Letters in the phone number are rejected (known bug)', async ({ webFormsPage }) => {
    // Known bug (seen 2026-11-13): a phone number of "abcdef" is accepted with "Details Successfully Added!".
    // The test states the correct behaviour and is expected to fail until the
    // site is fixed; then Playwright reports it as an unexpected pass.
    test.fail(true, 'Known bug: a phone number of "abcdef" is accepted with "Details Successfully Added!".');
    // 1. Fill valid values but phone "abcdef", click Submit.
    await webFormsPage.goto();
    await webFormsPage.fill({ ...validFormDetails, phoneNumber: 'abcdef' });
    await webFormsPage.submit();
    await expect(webFormsPage.fieldErrors.first()).toBeVisible();
    await expect(webFormsPage.success).toBeHidden();
  });
});
