import { test } from '@playwright/test';

test.describe('Swag Labs seed', () => {
  test('seed', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });
});
