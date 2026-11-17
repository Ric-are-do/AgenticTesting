// spec: apps/automation-exercise/specs/site.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Site pages', () => {
  test("Verify Scroll Up without 'Arrow' button and Scroll Down functionality", async ({ homePage }) => {
    // 1. Open the home page and scroll to the bottom
    await homePage.goto();
    await homePage.footer.scrollToBottom();
    await expect(homePage.footer.subscriptionHeading).toBeInViewport();

    // 2. Scroll back to the top
    await homePage.footer.scrollToTop();
    await expect(homePage.hero).toBeInViewport();
  });
});
