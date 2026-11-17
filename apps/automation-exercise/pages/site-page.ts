import type { Page } from '@playwright/test';
import { BasePage } from '@core/pages/base-page';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

/**
 * Every page of the site: the shared header and footer. A page counts as
 * loaded when its own content shows AND the load event has fired: buttons
 * such as "Proceed To Checkout" or "Add to cart" are jQuery handlers that do
 * nothing before then. Ads are blocked by the fixtures, so "load" is quick.
 */
export abstract class SitePage extends BasePage {
  readonly header: Header;
  readonly footer: Footer;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.footer = new Footer(page);
  }

  /** The page's own sign that it is showing (a heading, a form). */
  protected abstract waitForContent(): Promise<void>;

  async waitUntilLoaded(): Promise<void> {
    try {
      await this.waitForContent();
    } catch (error) {
      // The shared demo server sometimes turns visitors away; say so instead of
      // reporting a missing element.
      const overloaded = this.page.getByRole('heading', { name: /under heavy load/i });
      if (await overloaded.isVisible()) {
        throw new Error('automationexercise.com is overloaded ("under heavy load (queue full)"): not a test failure, re-run later.');
      }
      throw error;
    }
    await this.page.waitForLoadState('load');
  }

  async goto(): Promise<this> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await this.waitUntilLoaded();
    return this;
  }
}
