import { test as base, expect } from '@framework/fixtures/base';
import { PracticePage } from './pages/practice-page';

type QaPracticeFixtures = {
  practicePage: PracticePage;
};

/** qa-practice has no login, so tests only need the page object. */
export const test = base.extend<QaPracticeFixtures>({
  practicePage: async ({ page }, use) => {
    await use(new PracticePage(page));
  },
});

export { expect };
