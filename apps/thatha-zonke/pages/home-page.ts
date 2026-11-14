import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';

/** The landing page: search, category tiles, specials, restaurant lists. */
export class HomePage extends SitePage {
  protected readonly path = '/';
  readonly searchInput: Locator;
  readonly areaSelect: Locator;
  readonly findFood: Locator;
  /** The "What are you craving?" category tiles. */
  readonly categoryTiles: Locator;
  /** Restaurant cards in the "Popular Restaurants" region (links to /restaurant/<id>/). */
  readonly restaurantLinks: Locator;
  readonly loginLink: Locator;
  readonly signupLink: Locator;
  readonly cartLink: Locator;
  // Main regions, used for aria snapshots. Stable, non-time-sensitive areas
  // only (the restaurant lists and specials carousel are data/time driven).
  readonly header: Locator;
  readonly heroSearch: Locator;
  readonly howItWorks: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.getByRole('banner');
    this.heroSearch = page.locator('form[method="get"]');
    this.howItWorks = page.getByRole('region', { name: /How Thatha Zonke works/i });
    this.footer = page.getByRole('contentinfo');
    this.searchInput = page.getByRole('textbox', { name: /Search restaurants or food/i });
    this.areaSelect = page.locator('select').first();
    this.findFood = page.getByRole('button', { name: 'Find Food' });
    this.categoryTiles = page.locator('a[href*="food_type="]');
    this.restaurantLinks = page.locator('a[href^="/restaurant/"]');
    this.loginLink = page.getByRole('link', { name: /Login/ });
    this.signupLink = page.getByRole('link', { name: /^Sign Up$/ });
    this.cartLink = page.getByRole('link', { name: /Cart/ }).first();
  }

  async waitUntilLoaded() {
    await expect(this.page.getByRole('heading', { name: /Local Meals\./i })).toBeVisible();
  }

  /** The tile for one craving, e.g. "Kota" or "Other". */
  categoryTile(name: string): Locator {
    return this.page.locator(`a[href*="food_type=${name}"]`);
  }

  /** The "<n> items" count text shown inside a category tile. */
  categoryCount(name: string): Locator {
    return this.categoryTile(name).getByText(/\d+ items?/);
  }

  /** Search via the GET form, landing on /?search=... */
  async search(term: string) {
    await this.searchInput.fill(term);
    await this.findFood.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Every "Save R..." label in the specials carousel. */
  get specialSaveLabels(): Locator {
    return this.page.getByText(/^Save R/);
  }
}
