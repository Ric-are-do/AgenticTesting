// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Specials', () => {
  // BUG B3: special cards show "Save R" with the amount missing.
  test.fail('Specials should show a savings amount (B3)', async ({ homePage }) => {
    // 1. Go to /.
    await homePage.goto();
    // 2. The first "Save R" label should include a number (currently blank).
    await expect(homePage.specialSaveLabels.first()).toHaveText(/Save R\s*\d/);
  });
});
