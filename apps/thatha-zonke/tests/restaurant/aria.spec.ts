// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts
// Aria snapshots live in apps/thatha-zonke/tests/aria-snapshots/<page>/ (see
// snapshotPathTemplate in playwright.config.ts). Regenerate with --update-snapshots.

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Restaurant page aria snapshots', () => {
  test('Nav', async ({ restaurantPage }) => {
    await restaurantPage.open(5);
    await expect(restaurantPage.nav).toMatchAriaSnapshot({ name: 'nav.aria.yml' });
  });

  test('Menu filter', async ({ restaurantPage }) => {
    await restaurantPage.open(5);
    await expect(restaurantPage.menuFilter).toMatchAriaSnapshot({ name: 'menu-filter.aria.yml' });
  });
});
