// spec: apps/automation-exercise/specs/products.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Products', () => {
  test('View Category Products', async ({ homePage }) => {
    // 1. Open the home page
    await homePage.goto();
    await expect(homePage.sidebar.categoryHeading).toBeVisible();
    await expect(homePage.sidebar.categories).toHaveText(['Women', 'Men', 'Kids']);

    // 2. Click 'Women', then 'Tops'
    const tops = await homePage.sidebar.openCategory('Women', 'Tops');
    await expect(tops.page).toHaveURL(/\/category_products\/2$/);
    await expect(tops.products.title).toHaveText('Women - Tops Products', { ignoreCase: true });

    // 3. Click 'Men', then 'Tshirts'
    const tshirts = await tops.sidebar.openCategory('Men', 'Tshirts');
    await expect(tshirts.page).toHaveURL(/\/category_products\/3$/);
    await expect(tshirts.products.title).toHaveText('Men - Tshirts Products', { ignoreCase: true });
  });
});
