import type { Locator, Page } from '@playwright/test';

export interface SignupData {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

/** Signup practice form. Inputs and buttons have only an id (no data-testid), so they use '#id'. */
export class SignupForm {
  readonly root: Locator;
  readonly name: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly confirm: Locator;
  readonly submitButton: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('signup-form');
    this.name = page.locator('#signup-name');
    this.email = page.locator('#signup-email');
    this.password = page.locator('#signup-password');
    this.confirm = page.locator('#signup-confirm');
    this.submitButton = page.locator('#signup-submit');
    this.error = page.getByTestId('signup-error');
  }

  /** Fills only the fields given, then submits. */
  async signUp(data: SignupData): Promise<void> {
    if (data.name) await this.name.fill(data.name);
    if (data.email) await this.email.fill(data.email);
    if (data.password) await this.password.fill(data.password);
    if (data.confirm) await this.confirm.fill(data.confirm);
    await this.submitButton.click();
  }
}
