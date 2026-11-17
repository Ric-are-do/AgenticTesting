import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { HomePage } from './home-page';

/** /account_created, shown after Create Account. */
export class AccountCreatedPage extends SitePage {
  protected readonly path = '/account_created';
  readonly heading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('account-created');
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
