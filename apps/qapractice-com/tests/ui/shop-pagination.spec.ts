// spec: apps/qapractice-com/specs/e-commerce.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Browsing', () => {
  test('Pagination moves through three pages', async ({ shopPage }) => {
    // 1. Open the shop.
    await shopPage.goto();
    await expect(shopPage.productNames).toHaveCount(8);
    await expect(shopPage.previousPage).toBeDisabled();

    // 2. Click page 2.
    await shopPage.goToPage(2);
    await expect(shopPage.productNames.first()).toHaveText('Beauty Product');
    await expect(shopPage.previousPage).toBeEnabled();

    // 3. Click page 3.
    await shopPage.goToPage(3);
    await expect(shopPage.productNames).toHaveCount(4);
    await expect(shopPage.nextPage).toBeDisabled();
  });
});
