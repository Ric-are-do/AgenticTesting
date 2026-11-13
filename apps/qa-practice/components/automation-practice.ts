import type { Locator, Page } from '@playwright/test';

/** Counter, show/hide toggle and the tools table. */
export class AutomationPractice {
  readonly counter: Locator;
  readonly incrementButton: Locator;
  readonly decrementButton: Locator;
  readonly resetButton: Locator;
  readonly toggleButton: Locator;
  readonly toggleContent: Locator;
  readonly toolsHeaders: Locator;
  readonly toolRows: Locator;

  constructor(private readonly page: Page) {
    this.counter = page.getByTestId('counter-value');
    this.incrementButton = page.locator('#counter-increment');
    this.decrementButton = page.locator('#counter-decrement');
    this.resetButton = page.locator('#counter-reset');
    this.toggleButton = page.locator('#toggle-button');
    this.toggleContent = page.getByTestId('toggle-content');
    const toolsTable = page.getByTestId('automation-table');
    this.toolsHeaders = toolsTable.locator('thead th');
    this.toolRows = toolsTable.locator('tbody tr');
  }

  async increment(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) await this.incrementButton.click();
  }

  async decrement(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) await this.decrementButton.click();
  }

  async reset(): Promise<void> {
    await this.resetButton.click();
  }

  async toggle(): Promise<void> {
    await this.toggleButton.click();
  }
}
