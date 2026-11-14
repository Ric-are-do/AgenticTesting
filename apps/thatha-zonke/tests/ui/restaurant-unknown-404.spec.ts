// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Restaurant detail', () => {
  test('Unknown restaurant id returns 404', async ({ page }) => {
    // 1. Navigate to a restaurant id that does not exist.
    const response = await page.goto('/restaurant/999/', { waitUntil: 'domcontentloaded' });
    // 2. Server responds 404.
    expect(response?.status()).toBe(404);
  });
});
