import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';

/** /test_cases: the site's published test cases. */
export class TestCasesPage extends SitePage {
  protected readonly path = '/test_cases';
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Test Cases', exact: true });
  }

  protected async waitForContent(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  testCase(title: string): Locator {
    return this.page.getByRole('link', { name: title });
  }
}
