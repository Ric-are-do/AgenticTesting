import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { ProductList } from '../components/product-list';
import { Sidebar } from '../components/sidebar';
import { CartModal } from '../components/cart-modal';

export class HomePage extends SitePage {
  protected readonly path = '/';
  readonly hero: Locator;
  readonly products: ProductList;
  readonly sidebar: Sidebar;
  readonly recommendedHeading: Locator;
  private readonly recommended: Locator;

  constructor(page: Page) {
    super(page);
    // The slider repeats this heading on each slide; only the shown one counts.
    this.hero = page
      .getByRole('heading', { name: 'Full-Fledged practice website for Automation Engineers' })
      .filter({ visible: true })
      .first();
    this.products = new ProductList(page);
    this.sidebar = new Sidebar(page);
    this.recommendedHeading = page.getByRole('heading', { name: 'Recommended items' });
    this.recommended = page.locator('.recommended_items'); // no data-qa on the carousel
  }

  protected async waitForContent(): Promise<void> {
    await expect(this.hero).toBeVisible();
  }

  /**
   * Adds the first product on the recommended slide that is showing. The
   * carousel turns by itself, so the product is picked by id, not position.
   */
  async addFirstRecommendedToCart(): Promise<{ productName: string; modal: CartModal }> {
    await this.recommendedHeading.scrollIntoViewIfNeeded();
    const card = this.recommended.locator('.item.active .productinfo').first();
    const productId = await card.locator('a.add-to-cart').getAttribute('data-product-id');
    const productName = await card.locator('p').innerText();
    await this.recommended
      .locator(`a.add-to-cart[data-product-id="${productId}"]`)
      .filter({ visible: true })
      .first()
      .click();
    const modal = new CartModal(this.page);
    await modal.waitUntilOpen();
    return { productName, modal };
  }
}
