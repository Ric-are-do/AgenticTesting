// spec: apps/automation-exercise/specs/cart.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Cart', () => {
  test('Add Products in Cart', async ({ productsPage }) => {
    // 1. Open /products, click 'Add to cart' on product 1
    await productsPage.goto();
    const modal = await productsPage.products.addToCart(1);
    await expect(modal.message).toBeVisible();

    // 2. Click 'Continue Shopping', click 'Add to cart' on product 2, click 'View Cart'
    await modal.continueShopping();
    const cart = await (await productsPage.products.addToCart(2)).viewCart();
    await expect(cart.page).toHaveURL(/\/view_cart$/);

    // 3. Read the cart rows
    await expect(cart.itemNames).toHaveText(['Blue Top', 'Men Tshirt']);
    await expect(cart.price(1)).toHaveText('Rs. 500');
    await expect(cart.quantity(1)).toHaveText('1');
    await expect(cart.total(1)).toHaveText('Rs. 500');
    await expect(cart.price(2)).toHaveText('Rs. 400');
    await expect(cart.quantity(2)).toHaveText('1');
    await expect(cart.total(2)).toHaveText('Rs. 400');
  });
});
