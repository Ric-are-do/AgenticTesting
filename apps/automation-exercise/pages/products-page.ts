import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { ProductList } from '../components/product-list';
import { Sidebar } from '../components/sidebar';

/**
 * /products, and the pages with the same layout reached from it: search
 * results, category pages and brand pages (their title says which).
 */
export class ProductsPage extends SitePage {
  protected readonly path = '/products';
  readonly products: ProductList;
  readonly sidebar: Sidebar;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.products = new ProductList(page);
    this.sidebar = new Sidebar(page);
    // No data-qa on the search box.
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
  }

  protected async waitForContent(): Promise<void> {
    await expect(this.products.title).toBeVisible();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await this.page.waitForURL(/[?&]search=/);
  }
}
