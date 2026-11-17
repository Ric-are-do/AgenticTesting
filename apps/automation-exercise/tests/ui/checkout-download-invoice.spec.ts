// spec: apps/automation-exercise/specs/checkout.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { readFile } from 'fs/promises';
import { test, expect } from '@apps/automation-exercise/fixtures';
import { validCard } from '@apps/automation-exercise/data/payment';

test.describe('Place order', () => {
  test('Download Invoice after purchase order', async ({ productsPage, newUser }) => {
    test.slow(); // many page loads on a slow shared demo site
    // 1. Add products 1 and 2 to the cart, proceed to checkout and register while checking out
    await productsPage.goto();
    await (await productsPage.products.addToCart(1)).continueShopping();
    const cart = await (await productsPage.products.addToCart(2)).viewCart();
    await cart.proceedToCheckoutLoggedOut();
    const signup = await (await cart.registerOrLogin()).startSignup(newUser.name, newUser.email);
    const home = await (await signup.createAccount(newUser)).continue();
    await expect(home.header.loggedInAs).toContainText(`Logged in as ${newUser.name}`);

    // 2. Open the cart, proceed to checkout, place the order and pay
    const checkout = await (await home.header.openCart()).proceedToCheckout();
    const placed = await (await checkout.placeOrder('Automated test order, please ignore.')).pay(validCard);
    await expect(placed.heading).toHaveText('Order Placed!', { ignoreCase: true });

    // 3. Click 'Download Invoice'
    const invoice = await placed.downloadInvoice();
    expect(invoice.suggestedFilename()).toBe('invoice.txt');
    const text = await readFile(await invoice.path(), 'utf8');
    // The site writes a fixed name ("Test User") into the invoice, not the signed-up name.
    expect(text).toContain('Hi Test User, Your total purchase amount is 900. Thank you');

    // 4. Click [data-qa=continue-button], then 'Delete Account'
    const afterOrder = await placed.continue();
    const deleted = await afterOrder.header.deleteAccount();
    await expect(deleted.heading).toHaveText('Account Deleted!', { ignoreCase: true });
  });
});
