import type { Locator, Page } from '@playwright/test';

/** The deliberately broken UI section. */
export class UiIssues {
  readonly brokenButton: Locator;

  constructor(page: Page) {
    this.brokenButton = page.locator('#broken-button');
  }
}
