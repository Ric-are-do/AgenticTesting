import { test } from '@apps/automation-exercise/fixtures';

test.describe('Automation Exercise seed', () => {
  test('seed', async ({ homePage }) => {
    await homePage.goto();
  });
});
