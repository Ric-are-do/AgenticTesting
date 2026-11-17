// spec: apps/automation-exercise/specs/products.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Products', () => {
  test('Search Product', async ({ productsPage }) => {
    // 1. Open /products
    await productsPage.goto();
    await expect(productsPage.products.title).toHaveText('All Products', { ignoreCase: true });

    // 2. Type "Dress" in #search_product and click #submit_search
    await productsPage.search('Dress');
    await expect(productsPage.products.title).toHaveText('Searched Products', { ignoreCase: true });

    // 3. Read the result names
    await expect(productsPage.products.cards).toHaveCount(9);
    await expect(productsPage.products.names).toContainText(['Sleeveless Dress', 'Stylish Dress']);
  });
});
