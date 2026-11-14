import type { Locator, Page } from '@playwright/test';
import { Checkout } from './checkout';

/** The off-canvas cart on the shop page (opened with the cart button). */
export class CartPanel {
  readonly proceedToBuyButton: Locator;
  readonly emptyMessage: Locator;
  /** "Total: $130.00". */
  readonly total: Locator;
  /**
   * One row per product ("Wireless Mouse - $25 x 2 Remove"). Rows have no
   * test id or role: CSS class of the row plus its remove-from-cart-<id> button.
   */
  readonly items: Locator;

  constructor(private readonly page: Page) {
    this.proceedToBuyButton = page.getByTestId('ecom-proceed-to-buy');
    this.emptyMessage = page.getByText('Your cart is empty.');
    this.total = page.getByText(/^Total: \$/);
    this.items = page.locator('div.d-flex.justify-content-between', { has: page.getByTestId(/^remove-from-cart-/) });
  }

  /** The row for one product, by its line text, e.g. "Wireless Mouse - $25 x 2". */
  item(text: string): Locator {
    return this.items.filter({ hasText: text });
  }

  async remove(productId: number) {
    await this.page.getByTestId(`remove-from-cart-${productId}`).click();
  }

  async proceedToBuy(): Promise<Checkout> {
    await this.proceedToBuyButton.click();
    const checkout = new Checkout(this.page);
    await checkout.addressName.waitFor();
    return checkout;
  }
}
