import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';

/** A restaurant detail page, /restaurant/<id>/. */
export class RestaurantPage extends SitePage {
  protected readonly path = '/restaurant/5/';
  readonly menuHeading: Locator;
  readonly addToCartButtons: Locator;
  readonly cartLink: Locator;
  // Main regions for aria snapshots.
  readonly nav: Locator;
  readonly menuFilter: Locator;

  constructor(page: Page) {
    super(page);
    this.menuHeading = page.getByRole('heading', { name: /^Menu/ });
    this.addToCartButtons = page.getByRole('button', { name: /Add to Cart/i });
    this.cartLink = page.getByRole('link', { name: /Cart/ }).first();
    this.nav = page.getByRole('navigation');
    this.menuFilter = page.getByRole('tablist', { name: /Filter by food type/i });
  }

  async waitUntilLoaded() {
    await expect(this.menuHeading).toBeVisible();
  }

  /** Open a specific restaurant by id instead of the default path. */
  async open(id: number) {
    await this.page.goto(`/restaurant/${id}/`, { waitUntil: 'domcontentloaded' });
    await this.waitUntilLoaded();
  }
}
