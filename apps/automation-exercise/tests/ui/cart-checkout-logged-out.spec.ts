// spec: apps/automation-exercise/specs/cart.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Cart', () => {
  test('Checkout while logged out asks to register or log in', async ({ productDetailPage }) => {
    // 1. Add product 1 to the cart and open the cart
    await productDetailPage.open(1);
    const cart = await (await productDetailPage.addToCart()).viewCart();

    // 2. Click 'Proceed To Checkout'
    await cart.proceedToCheckoutLoggedOut();
    await expect(cart.checkoutModalMessage).toBeVisible();
    await expect(cart.page).toHaveURL(/\/view_cart$/);
  });
});
