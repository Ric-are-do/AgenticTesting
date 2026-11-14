import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';

/** Forgot password / account recovery, /password-reset/. */
export class ForgotPasswordPage extends SitePage {
  protected readonly path = '/password-reset/';
  readonly email: Locator;
  readonly submitButton: Locator;
  /** The reset form, used for the aria snapshot. */
  readonly form: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.locator('input[name="email"]');
    this.submitButton = page.locator('form button[type="submit"], form button').first();
    this.form = page.locator('form').first();
  }

  async waitUntilLoaded() {
    await expect(this.email).toBeVisible();
  }
}
