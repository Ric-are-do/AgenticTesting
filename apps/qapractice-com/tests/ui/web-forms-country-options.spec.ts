// spec: apps/qapractice-com/specs/web-forms.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Web forms', () => {
  test('Country dropdown offers six countries', async ({ webFormsPage }) => {
    // 1. Open the page and read the country options.
    await webFormsPage.goto();
    await expect(webFormsPage.country.locator('option')).toHaveText([
      'Select Country', 'United States', 'Canada', 'United Kingdom', 'India', 'Australia', 'Other',
    ]);
  });
});
