import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { HomePage } from './home-page';

/** /delete_account, shown after Delete Account. */
export class AccountDeletedPage extends SitePage {
  protected readonly path = '/delete_account';
  readonly heading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('account-deleted');
    this.continueButton = page.getByTestId('continue-button');
  }

  protected async waitForContent(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async continue(): Promise<HomePage> {
    await this.continueButton.click();
    const home = new HomePage(this.page);
    await home.waitUntilLoaded();
    return home;
  }
}
