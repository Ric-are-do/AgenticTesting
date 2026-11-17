// spec: apps/automation-exercise/specs/cart.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

const jeans = ['Soft Stretch Jeans', 'Regular Fit Straight Jeans', 'Grunt Blue Slim Fit Jeans'];

test.describe('Cart', () => {
  test('Search Products and Verify Cart After Login', async ({ productsPage, account }) => {
    test.slow(); // many page loads on a slow shared demo site
    // 1. Open /products and search for "Jeans"
    await productsPage.goto();
    await productsPage.search('Jeans');
    await expect(productsPage.products.title).toHaveText('Searched Products', { ignoreCase: true });
    await expect(productsPage.products.names).toHaveText(jeans);

    // 2. Add every result to the cart and open the cart
    await productsPage.products.addAllToCart();
    const cart = await productsPage.header.openCart();
    await expect(cart.itemNames).toHaveText(jeans);

    // 3. Log in with an existing account and open the cart again
    const login = await cart.header.openSignupLogin();
    const home = await login.login(account.email, account.password);
    const cartAfterLogin = await home.header.openCart();
    await expect(cartAfterLogin.itemNames).toHaveText(jeans);
  });
});
