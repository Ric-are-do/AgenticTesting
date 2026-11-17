// spec: apps/automation-exercise/specs/products.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Products', () => {
  test('View & Cart Brand Products', async ({ productsPage }) => {
    // 1. Open /products
    await productsPage.goto();
    await expect(productsPage.sidebar.brandsHeading).toBeVisible();

    // 2. Click 'Polo'
    const polo = await productsPage.sidebar.openBrand('Polo');
    await expect(polo.products.title).toHaveText('Brand - Polo Products', { ignoreCase: true });
    await expect(polo.products.cards).toHaveCount(6);

    // 3. Click 'H&M'
    const hm = await polo.sidebar.openBrand('H&M');
    await expect(hm.products.title).toHaveText('Brand - H&M Products', { ignoreCase: true });
    await expect(hm.products.cards).toHaveCount(5);
  });
});
