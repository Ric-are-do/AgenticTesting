import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { CartModal } from '../components/cart-modal';

/** /product_details/<id>. No data-qa on this page: ids and classes. */
export class ProductDetailPage extends SitePage {
  protected path = '/product_details/1';
  readonly information: Locator;
  readonly name: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly reviewTab: Locator;
  readonly reviewName: Locator;
  readonly reviewEmail: Locator;
  readonly reviewText: Locator;
  readonly reviewSubmit: Locator;
  readonly reviewSuccess: Locator;

  constructor(page: Page) {
    super(page);
    this.information = page.locator('.product-information');
    this.name = this.information.locator('h2');
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = this.information.getByRole('button', { name: 'Add to cart' });
    this.reviewTab = page.getByRole('link', { name: 'Write Your Review' });
    this.reviewName = page.locator('#name');
    this.reviewEmail = page.locator('#email');
    this.reviewText = page.locator('#review');
    this.reviewSubmit = page.locator('#button-review');
    this.reviewSuccess = page.getByText('Thank you for your review.');
  }

  protected async waitForContent(): Promise<void> {
    await expect(this.information).toBeVisible();
  }

  async open(productId: number): Promise<this> {
    this.path = `/product_details/${productId}`;
    return this.goto();
  }

  async addToCart(quantity?: number): Promise<CartModal> {
    if (quantity !== undefined) await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
    const modal = new CartModal(this.page);
    await modal.waitUntilOpen();
    return modal;
  }

  /**
   * For quantities the site should refuse: clicks Add to cart and waits up to
   * 5 s for the "Added!" modal, without failing when it never comes.
   */
  async tryAddToCart(quantity: number): Promise<void> {
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
    await new CartModal(this.page).message.waitFor({ timeout: 5_000 }).catch(() => undefined);
  }

  async writeReview(name: string, email: string, review: string): Promise<void> {
    await this.reviewName.fill(name);
    await this.reviewEmail.fill(email);
    await this.reviewText.fill(review);
    await this.reviewSubmit.click();
  }
}
