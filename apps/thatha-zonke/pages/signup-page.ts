import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';

/** Customer signup, /signup/. (No landmarks on this page — just the form.) */
export class SignupPage extends SitePage {
  protected readonly path = '/signup/';
  readonly fullName: Locator;
  readonly phone: Locator;
  readonly email: Locator;
  readonly deliveryAddress: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly createAccountButton: Locator;
  /** The signup form, used for the aria snapshot. */
  readonly form: Locator;

  constructor(page: Page) {
    super(page);
    this.fullName = page.locator('input[name="full_name"]');
    this.phone = page.locator('input[name="phone_number"]');
    this.email = page.locator('input[name="email"]');
    this.deliveryAddress = page.locator('textarea[name="delivery_address"]');
    this.password = page.locator('input[name="password"]');
    this.confirmPassword = page.locator('input[name="confirm_password"]');
    this.createAccountButton = page.getByRole('button', { name: /Create Account/i });
    this.form = page.locator('form').first();
  }

  async waitUntilLoaded() {
    await expect(this.createAccountButton).toBeVisible();
  }
}
