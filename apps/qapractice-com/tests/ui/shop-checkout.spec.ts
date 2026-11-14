// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { invalidCard, shippingAddress, validCard } from '@apps/qapractice-com/data/payment';

test.describe('Cart and checkout', () => {
  test('Full checkout places the order', async ({ shopPage }) => {
    // 1. Add Wireless Mouse, open the cart, click Proceed to Buy.
    await shopPage.goto();
    await shopPage.addToCart(2);
    const checkout = await (await shopPage.openCart()).proceedToBuy();
    await expect(checkout.addressName).toBeVisible();

    // 2. Fill the shipping address, click Save Address.
    await checkout.saveAddress(shippingAddress);
    await expect(checkout.cardNumber).toBeVisible();

    // 3. Fill the valid card, click Buy Now.
    await checkout.buyNow(validCard);
    await expect(checkout.orderSuccess).toHaveText('Order Successful!');
    await expect(checkout.orderLine('Wireless Mouse - $25 x 1')).toBeVisible();
    await expect(shopPage.cartButton).toHaveText('');
  });
});
