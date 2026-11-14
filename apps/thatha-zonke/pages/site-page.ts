import { BasePage } from '@core/pages/base-page';

/**
 * Base for Thatha Zonke's pages. CDN scripts and the push service worker can
 * hold the "load" event, so navigate on domcontentloaded only and then wait
 * for the page's own elements in waitUntilLoaded().
 */
export abstract class SitePage extends BasePage {
  async goto(): Promise<this> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await this.waitUntilLoaded();
    return this;
  }

  /** Dismiss the push-notification banner if it is showing (best effort). */
  async dismissPushBanner(): Promise<void> {
    const notNow = this.page.getByRole('button', { name: /^Not now$/ });
    if (await notNow.isVisible().catch(() => false)) await notNow.click();
  }
}
