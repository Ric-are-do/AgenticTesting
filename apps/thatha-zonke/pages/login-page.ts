import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';

/** Customer login, /customer_login/ (also where /cart/ sends logged-out users). */
export class LoginPage extends SitePage {
  protected readonly path = '/customer_login/';
  readonly username: Locator;
  readonly password: Locator;
  readonly rememberMe: Locator;
  readonly signInButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly createAccountLink: Locator;
  /** The login form, used for the aria snapshot. */
  readonly form: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.getByRole('textbox', { name: /Username or Email/i });
    this.password = page.getByRole('textbox', { name: /^Password$/i });
    this.rememberMe = page.getByRole('checkbox', { name: /Keep me signed in/i });
    this.signInButton = page.getByRole('button', { name: /Sign In/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /Forgot password/i });
    this.createAccountLink = page.getByRole('link', { name: /Create your account/i });
    this.form = page.locator('form').first();
  }

  async waitUntilLoaded() {
    await expect(this.signInButton).toBeVisible();
  }

  /** Fills only the values given, then clicks Sign in. */
  async signIn(username?: string, password?: string) {
    if (username !== undefined) await this.username.fill(username);
    if (password !== undefined) await this.password.fill(password);
    await this.signInButton.click();
  }

  /** The "Invalid credentials." message after a failed login. */
  get errorMessage(): Locator {
    return this.page.getByText(/Invalid credentials/i);
  }
}
