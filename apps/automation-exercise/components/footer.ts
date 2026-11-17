import type { Locator, Page } from '@playwright/test';

/** Footer subscription box and the scroll-up arrow, on every page. No data-qa here. */
export class Footer {
  readonly subscriptionHeading: Locator;
  readonly emailInput: Locator;
  readonly subscribeButton: Locator;
  readonly successMessage: Locator;
  readonly scrollUpArrow: Locator;

  constructor(readonly page: Page) {
    this.subscriptionHeading = page.getByRole('heading', { name: 'Subscription' });
    this.emailInput = page.locator('#susbscribe_email'); // the site's own spelling
    this.subscribeButton = page.locator('#subscribe');
    this.successMessage = page.getByText('You have been successfully subscribed!');
    this.scrollUpArrow = page.locator('#scrollUp');
  }

  async subscribe(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.subscribeButton.click();
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollUpWithArrow(): Promise<void> {
    await this.scrollUpArrow.click();
  }

  /** Current vertical scroll position in pixels (0 = top). */
  async scrollY(): Promise<number> {
    return this.page.evaluate(() => window.scrollY);
  }
}
