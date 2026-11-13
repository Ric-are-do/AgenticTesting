import { test } from '@apps/qa-practice/fixtures';

test.describe('QA Practice seed', () => {
  test('seed', async ({ practicePage }) => {
    await practicePage.goto();
  });
});
