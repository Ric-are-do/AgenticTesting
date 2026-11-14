// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Categories', () => {
  // BUG B1: every real category tile reads "0 items"; only "Other" has items.
  test.fail('Category tiles should not all be empty (B1)', async ({ homePage }) => {
    // 1. Go to /.
    await homePage.goto();
    // 2. The Burgers tile should show a non-zero count (currently "0 items").
    await expect(homePage.categoryCount('Burgers')).not.toHaveText(/^0 items$/);
  });
});
