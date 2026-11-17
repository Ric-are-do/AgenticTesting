// spec: apps/automation-exercise/specs/checkout.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Place order', () => {
  test('Verify address details in checkout page', async ({ loginPage, newUser }) => {
    test.slow(); // many page loads on a slow shared demo site
    // 1. Register a new account
    await loginPage.goto();
    const signup = await loginPage.startSignup(newUser.name, newUser.email);
    const home = await (await signup.createAccount(newUser)).continue();
    await expect(home.header.loggedInAs).toContainText(`Logged in as ${newUser.name}`);

    // 2. Add product 1 to the cart, open the cart, click 'Proceed To Checkout'
    const cart = await (await home.products.addToCart(1)).viewCart();
    const checkout = await cart.proceedToCheckout();
    const address = [
      `${newUser.title}. ${newUser.firstName} ${newUser.lastName}`,
      newUser.company,
      newUser.address1,
      newUser.address2,
      `${newUser.city} ${newUser.state} ${newUser.zipcode}`,
      newUser.country,
      newUser.mobile,
    ];
    await expect(checkout.deliveryAddress).toHaveText(address);
    await expect(checkout.billingAddress).toHaveText(address);

    // 3. Click 'Delete Account'
    const deleted = await checkout.header.deleteAccount();
    await expect(deleted.heading).toHaveText('Account Deleted!', { ignoreCase: true });
  });
});
