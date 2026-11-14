// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Cart and checkout', () => {
  test('Negative quantity is refused (known bug)', async ({ shopPage }) => {
    // Known bug (seen 2026-11-13): a quantity of -1 is added as "Laptop Pro - $1200 x -1" with "Total: $-1200.00".
    // The test states the correct behaviour and is expected to fail until the
    // site is fixed; then Playwright reports it as an unexpected pass.
    test.fail(true, 'Known bug: a quantity of -1 is added as "Laptop Pro - $1200 x -1" with "Total: $-1200.00".');
    // 1. Set the Laptop Pro quantity to -1, Add to Cart, open the cart.
    await shopPage.goto();
    await shopPage.addToCart(1, -1);
    const cart = await shopPage.openCart();
    await expect(cart.emptyMessage).toBeVisible();
    await expect(cart.total).toHaveText('Total: $0.00');
  });
});
