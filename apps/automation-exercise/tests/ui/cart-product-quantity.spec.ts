// spec: apps/automation-exercise/specs/cart.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Cart', () => {
  test('Verify Product quantity in Cart', async ({ homePage }) => {
    // 1. Open the home page and click 'View Product' on product 1
    await homePage.goto();
    const detail = await homePage.products.viewProduct(1);
    await expect(detail.name).toHaveText('Blue Top');

    // 2. Set quantity to 4, click 'Add to cart', click 'View Cart'
    const cart = await (await detail.addToCart(4)).viewCart();
    await expect(cart.quantity(1)).toHaveText('4');
    await expect(cart.total(1)).toHaveText('Rs. 2000');
  });
});
