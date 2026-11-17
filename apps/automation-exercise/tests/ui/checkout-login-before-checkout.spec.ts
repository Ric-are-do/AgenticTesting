// spec: apps/automation-exercise/specs/checkout.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';
import { validCard } from '@apps/automation-exercise/data/payment';

test.describe('Place order', () => {
  test('Place Order: Login before Checkout', async ({ loginPage, account }) => {
    test.slow(); // many page loads on a slow shared demo site
    // 1. With an existing account, log in from 'Signup / Login'
    await loginPage.goto();
    const home = await loginPage.login(account.email, account.password);
    await expect(home.header.loggedInAs).toContainText(`Logged in as ${account.name}`);

    // 2. Add product 1 to the cart, open the cart, click 'Proceed To Checkout'
    const cart = await (await home.products.addToCart(1)).viewCart();
    const checkout = await cart.proceedToCheckout();
    await expect(checkout.addressHeading).toBeVisible();
    await expect(checkout.reviewHeading).toBeVisible();

    // 3. Enter a comment, place the order and pay
    const placed = await (await checkout.placeOrder('Automated test order, please ignore.')).pay(validCard);
    await expect(placed.heading).toHaveText('Order Placed!', { ignoreCase: true });

    // 4. Click 'Delete Account'
    const deleted = await placed.header.deleteAccount();
    await expect(deleted.heading).toHaveText('Account Deleted!', { ignoreCase: true });
  });
});
