import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { PaymentPage } from './payment-page';

/** /checkout: addresses, order review, comment. The form parts have no data-qa. */
export class CheckoutPage extends SitePage {
  protected readonly path = '/checkout';
  readonly addressHeading: Locator;
  readonly reviewHeading: Locator;
  /** Address lines without the "Your delivery address" title. */
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly totalAmount: Locator;
  readonly comment: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addressHeading = page.getByRole('heading', { name: 'Address Details' });
    this.reviewHeading = page.getByRole('heading', { name: 'Review Your Order' });
    this.deliveryAddress = page.locator('#address_delivery li:not(.address_title)');
    this.billingAddress = page.locator('#address_invoice li:not(.address_title)');
    this.totalAmount = page.locator('#cart_info tr').filter({ hasText: 'Total Amount' }).locator('.cart_total_price');
    this.comment = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
  }

  protected async waitForContent(): Promise<void> {
    await expect(this.addressHeading).toBeVisible();
  }

  async placeOrder(comment: string): Promise<PaymentPage> {
    await this.comment.fill(comment);
    await this.placeOrderButton.click();
    const payment = new PaymentPage(this.page);
    await payment.waitUntilLoaded();
    return payment;
  }
}
