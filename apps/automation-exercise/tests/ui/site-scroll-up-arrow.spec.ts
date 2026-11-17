// spec: apps/automation-exercise/specs/site.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Site pages', () => {
  test("Verify Scroll Up using 'Arrow' button and Scroll Down functionality", async ({ homePage }) => {
    // 1. Open the home page and scroll to the bottom
    await homePage.goto();
    await homePage.footer.scrollToBottom();
    await expect(homePage.footer.subscriptionHeading).toBeInViewport();

    // 2. Click the arrow (#scrollUp) at the bottom right
    await homePage.footer.scrollUpWithArrow();
    await expect.poll(() => homePage.footer.scrollY()).toBe(0);
    await expect(homePage.hero).toBeInViewport();
  });
});
