// spec: apps/automation-exercise/specs/checkout.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';
import { invalidCard } from '@apps/automation-exercise/data/payment';

test.describe('Place order', () => {
  test('Payment with an invalid card is rejected', async ({ loginPage, account }) => {
    test.slow(); // many page loads on a slow shared demo site
    // Known bug (seen 2026-11-17): card "abcd", month 13, year 1999, CVC "1" gives
    // "ORDER PLACED!". Remove test.fail() once fixed.
    test.fail(true, 'Known bug: payment accepts any non-empty card details');

    // 1. With an existing account, log in, add product 1, proceed to checkout and click 'Place Order'
    await loginPage.goto();
    const home = await loginPage.login(account.email, account.password);
    const cart = await (await home.products.addToCart(1)).viewCart();
    const payment = await (await cart.proceedToCheckout()).placeOrder('Automated test, please ignore.');

    // 2. Enter card number "abcd", CVC "1", month "13", year "1999" and click [data-qa=pay-button]
    await payment.tryPay(invalidCard);
    await expect(payment.page).not.toHaveURL(/\/payment_done\//);
  });
});
