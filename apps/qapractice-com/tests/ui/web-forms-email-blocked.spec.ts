// spec: apps/qapractice-com/specs/web-forms.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { validFormDetails } from '@apps/qapractice-com/data/web-forms';

test.describe('Web forms', () => {
  test('Email without @ is blocked by the browser', async ({ webFormsPage }) => {
    // 1. Fill valid values but email "notanemail", click Submit.
    await webFormsPage.goto();
    await webFormsPage.fill({ ...validFormDetails, email: 'notanemail' });
    await webFormsPage.submit();
    expect(await webFormsPage.email.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);
    await expect(webFormsPage.success).toBeHidden();
    await expect(webFormsPage.fieldErrors).toHaveCount(0);
  });
});
