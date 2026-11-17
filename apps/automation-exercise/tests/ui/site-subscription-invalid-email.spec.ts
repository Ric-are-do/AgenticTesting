// spec: apps/automation-exercise/specs/site.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Site pages', () => {
  test('Subscription with an invalid email is blocked', async ({ homePage }) => {
    // 1. Open the home page, enter "not-an-email" in #susbscribe_email and click #subscribe
    await homePage.goto();
    await homePage.footer.subscribe('not-an-email');
    await expect(homePage.footer.emailInput).toHaveJSProperty(
      'validationMessage',
      "Please include an '@' in the email address. 'not-an-email' is missing an '@'.",
    );
    await expect(homePage.footer.successMessage).toBeHidden();
  });
});
