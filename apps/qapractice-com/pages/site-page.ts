import { BasePage } from '@core/pages/base-page';

/**
 * Base for this site's pages. Ads on every page can hold the "load" event for
 * a long time, so navigation waits for the DOM only and then for the page's
 * own elements (waitUntilLoaded).
 */
export abstract class SitePage extends BasePage {
  async goto(): Promise<this> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await this.waitUntilLoaded();
    return this;
  }
}
