// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Browsing', () => {
  test('Category filter shows only that category', async ({ shopPage }) => {
    // 1. Click the Fashion category.
    await shopPage.goto();
    await shopPage.filterCategory('Fashion');
    await expect(shopPage.productNames).toHaveText(['Gold Zipper Bag', 'Premium Ladies Purse', 'Ladies Shoes']);
    await expect(shopPage.resultCount).toHaveText('3 products in Fashion');
  });
});
