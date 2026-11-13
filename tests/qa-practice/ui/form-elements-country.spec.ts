// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Form elements', () => {
  test('Country select lists four countries and keeps the choice', async ({ practicePage }) => {
    // 1. Click #select-country (a combobox).
    await practicePage.goto();
    await practicePage.formElements.openCountries();
    await expect(practicePage.formElements.countryOptions).toHaveText(['United States', 'United Kingdom', 'Pakistan', 'India']);

    // 2. Choose Pakistan.
    await practicePage.page.keyboard.press('Escape');
    await practicePage.formElements.chooseCountry('Pakistan');
    await expect(practicePage.formElements.country).toHaveText('Pakistan');
  });
});
