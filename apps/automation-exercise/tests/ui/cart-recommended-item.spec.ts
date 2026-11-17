// spec: apps/automation-exercise/specs/cart.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Cart', () => {
  test('Add to cart from Recommended items', async ({ homePage }) => {
    // 1. Open the home page and scroll to the bottom
    await homePage.goto();
    await homePage.footer.scrollToBottom();
    await expect(homePage.recommendedHeading).toBeVisible();

    // 2. Click 'Add to cart' on the first visible recommended product, then 'View Cart'
    const { productName, modal } = await homePage.addFirstRecommendedToCart();
    const cart = await modal.viewCart();
    await expect(cart.itemNames).toHaveText([productName]);
  });
});
