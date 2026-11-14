import { test } from '@apps/thatha-zonke/fixtures';

test.describe('Thatha Zonke seed', () => {
  test('seed', async ({ homePage }) => {
    await homePage.goto();
  });
});
