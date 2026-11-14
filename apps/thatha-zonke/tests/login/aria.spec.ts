// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts
// Aria snapshots live in apps/thatha-zonke/tests/aria-snapshots/<page>/ (see
// snapshotPathTemplate in playwright.config.ts). Regenerate with --update-snapshots.

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Login page aria snapshots', () => {
  test('Login form', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.form).toMatchAriaSnapshot({ name: 'form.aria.yml' });
  });
});
