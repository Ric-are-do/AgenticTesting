import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import type { FormDetails } from '../data/web-forms';

/** /practice-forms. */
export class WebFormsPage extends SitePage {
  protected readonly path = '/practice-forms';
  readonly country: Locator;
  readonly title: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly dateOfBirth: Locator;
  readonly dateOfJoining: Locator;
  readonly email: Locator;
  readonly phoneCode: Locator;
  readonly phoneNumber: Locator;
  readonly communicationEmail: Locator;
  readonly communicationPhone: Locator;
  readonly submitButton: Locator;
  readonly clearButton: Locator;
  readonly success: Locator;
  /**
   * The red messages under the fields. They have no test id or role, so this
   * is the CSS class the page uses for them.
   */
  readonly fieldErrors: Locator;

  constructor(page: Page) {
    super(page);
    this.country = page.getByTestId('forms-country');
    this.title = page.getByTestId('forms-title');
    this.firstName = page.getByTestId('forms-first-name');
    this.lastName = page.getByTestId('forms-last-name');
    this.dateOfBirth = page.getByTestId('forms-dob');
    this.dateOfJoining = page.getByTestId('forms-doj');
    this.email = page.getByTestId('forms-email');
    this.phoneCode = page.getByTestId('forms-phone-code');
    this.phoneNumber = page.getByTestId('forms-phone-number');
    this.communicationEmail = page.getByTestId('forms-comm-email');
    this.communicationPhone = page.getByTestId('forms-comm-phone');
    this.submitButton = page.getByTestId('forms-submit');
    this.clearButton = page.getByTestId('forms-clear');
    this.success = page.getByTestId('forms-success');
    this.fieldErrors = page.locator('.text-danger.form-text');
  }

  async waitUntilLoaded() {
    await expect(this.submitButton).toBeVisible();
  }

  /** Fills every field from `details` (empty strings are left empty). */
  async fill(details: FormDetails) {
    if (details.country) await this.country.selectOption({ label: details.country });
    if (details.title) await this.title.selectOption({ label: details.title });
    await this.firstName.fill(details.firstName);
    await this.lastName.fill(details.lastName);
    await this.dateOfBirth.fill(details.dateOfBirth);
    await this.dateOfJoining.fill(details.dateOfJoining);
    await this.email.fill(details.email);
    if (details.phoneCode) await this.phoneCode.selectOption(details.phoneCode);
    await this.phoneNumber.fill(details.phoneNumber);
    if (details.communication === 'email') await this.communicationEmail.check();
    if (details.communication === 'phone') await this.communicationPhone.check();
  }

  async submit() {
    await this.submitButton.click();
  }

  async clear() {
    await this.clearButton.click();
  }
}
