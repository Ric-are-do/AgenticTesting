import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { HomePage } from './home-page';

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Path of a file to attach. */
  file: string;
}

/** /contact_us "GET IN TOUCH". */
export class ContactPage extends SitePage {
  protected readonly path = '/contact_us';
  readonly heading: Locator;
  readonly name: Locator;
  readonly email: Locator;
  readonly subject: Locator;
  readonly message: Locator;
  readonly upload: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Get In Touch' });
    this.name = page.getByTestId('name');
    this.email = page.getByTestId('email');
    this.subject = page.getByTestId('subject');
    this.message = page.getByTestId('message');
    this.upload = page.locator('input[name="upload_file"]'); // no data-qa on the file input
    this.submitButton = page.getByTestId('submit-button');
    // The page has a second, hidden success box: stay inside the contact form.
    const form = page.locator('.contact-form');
    this.successMessage = form.getByText('Success! Your details have been submitted successfully.');
    this.homeButton = form.getByRole('link', { name: 'Home' });
  }

  protected async waitForContent(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  /** Fills the form, attaches the file, submits and presses OK on "Press OK to proceed!". */
  async send(details: ContactMessage): Promise<void> {
    await this.name.fill(details.name);
    await this.email.fill(details.email);
    await this.subject.fill(details.subject);
    await this.message.fill(details.message);
    await this.upload.setInputFiles(details.file);
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitButton.click();
  }

  async goHome(): Promise<HomePage> {
    await this.homeButton.click();
    const home = new HomePage(this.page);
    await home.waitUntilLoaded();
    return home;
  }
}
