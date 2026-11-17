// spec: apps/automation-exercise/specs/products.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Products', () => {
  test('Verify All Products and product detail page', async ({ homePage }) => {
    // 1. Open the home page and click 'Products'
    await homePage.goto();
    const products = await homePage.header.openProducts();
    await expect(products.products.title).toHaveText('All Products', { ignoreCase: true });
    await expect(products.products.cards).toHaveCount(34);

    // 2. Click 'View Product' of the first product
    const detail = await products.products.viewProduct(1);
    await expect(detail.page).toHaveURL(/\/product_details\/1$/);

    // 3. Read the product information
    await expect(detail.name).toHaveText('Blue Top');
    for (const line of ['Category: Women > Tops', 'Rs. 500', 'Availability: In Stock', 'Condition: New', 'Brand: Polo']) {
      await expect(detail.information).toContainText(line);
    }
  });
});
