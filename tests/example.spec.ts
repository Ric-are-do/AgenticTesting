import { test, expect } from '@playwright/test';

const practiceUrl = 'https://practicetestautomation.com/practice/';
const exceptionsUrl = 'https://practicetestautomation.com/practice-test-exceptions/';

test('practice index lists the available exercises', async ({ page }) => {
  await page.goto(practiceUrl);

  await expect(page).toHaveTitle('Practice | Practice Test Automation');
  await expect(page.getByRole('heading', { name: 'Practice', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Test Login Page' })).toHaveAttribute(
    'href',
    'https://practicetestautomation.com/practice-test-login/',
  );
  await expect(page.getByRole('link', { name: 'Test Exceptions' })).toHaveAttribute('href', exceptionsUrl);
  await expect(page.getByRole('link', { name: 'Test Table' })).toHaveAttribute(
    'href',
    'https://practicetestautomation.com/practice-test-table/',
  );
});

test('practice index opens the exception exercise', async ({ page }) => {
  await page.goto(practiceUrl);

  await page.getByRole('link', { name: 'Test Exceptions' }).click();

  await expect(page).toHaveURL(exceptionsUrl);
  await expect(page.getByRole('heading', { name: 'Test Exceptions' })).toBeVisible();
});

test('exception page describes its supported scenarios', async ({ page }) => {
  await page.goto(exceptionsUrl);

  await expect(page.getByRole('heading', { name: 'Create list of your favorite foods' })).toBeVisible();
  for (const scenario of [
    'NoSuchElementException',
    'ElementNotInteractableException',
    'InvalidElementStateException',
    'StaleElementReferenceException',
    'TimeoutException',
  ]) {
    await expect(page.getByRole('heading', { name: new RegExp(scenario) })).toBeVisible();
  }
});

test('Edit enables the first food input', async ({ page }) => {
  await page.goto(exceptionsUrl);

  const firstFoodInput = page.locator('input').first();
  await expect(firstFoodInput).toBeDisabled();

  await page.getByRole('button', { name: 'Edit' }).click();

  await expect(firstFoodInput).toBeEnabled();
});

test('Add reveals the second food input after it loads', async ({ page }) => {
  await page.goto(exceptionsUrl);

  const foodInputs = page.locator('input');
  await expect(foodInputs).toHaveCount(1);

  await page.getByRole('button', { name: 'Add' }).click();

  await expect(foodInputs).toHaveCount(2, { timeout: 10_000 });
  await expect(foodInputs.nth(1)).toBeVisible();
});
