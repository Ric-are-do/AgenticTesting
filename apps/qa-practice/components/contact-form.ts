import type { Locator, Page } from '@playwright/test';

/**
 * The "Missing Validations" contact form on the practice page. Not the home
 * page's contact form, which posts to a real form service and is never tested.
 */
export class ContactForm {
  readonly root: Locator;
  readonly name: Locator;
  readonly email: Locator;
  readonly message: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('contact-form');
    this.name = page.locator('#contact-name');
    this.email = page.locator('#contact-email');
    this.message = page.locator('#contact-message');
    this.submitButton = page.locator('#contact-submit');
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
