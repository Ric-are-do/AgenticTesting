import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';

/** /forget-password: email → security code → new password, all on one page. */
export class ForgotPasswordPage extends SitePage {
  protected readonly path = '/forget-password';
  readonly email: Locator;
  readonly continueButton: Locator;
  readonly code: Locator;
  readonly verifyButton: Locator;
  readonly currentPassword: Locator;
  readonly newPassword: Locator;
  readonly confirmPassword: Locator;
  readonly resetButton: Locator;
  /** The one error line, whichever step is shown. */
  readonly error: Locator;
  readonly success: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.getByTestId('forgot-email');
    this.continueButton = page.getByTestId('forgot-email-submit');
    this.code = page.getByTestId('forgot-code');
    this.verifyButton = page.getByTestId('forgot-code-submit');
    this.currentPassword = page.getByTestId('forgot-current-password');
    this.newPassword = page.getByTestId('forgot-new-password');
    this.confirmPassword = page.getByTestId('forgot-confirm-password');
    this.resetButton = page.getByTestId('forgot-submit');
    this.error = page.getByTestId('forgot-error');
    this.success = page.getByTestId('forgot-success');
  }

  async waitUntilLoaded() {
    await expect(this.continueButton).toBeVisible();
  }

  /** Step 1: enter the email (if given) and click Continue. */
  async requestReset(email?: string) {
    if (email !== undefined) await this.email.fill(email);
    await this.continueButton.click();
  }

  /** Step 2: enter the security code (if given) and click Verify Code. */
  async verifyCode(code?: string) {
    if (code !== undefined) await this.code.fill(code);
    await this.verifyButton.click();
  }

  /** Step 3: fill the three password fields (those given) and click Reset Password. */
  async resetPassword(current?: string, next?: string, confirm?: string) {
    if (current !== undefined) await this.currentPassword.fill(current);
    if (next !== undefined) await this.newPassword.fill(next);
    if (confirm !== undefined) await this.confirmPassword.fill(confirm);
    await this.resetButton.click();
  }

  /** Steps 1 and 2 with valid values, ending on the new-password step. */
  async reachResetStep(email: string, code: string) {
    await this.requestReset(email);
    await this.verifyCode(code);
    await this.resetButton.waitFor();
  }
}
