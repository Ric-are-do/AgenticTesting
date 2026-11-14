// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts
// Aria snapshots live in apps/thatha-zonke/tests/aria-snapshots/<page>/ (see
// snapshotPathTemplate in playwright.config.ts). Regenerate with --update-snapshots.

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Forgot password page aria snapshots', () => {
  test('Reset form', async ({ forgotPasswordPage }) => {
    await forgotPasswordPage.goto();
    await expect(forgotPasswordPage.form).toMatchAriaSnapshot({ name: 'form.aria.yml' });
  });
});
