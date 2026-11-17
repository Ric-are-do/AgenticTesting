// spec: apps/automation-exercise/specs/products.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Products', () => {
  test('Search with no matches shows no products', async ({ productsPage }) => {
    // 1. Open /products, search for "zzzzqq"
    await productsPage.goto();
    await productsPage.search('zzzzqq');
    await expect(productsPage.products.title).toHaveText('Searched Products', { ignoreCase: true });
    await expect(productsPage.products.cards).toHaveCount(0);
  });
});
