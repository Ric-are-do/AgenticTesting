// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Categories', () => {
  // BUG B2: the food_type query param is ignored; every category shows all restaurants.
  test.fail('Category filter should actually filter (B2)', async ({ homePage, page }) => {
    // 1. Count restaurants on the full home page.
    await homePage.goto();
    const all = await homePage.restaurantLinks.count();
    // 2. Count restaurants filtered to Pizza.
    await page.goto('/?food_type=Pizza', { waitUntil: 'domcontentloaded' });
    const pizza = await homePage.restaurantLinks.count();
    // 3. Filtering should reduce the list (currently equal).
    expect(pizza).toBeLessThan(all);
  });
});
