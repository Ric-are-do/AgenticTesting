// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Cart gate', () => {
  test('Cart redirects a logged-out user to login', async ({ page }) => {
    // 1. Navigate straight to the cart while logged out.
    await page.goto('/cart/', { waitUntil: 'domcontentloaded' });
    // 2. Redirected to a login page with a next back to the cart.
    //    (The redirect target is /accounts/login/?next=/cart/, unencoded.)
    await expect(page).toHaveURL(/\/accounts\/login\/\?next=\/cart\//);
  });
});
