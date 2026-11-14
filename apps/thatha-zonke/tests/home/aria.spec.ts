// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts
// Aria snapshots live in apps/thatha-zonke/tests/aria-snapshots/<page>/ (see
// snapshotPathTemplate in playwright.config.ts). Regenerate with --update-snapshots.

import { test, expect } from '@apps/thatha-zonke/fixtures';

// Stable, non-time-sensitive home regions only (the specials carousel and the
// restaurant lists are data/time driven and would flake).
test.describe('Home page aria snapshots', () => {
  test('Header / nav', async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.header).toMatchAriaSnapshot({ name: 'header.aria.yml' });
  });

  test('Hero search', async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.heroSearch).toMatchAriaSnapshot({ name: 'hero-search.aria.yml' });
  });

  test('How it works', async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.howItWorks).toMatchAriaSnapshot({ name: 'how-it-works.aria.yml' });
  });

  test('Footer', async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.footer).toMatchAriaSnapshot({ name: 'footer.aria.yml' });
  });
});
