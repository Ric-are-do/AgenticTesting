import { expect, type Download, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { HomePage } from './home-page';

/** /payment_done/<total>, shown after Pay and Confirm Order. */
export class OrderPlacedPage extends SitePage {
  protected readonly path = '/payment_done';
  readonly heading: Locator;
  readonly confirmation: Locator;
  readonly downloadInvoiceLink: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('order-placed');
    this.confirmation = page.getByText('Congratulations! Your order has been confirmed!');
    this.downloadInvoiceLink = page.getByRole('link', { name: 'Download Invoice' });
    this.continueButton = page.getByTestId('continue-button');
  }

  protected async waitForContent(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async downloadInvoice(): Promise<Download> {
    const [download] = await Promise.all([this.page.waitForEvent('download'), this.downloadInvoiceLink.click()]);
    return download;
  }

  async continue(): Promise<HomePage> {
    await this.continueButton.click();
    const home = new HomePage(this.page);
    await home.waitUntilLoaded();
    return home;
  }
}
