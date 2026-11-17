import { test } from '@playwright/test';
import { BasePage } from '@core/pages/base-page';

/**
 * Base for Thatha Zonke's pages. CDN scripts and the push service worker can
 * hold the "load" event, so navigate on domcontentloaded only and then wait
 * for the page's own elements in waitUntilLoaded().
 */
export abstract class SitePage extends BasePage {
  async goto(): Promise<this> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await this.waitForWakeUp();
    await this.waitUntilLoaded();
    return this;
  }

  /**
   * The site runs on Render's free tier and sleeps when idle: the first visit
   * shows an "Application loading" interstitial for up to ~2 minutes. Reload
   * until it is gone, so the page's own waitUntilLoaded() sees the real app.
   */
  async waitForWakeUp(): Promise<void> {
    const loading = this.page.getByText(/Application loading|Service waking up/i);
    if (!(await loading.first().isVisible().catch(() => false))) return;
    test.setTimeout(test.info().timeout + 120_000); // let the wake-up not eat the test's own budget
    const deadline = Date.now() + 120_000;
    while (await loading.first().isVisible().catch(() => false)) {
      if (Date.now() > deadline) throw new Error('Render app did not wake up within 120 s');
      await this.page.waitForTimeout(3_000);
      await this.page.reload({ waitUntil: 'domcontentloaded' }).catch(() => undefined);
    }
  }

  /** Dismiss the push-notification banner if it is showing (best effort). */
  async dismissPushBanner(): Promise<void> {
    const notNow = this.page.getByRole('button', { name: /^Not now$/ });
    if (await notNow.isVisible().catch(() => false)) await notNow.click();
  }
}
