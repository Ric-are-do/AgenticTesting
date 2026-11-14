// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Cart and checkout', () => {
  test('Empty address is refused', async ({ shopPage }) => {
    // 1. Add a product, Proceed to Buy, click Save Address with every field empty.
    await shopPage.goto();
    await shopPage.addToCart(2);
    const checkout = await (await shopPage.openCart()).proceedToBuy();
    await checkout.saveAddress();
    await expect.poll(() => shopPage.dialogs).toEqual(['Please fill in all address fields.']);
    await expect(checkout.cardNumber).toBeHidden();
  });
});
