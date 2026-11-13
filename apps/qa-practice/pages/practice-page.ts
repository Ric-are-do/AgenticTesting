import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { BasePage } from '@framework/pages/base-page';
import { LoginForm } from '../components/login-form';
import { SignupForm } from '../components/signup-form';
import { ContactForm } from '../components/contact-form';
import { FormElements } from '../components/form-elements';
import { FunctionalArea } from '../components/functional-area';
import { AutomationPractice } from '../components/automation-practice';
import { UiIssues } from '../components/ui-issues';

/**
 * /qa-practice: every exercise lives on this one page, one component per section.
 * The forms answer with alert() dialogs; this page accepts each one and keeps its
 * message in `dialogs`, so specs can assert on them.
 */
export class PracticePage extends BasePage {
  protected readonly path = '/qa-practice';
  readonly heading: Locator;
  readonly loginForm: LoginForm;
  readonly signupForm: SignupForm;
  readonly contactForm: ContactForm;
  readonly formElements: FormElements;
  readonly functional: FunctionalArea;
  readonly automation: AutomationPractice;
  readonly uiIssues: UiIssues;
  /** Messages of every alert() shown since the page object was created. */
  readonly dialogs: string[] = [];

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'QA Practice Website for Manual & Automation Testing' });
    this.loginForm = new LoginForm(page);
    this.signupForm = new SignupForm(page);
    this.contactForm = new ContactForm(page);
    this.formElements = new FormElements(page);
    this.functional = new FunctionalArea(page);
    this.automation = new AutomationPractice(page);
    this.uiIssues = new UiIssues(page);
    page.on('dialog', async (dialog) => {
      this.dialogs.push(dialog.message());
      await dialog.accept();
    });
  }

  async waitUntilLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }
}
