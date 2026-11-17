// spec: apps/automation-exercise/specs/cart.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Cart', () => {
  test('Remove Products From Cart', async ({ productsPage }) => {
    // 1. Add products 1 and 2 to the cart and open the cart
    await productsPage.goto();
    await (await productsPage.products.addToCart(1)).continueShopping();
    const cart = await (await productsPage.products.addToCart(2)).viewCart();
    await expect(cart.itemNames).toHaveText(['Blue Top', 'Men Tshirt']);

    // 2. Click the X (.cart_quantity_delete) of Blue Top
    await cart.remove(1);
    await expect(cart.row(1)).toBeHidden();
    await expect(cart.itemNames).toHaveText(['Men Tshirt']);
  });
});
