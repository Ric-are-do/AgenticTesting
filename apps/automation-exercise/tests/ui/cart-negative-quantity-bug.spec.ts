// spec: apps/automation-exercise/specs/cart.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Cart', () => {
  test('Quantity 0 or below is not added to the cart', async ({ productDetailPage, cartPage }) => {
    // Known bug (seen 2026-11-17): quantity -1 is added; the row shows -1 and Rs. -500.
    // Remove test.fail() once fixed.
    test.fail(true, 'Known bug: a quantity of -1 is added to the cart with a negative total');

    // 1. Open /product_details/1, set quantity to -1 and click 'Add to cart'
    await productDetailPage.open(1);
    await productDetailPage.tryAddToCart(-1);

    // 2. Open the cart
    await cartPage.goto();
    await expect(cartPage.invalidQuantities).toHaveCount(0);
    await expect(cartPage.negativeTotals).toHaveCount(0);
  });
});
