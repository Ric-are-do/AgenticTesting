// THROWAWAY: fails on purpose to test the CI investigator. Delete before merging.
import { test, expect } from '@playwright/test';

test('tmp fails on purpose', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await expect(page).toHaveTitle('Nope');
});
