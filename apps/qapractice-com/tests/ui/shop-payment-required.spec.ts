// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { invalidCard, shippingAddress, validCard } from '@apps/qapractice-com/data/payment';

test.describe('Cart and checkout', () => {
  test('Empty payment details are refused', async ({ shopPage }) => {
    // 1. Reach the payment step and click Buy Now with the card fields empty.
    await shopPage.goto();
    await shopPage.addToCart(2);
    const checkout = await (await shopPage.openCart()).proceedToBuy();
    await checkout.saveAddress(shippingAddress);
    await checkout.buyNow();
    await expect(checkout.message('Please enter card number.')).toBeVisible();
    await expect(checkout.message('Please enter expiry date.')).toBeVisible();
    await expect(checkout.message('Please enter CVV.')).toBeVisible();
    await expect(checkout.orderSuccess).toBeHidden();
  });
});
