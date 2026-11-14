import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';

/** /register. */
export class RegisterPage extends SitePage {
  protected readonly path = '/register';
  readonly email: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly registerButton: Locator;
  readonly error: Locator;
  readonly success: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.getByTestId('register-email');
    this.password = page.getByTestId('register-password');
    this.confirmPassword = page.getByTestId('register-confirm-password');
    this.registerButton = page.getByTestId('register-submit');
    this.error = page.getByTestId('register-error');
    this.success = page.getByTestId('register-success');
  }

  async waitUntilLoaded() {
    await expect(this.registerButton).toBeVisible();
  }

  /**
   * One line of the "Password must include:" checklist. The items have no
   * test id or role, so this is CSS plus text; a met rule has class
   * `text-success`, an unmet one `text-danger`.
   */
  passwordRule(text: string): Locator {
    return this.page.locator('.list-group-item', { hasText: text });
  }

  /** Fills only the values given, then clicks Register. */
  async register(email?: string, password?: string, confirm?: string) {
    if (email !== undefined) await this.email.fill(email);
    if (password !== undefined) await this.password.fill(password);
    if (confirm !== undefined) await this.confirmPassword.fill(confirm);
    await this.registerButton.click();
  }
}
