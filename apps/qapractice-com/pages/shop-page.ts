import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { CartPanel } from '../components/cart-panel';

/** /practice-ecommerece-website (the route really is misspelled). */
export class ShopPage extends SitePage {
  protected readonly path = '/practice-ecommerece-website';
  readonly search: Locator;
  readonly sort: Locator;
  /** "20 products", "1 product", "3 products in Fashion". */
  readonly resultCount: Locator;
  readonly noResults: Locator;
  /** Product names on the current page, in display order. */
  readonly productNames: Locator;
  readonly previousPage: Locator;
  readonly nextPage: Locator;
  /** Shows the number of items in the cart; empty when the cart is empty. */
  readonly cartButton: Locator;
  readonly detailName: Locator;
  readonly detailPrice: Locator;
  readonly backToProducts: Locator;
  readonly cart: CartPanel;
  /** Every alert() message seen, in order (they are accepted). */
  readonly dialogs: string[] = [];

  constructor(page: Page) {
    super(page);
    this.search = page.getByTestId('ecom-search');
    this.sort = page.getByTestId('ecom-sort');
    this.resultCount = page.getByTestId('ecom-result-count');
    this.noResults = page.getByTestId('ecom-no-results');
    this.productNames = page.getByTestId(/^view-product-\d+$/);
    this.previousPage = page.getByTestId('ecom-page-prev');
    this.nextPage = page.getByTestId('ecom-page-next');
    this.cartButton = page.getByTestId('ecom-cart-button');
    this.detailName = page.getByTestId('ecom-detail-name');
    this.detailPrice = page.getByTestId('ecom-detail-price');
    this.backToProducts = page.getByTestId('ecom-back-to-products');
    this.cart = new CartPanel(page);
    page.on('dialog', async (dialog) => {
      this.dialogs.push(dialog.message());
      await dialog.accept();
    });
  }

  async waitUntilLoaded() {
    await expect(this.page.getByTestId('product-card-1')).toBeVisible();
  }

  async searchFor(text: string) {
    await this.search.fill(text);
  }

  /** Category buttons: All, Electronics, Fashion, Beauty, Beverages. */
  async filterCategory(name: string) {
    await this.page.getByTestId(`ecom-category-${name.toLowerCase()}`).click();
  }

  /** Sort by the option's visible label, e.g. "Price: Low to High". */
  async sortBy(label: string) {
    await this.sort.selectOption({ label });
  }

  async goToPage(n: number) {
    await this.page.getByTestId(`ecom-page-${n}`).click();
  }

  /** Product ids are the numbers in the test ids (1 = Laptop Pro, 2 = Wireless Mouse, 3 = Keyboard RGB). */
  async openProduct(productId: number) {
    await this.page.getByTestId(`view-product-${productId}`).click();
  }

  quantity(productId: number): Locator {
    return this.page.getByTestId(`quantity-${productId}`);
  }

  /** Sets the quantity (if given) and clicks Add to Cart. */
  async addToCart(productId: number, quantity?: number) {
    if (quantity !== undefined) await this.quantity(productId).fill(String(quantity));
    await this.page.getByTestId(`add-to-cart-${productId}`).click();
  }

  async openCart(): Promise<CartPanel> {
    await this.cartButton.click();
    await this.cart.proceedToBuyButton.waitFor();
    return this.cart;
  }
}
