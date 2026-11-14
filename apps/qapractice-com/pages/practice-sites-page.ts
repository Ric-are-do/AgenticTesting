import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';

/** /practice-page-selection: one card per practice area. */
export class PracticeSitesPage extends SitePage {
  protected readonly path = '/practice-page-selection';
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Practice Sites' });
  }

  async waitUntilLoaded() {
    await expect(this.heading).toBeVisible();
  }
}
