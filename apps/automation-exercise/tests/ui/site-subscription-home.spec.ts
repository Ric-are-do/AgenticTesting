// spec: apps/automation-exercise/specs/site.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Site pages', () => {
  test('Verify Subscription in home page', async ({ homePage, newUser }) => {
    // 1. Open the home page and scroll to the footer
    await homePage.goto();
    await homePage.footer.scrollToBottom();
    await expect(homePage.footer.subscriptionHeading).toBeVisible();

    // 2. Enter an email in #susbscribe_email and click #subscribe
    await homePage.footer.subscribe(newUser.email);
    await expect(homePage.footer.successMessage).toBeVisible();
  });
});
