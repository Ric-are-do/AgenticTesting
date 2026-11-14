// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Browsing', () => {
  test('Search with no match shows an empty state', async ({ shopPage }) => {
    // 1. Type "zzzz" in the search.
    await shopPage.goto();
    await shopPage.searchFor('zzzz');
    await expect(shopPage.noResults).toHaveText('No products found for "zzzz".');
    await expect(shopPage.resultCount).toHaveText('0 products');
    await expect(shopPage.productNames).toHaveCount(0);
  });
});
