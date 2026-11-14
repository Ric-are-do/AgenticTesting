// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Home & navigation', () => {
  test('Home loads with its hero and restaurant list', async ({ homePage }) => {
    // 1. Go to /.
    await homePage.goto();
    // 2. Hero heading is visible.
    await expect(homePage.page.getByRole('heading', { name: /Local Meals\./i })).toBeVisible();
    // 3. At least one restaurant link is visible.
    await expect(homePage.restaurantLinks.first()).toBeVisible();
    expect(await homePage.restaurantLinks.count()).toBeGreaterThan(0);
  });
});
