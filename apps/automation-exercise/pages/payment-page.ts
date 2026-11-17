import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { OrderPlacedPage } from './order-placed-page';
import type { Card } from '../data/payment';

/** /payment. */
export class PaymentPage extends SitePage {
  protected readonly path = '/payment';
  readonly heading: Locator;
  readonly nameOnCard: Locator;
  readonly cardNumber: Locator;
  readonly cvc: Locator;
  readonly expiryMonth: Locator;
  readonly expiryYear: Locator;
  readonly payButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Payment' });
    this.nameOnCard = page.getByTestId('name-on-card');
    this.cardNumber = page.getByTestId('card-number');
    this.cvc = page.getByTestId('cvc');
    this.expiryMonth = page.getByTestId('expiry-month');
    this.expiryYear = page.getByTestId('expiry-year');
    this.payButton = page.getByTestId('pay-button');
  }

  protected async waitForContent(): Promise<void> {
    await expect(this.payButton).toBeVisible();
  }

  /** Fills the card (empty fields when no card) and presses Pay; does not wait for a result. */
  async submit(card?: Card): Promise<void> {
    if (card) {
      await this.nameOnCard.fill(card.nameOnCard);
      await this.cardNumber.fill(card.number);
      await this.cvc.fill(card.cvc);
      await this.expiryMonth.fill(card.expiryMonth);
      await this.expiryYear.fill(card.expiryYear);
    }
    await this.payButton.click();
  }

  /**
   * For cards the site should refuse: presses Pay and waits up to 10 s for
   * the order page, without failing when it never comes.
   */
  async tryPay(card: Card): Promise<void> {
    await this.submit(card);
    await this.page.waitForURL(/\/payment_done\//, { timeout: 10_000 }).catch(() => undefined);
  }

  async pay(card: Card): Promise<OrderPlacedPage> {
    await this.submit(card);
    const placed = new OrderPlacedPage(this.page);
    await placed.waitUntilLoaded();
    return placed;
  }
}
