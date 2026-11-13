import type { Locator, Page } from '@playwright/test';

export type Category = 'all' | 'manual' | 'automation' | 'ai';

/** Search, category filters and paging over the items table (4 rows per page). */
export class FunctionalArea {
  readonly table: Locator;
  readonly rows: Locator;
  readonly pageIndicator: Locator;
  readonly search: Locator;
  readonly previousButton: Locator;
  readonly nextButton: Locator;

  constructor(private readonly page: Page) {
    this.table = page.getByTestId('items-table');
    this.rows = this.table.locator('tbody tr');
    this.pageIndicator = page.getByTestId('pagination').getByText(/^Page \d+ of \d+$/);
    this.search = page.locator('#search-input');
    this.previousButton = page.locator('#prev-page');
    this.nextButton = page.locator('#next-page');
  }

  /** A row by its item ID (data-testid row-<id>). */
  row(id: number): Locator {
    return this.page.getByTestId(`row-${id}`);
  }

  async searchFor(text: string): Promise<void> {
    await this.search.fill(text);
  }

  async filterBy(category: Category): Promise<void> {
    await this.page.locator(`#filter-${category}`).click();
  }

  async nextPage(): Promise<void> {
    await this.nextButton.click();
  }

  async previousPage(): Promise<void> {
    await this.previousButton.click();
  }
}
