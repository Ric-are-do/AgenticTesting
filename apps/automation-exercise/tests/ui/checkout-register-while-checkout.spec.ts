// spec: apps/automation-exercise/specs/checkout.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';
import { validCard } from '@apps/automation-exercise/data/payment';

test.describe('Place order', () => {
  test('Place Order: Register while Checkout', async ({ productsPage, newUser }) => {
    test.slow(); // many page loads on a slow shared demo site
    // 1. Add products 1 and 2 to the cart and open the cart
    await productsPage.goto();
    await (await productsPage.products.addToCart(1)).continueShopping();
    const cart = await (await productsPage.products.addToCart(2)).viewCart();
    await expect(cart.itemNames).toHaveText(['Blue Top', 'Men Tshirt']);

    // 2. Click 'Proceed To Checkout', then 'Register / Login'
    await cart.proceedToCheckoutLoggedOut();
    const login = await cart.registerOrLogin();
    await expect(login.signupHeading).toBeVisible();

    // 3. Register a new account
    const signup = await login.startSignup(newUser.name, newUser.email);
    const created = await signup.createAccount(newUser);
    await expect(created.heading).toHaveText('Account Created!', { ignoreCase: true });
    const home = await created.continue();
    await expect(home.header.loggedInAs).toContainText(`Logged in as ${newUser.name}`);

    // 4. Open the cart and click 'Proceed To Checkout'
    const checkout = await (await home.header.openCart()).proceedToCheckout();
    await expect(checkout.addressHeading).toBeVisible();
    await expect(checkout.reviewHeading).toBeVisible();
    await expect(checkout.totalAmount).toHaveText('Rs. 900');

    // 5. Enter a comment, click 'Place Order', enter the card details and click [data-qa=pay-button]
    const payment = await checkout.placeOrder('Automated test order, please ignore.');
    const placed = await payment.pay(validCard);
    await expect(placed.heading).toHaveText('Order Placed!', { ignoreCase: true });
    await expect(placed.confirmation).toBeVisible();

    // 6. Click 'Delete Account'
    const deleted = await placed.header.deleteAccount();
    await expect(deleted.heading).toHaveText('Account Deleted!', { ignoreCase: true });
  });
});
