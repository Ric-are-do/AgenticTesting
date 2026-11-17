// spec: apps/automation-exercise/specs/products.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Products', () => {
  test('Add review on product', async ({ productsPage }) => {
    // 1. Open /products and click 'View Product' of the first product
    await productsPage.goto();
    const detail = await productsPage.products.viewProduct(1);
    await expect(detail.reviewTab).toBeVisible();

    // 2. Enter name, email and review text, click #button-review
    await detail.writeReview('QA Reviewer', 'qa.reviewer@example.com', 'Automated test review, please ignore.');
    await expect(detail.reviewSuccess).toBeVisible();
  });
});
