// spec: apps/automation-exercise/specs/site.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Site pages', () => {
  test('Verify Subscription in Cart page', async ({ homePage, newUser }) => {
    // 1. Open the home page and click 'Cart', scroll to the footer
    await homePage.goto();
    const cart = await homePage.header.openCart();
    await cart.footer.scrollToBottom();
    await expect(cart.footer.subscriptionHeading).toBeVisible();

    // 2. Enter an email and click #subscribe
    await cart.footer.subscribe(newUser.email);
    await expect(cart.footer.successMessage).toBeVisible();
  });
});
