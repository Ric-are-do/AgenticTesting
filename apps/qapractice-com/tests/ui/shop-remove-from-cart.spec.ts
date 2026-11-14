// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Cart and checkout', () => {
  test('Removing an item updates the total', async ({ shopPage }) => {
    // 1. Add 2 × Wireless Mouse and 1 × Keyboard RGB, open the cart, remove the keyboard.
    await shopPage.goto();
    await shopPage.addToCart(2, 2);
    await shopPage.addToCart(3);
    const cart = await shopPage.openCart();
    await cart.remove(3);
    await expect(cart.items).toHaveCount(1);
    await expect(cart.total).toHaveText('Total: $50.00');
    await expect(shopPage.cartButton).toHaveText('2');
  });
});
