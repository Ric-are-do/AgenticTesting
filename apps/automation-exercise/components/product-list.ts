import type { Locator, Page } from '@playwright/test';
import { CartModal } from './cart-modal';
import { ProductDetailPage } from '../pages/product-detail-page';

/**
 * The product grid on the home, products, search, category and brand pages.
 * No data-qa on product cards: CSS by class and data-product-id.
 */
export class ProductList {
  readonly root: Locator;
  readonly title: Locator;
  readonly cards: Locator;
  readonly names: Locator;

  constructor(readonly page: Page) {
    this.root = page.locator('.features_items');
    this.title = this.root.locator('h2.title');
    this.cards = this.root.locator('.product-image-wrapper');
    this.names = this.root.locator('.productinfo p');
  }

  /** The card's own button (each card repeats it in a hover overlay). */
  private addButton(productId: number): Locator {
    return this.root.locator(`.productinfo a.add-to-cart[data-product-id="${productId}"]`);
  }

  async addToCart(productId: number): Promise<CartModal> {
    await this.addButton(productId).click();
    const modal = new CartModal(this.page);
    await modal.waitUntilOpen();
    return modal;
  }

  /** Adds every product shown, closing the modal after each. Returns their names. */
  async addAllToCart(): Promise<string[]> {
    const names = await this.names.allInnerTexts();
    const buttons = this.root.locator('.productinfo a.add-to-cart');
    for (let i = 0; i < names.length; i++) {
      await buttons.nth(i).click();
      const modal = new CartModal(this.page);
      await modal.waitUntilOpen();
      await modal.continueShopping();
    }
    return names;
  }

  async viewProduct(productId: number): Promise<ProductDetailPage> {
    await this.root.locator(`a[href="/product_details/${productId}"]`).click();
    const detail = new ProductDetailPage(this.page);
    await detail.waitUntilLoaded();
    return detail;
  }
}
