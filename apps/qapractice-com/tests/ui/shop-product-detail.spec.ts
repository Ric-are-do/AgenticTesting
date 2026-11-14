// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Browsing', () => {
  test('Product detail shows name and price', async ({ shopPage }) => {
    // 1. Click the first product (Laptop Pro).
    await shopPage.goto();
    await shopPage.openProduct(1);
    await expect(shopPage.detailName).toHaveText('Laptop Pro');
    await expect(shopPage.detailPrice).toHaveText('$1200');

    // 2. Click Back to products.
    await shopPage.backToProducts.click();
    await expect(shopPage.productNames).toHaveCount(8);
  });
});
