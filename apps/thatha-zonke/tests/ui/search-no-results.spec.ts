// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Search', () => {
  test('Search with no match shows an empty state', async ({ homePage, page }) => {
    // 1. Go to / and search a term that matches nothing.
    await homePage.goto();
    await homePage.search('zzzznomatchqa');
    // 2. Query is reflected in the URL.
    await expect(page).toHaveURL(/search=zzzznomatchqa/);
    // 3. No restaurant cards are shown.
    await expect(homePage.restaurantLinks).toHaveCount(0);
  });
});
