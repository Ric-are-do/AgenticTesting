// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Form elements', () => {
  test('Checkboxes toggle', async ({ practicePage }) => {
    // 1. Click #terms-checkbox and #newsletter-checkbox.
    await practicePage.goto();
    await practicePage.formElements.toggleTerms();
    await practicePage.formElements.toggleNewsletter();
    await expect(practicePage.formElements.terms).toHaveAttribute('aria-checked', 'true');
    await expect(practicePage.formElements.newsletter).toHaveAttribute('aria-checked', 'true');

    // 2. Click #terms-checkbox again.
    await practicePage.formElements.toggleTerms();
    await expect(practicePage.formElements.terms).toHaveAttribute('aria-checked', 'false');
    await expect(practicePage.formElements.newsletter).toHaveAttribute('aria-checked', 'true');
  });
});
