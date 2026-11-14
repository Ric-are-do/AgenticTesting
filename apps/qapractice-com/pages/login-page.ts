import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { ForgotPasswordPage } from './forgot-password-page';
import { RegisterPage } from './register-page';

/** /practice-login-form. */
export class LoginPage extends SitePage {
  protected readonly path = '/practice-login-form';
  readonly email: Locator;
  readonly password: Locator;
  readonly rememberMe: Locator;
  readonly signInButton: Locator;
  readonly error: Locator;
  readonly success: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.getByTestId('login-email');
    this.password = page.getByTestId('login-password');
    this.rememberMe = page.getByTestId('login-remember');
    this.signInButton = page.getByTestId('login-submit');
    this.error = page.getByTestId('login-error');
    this.success = page.getByTestId('login-success');
    this.forgotPasswordLink = page.getByTestId('login-forgot-password');
    this.registerLink = page.getByTestId('login-register');
  }

  async waitUntilLoaded() {
    await expect(this.signInButton).toBeVisible();
  }

  /** Fills only the values given, then clicks Sign in. */
  async signIn(email?: string, password?: string) {
    if (email !== undefined) await this.email.fill(email);
    if (password !== undefined) await this.password.fill(password);
    await this.signInButton.click();
  }

  async openForgotPassword(): Promise<ForgotPasswordPage> {
    await this.forgotPasswordLink.click();
    const next = new ForgotPasswordPage(this.page);
    await next.waitUntilLoaded();
    return next;
  }

  async openRegister(): Promise<RegisterPage> {
    await this.registerLink.click();
    const next = new RegisterPage(this.page);
    await next.waitUntilLoaded();
    return next;
  }
}
