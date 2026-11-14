// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Browsing', () => {
  test('Sort by price low to high', async ({ shopPage }) => {
    // 1. Choose "Price: Low to High".
    await shopPage.goto();
    await shopPage.sortBy('Price: Low to High');
    await expect(shopPage.productNames.first()).toHaveText('Coca Cola 250ml');
    await expect(shopPage.productNames.nth(1)).toHaveText('Mango Drink');
    await expect(shopPage.productNames.nth(2)).toHaveText('Rosemary Oil');
  });
});
