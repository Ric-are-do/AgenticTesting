// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Browsing', () => {
  test('Search narrows the products', async ({ shopPage }) => {
    // 1. Type "mouse" in the search.
    await shopPage.goto();
    await shopPage.searchFor('mouse');
    await expect(shopPage.productNames).toHaveText(['Wireless Mouse']);
    await expect(shopPage.resultCount).toHaveText('1 product');
  });
});
