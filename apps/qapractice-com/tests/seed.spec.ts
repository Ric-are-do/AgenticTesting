import { test } from '@apps/qapractice-com/fixtures';

test.describe('QA Practice seed', () => {
  test('seed', async ({ practiceSitesPage }) => {
    await practiceSitesPage.goto();
  });
});
