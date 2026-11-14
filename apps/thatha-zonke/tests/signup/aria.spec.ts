// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts
// Aria snapshots live in apps/thatha-zonke/tests/aria-snapshots/<page>/ (see
// snapshotPathTemplate in playwright.config.ts). Regenerate with --update-snapshots.

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Signup page aria snapshots', () => {
  test('Signup form', async ({ signupPage }) => {
    await signupPage.goto();
    await expect(signupPage.form).toMatchAriaSnapshot({ name: 'form.aria.yml' });
  });
});
