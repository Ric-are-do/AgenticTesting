// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Contact form ("Missing Validations")', () => {
  test('Empty contact form is submitted (known bug)', async ({ practicePage }) => {
    // 1. Click #contact-submit without typing.
    await practicePage.goto();
    await practicePage.contactForm.submit();
    await expect.poll(() => practicePage.dialogs).toEqual(['Submitted! (Bug: no validation)']);
  });
});
