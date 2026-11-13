import type { Page } from '@playwright/test';

export abstract class BasePage {
  protected abstract readonly path: string;

  constructor(readonly page: Page) {}

  abstract waitUntilLoaded(): Promise<void>;

  async goto(): Promise<this> {
    await this.page.goto(this.path);
    await this.waitUntilLoaded();
    return this;
  }
}
