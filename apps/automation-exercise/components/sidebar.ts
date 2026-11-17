import type { Locator, Page } from '@playwright/test';
import { ProductsPage } from '../pages/products-page';

export type Category = 'Women' | 'Men' | 'Kids';

/** CATEGORY accordion and BRANDS list on the left. No data-qa in the sidebar. */
export class Sidebar {
  readonly root: Locator;
  readonly categoryHeading: Locator;
  readonly categories: Locator;
  readonly brandsHeading: Locator;

  constructor(readonly page: Page) {
    this.root = page.locator('.left-sidebar');
    this.categoryHeading = this.root.getByRole('heading', { name: 'Category' });
    this.categories = this.root.locator('#accordian .panel-title');
    this.brandsHeading = this.root.getByRole('heading', { name: 'Brands' });
  }

  /** Opens a category panel (e.g. Women) and clicks one of its links (e.g. Tops). */
  async openCategory(category: Category, subCategory: string): Promise<ProductsPage> {
    // The name starts with an icon glyph (" Women"); "Men" must not match "Women".
    await this.root
      .locator('#accordian')
      .getByRole('link', { name: new RegExp(`(^|\\s)${category}$`) })
      .click();
    // Each panel body has the category as its id: #Women, #Men, #Kids.
    await this.root.locator(`#${category}`).getByRole('link', { name: subCategory, exact: true }).click();
    return loadedList(this.page);
  }

  async openBrand(brand: string): Promise<ProductsPage> {
    // Link text is "(count)Name"; the href is the stable part.
    await this.root.locator(`.brands-name a[href="/brand_products/${brand}"]`).click();
    return loadedList(this.page);
  }
}

async function loadedList(page: Page): Promise<ProductsPage> {
  const list = new ProductsPage(page);
  await list.waitUntilLoaded();
  return list;
}
