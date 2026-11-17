import type { Locator, Page } from '@playwright/test';
import { CartPage } from '../pages/cart-page';

/** "Added!" modal shown after Add to cart. */
export class CartModal {
  readonly modal: Locator;
  readonly message: Locator;
  readonly viewCartLink: Locator;
  readonly continueShoppingButton: Locator;

  constructor(readonly page: Page) {
    this.modal = page.locator('#cartModal'); // no data-qa on the modal
    this.message = this.modal.getByText('Your product has been added to cart.');
    this.viewCartLink = this.modal.getByRole('link', { name: 'View Cart' });
    this.continueShoppingButton = this.modal.getByRole('button', { name: 'Continue Shopping' });
  }

  async waitUntilOpen(): Promise<void> {
    await this.message.waitFor();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }

  async viewCart(): Promise<CartPage> {
    await this.viewCartLink.click();
    const cart = new CartPage(this.page);
    await cart.waitUntilLoaded();
    return cart;
  }
}
