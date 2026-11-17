// spec: apps/automation-exercise/specs/checkout.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Place order', () => {
  test('Payment with empty card details is blocked', async ({ loginPage, account }) => {
    test.slow(); // many page loads on a slow shared demo site
    // 1. With an existing account, log in, add product 1, proceed to checkout and click 'Place Order'
    await loginPage.goto();
    const home = await loginPage.login(account.email, account.password);
    const cart = await (await home.products.addToCart(1)).viewCart();
    const payment = await (await cart.proceedToCheckout()).placeOrder('Automated test, please ignore.');
    await expect(payment.page).toHaveURL(/\/payment$/);

    // 2. Click [data-qa=pay-button] with every card field empty
    await payment.submit();
    await expect(payment.nameOnCard).toHaveJSProperty('validationMessage', 'Please fill out this field.');
    await expect(payment.page).toHaveURL(/\/payment$/);
  });
});
