// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Restaurant detail', () => {
  test('A restaurant page shows its menu and Add to Cart', async ({ restaurantPage }) => {
    // 1. Open /restaurant/5/.
    await restaurantPage.open(5);
    // 2. Menu heading visible.
    await expect(restaurantPage.menuHeading).toBeVisible();
    // 3. At least one Add to Cart button.
    await expect(restaurantPage.addToCartButtons.first()).toBeVisible();
  });
});
