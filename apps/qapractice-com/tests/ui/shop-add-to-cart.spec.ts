// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Cart and checkout', () => {
  test('Added products and quantities show in the cart', async ({ shopPage }) => {
    // 1. Add 2 × Wireless Mouse and 1 × Keyboard RGB.
    await shopPage.goto();
    await shopPage.addToCart(2, 2);
    await shopPage.addToCart(3);
    await expect(shopPage.cartButton).toHaveText('3');

    // 2. Open the cart.
    const cart = await shopPage.openCart();
    await expect(cart.item('Wireless Mouse - $25 x 2')).toBeVisible();
    await expect(cart.item('Keyboard RGB - $80 x 1')).toBeVisible();
    await expect(cart.total).toHaveText('Total: $130.00');
  });
});
