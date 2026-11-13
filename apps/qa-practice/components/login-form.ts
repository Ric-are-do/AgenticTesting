import type { Locator, Page } from '@playwright/test';

/** Login practice form. Inputs and buttons have only an id (no data-testid), so they use '#id'. */
export class LoginForm {
  readonly root: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly submitButton: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('login-form');
    this.email = page.locator('#login-email');
    this.password = page.locator('#login-password');
    this.submitButton = page.locator('#login-submit');
    this.error = page.getByTestId('login-error');
  }

  /** Fills only the fields given (empty string = leave it empty), then submits. */
  async login(email: string, password: string): Promise<void> {
    if (email) await this.email.fill(email);
    if (password) await this.password.fill(password);
    await this.submitButton.click();
  }
}
