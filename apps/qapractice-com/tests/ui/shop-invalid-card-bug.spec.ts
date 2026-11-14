// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { invalidCard, shippingAddress, validCard } from '@apps/qapractice-com/data/payment';

test.describe('Cart and checkout', () => {
  test('Invalid card is refused (known bug)', async ({ shopPage }) => {
    // Known bug (seen 2026-11-13): card 1234, expiry 13/99 and CVV 1 still give "Order Successful!".
    // The test states the correct behaviour and is expected to fail until the
    // site is fixed; then Playwright reports it as an unexpected pass.
    test.fail(true, 'Known bug: card 1234, expiry 13/99 and CVV 1 still give "Order Successful!".');
    // 1. Reach the payment step, enter card 1234, expiry 13/99, CVV 1, click Buy Now.
    await shopPage.goto();
    await shopPage.addToCart(2);
    const checkout = await (await shopPage.openCart()).proceedToBuy();
    await checkout.saveAddress(shippingAddress);
    await checkout.buyNow(invalidCard);
    await expect(checkout.cardNumber).toBeVisible();
    await expect(checkout.orderSuccess).toBeHidden();
  });
});
