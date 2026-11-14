// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Cart and checkout', () => {
  test('Empty cart cannot be bought', async ({ shopPage }) => {
    // 1. Open the cart with nothing added.
    await shopPage.goto();
    const cart = await shopPage.openCart();
    await expect(cart.emptyMessage).toBeVisible();
    await expect(cart.total).toHaveText('Total: $0.00');
    await expect(cart.proceedToBuyButton).toBeDisabled();
  });
});
