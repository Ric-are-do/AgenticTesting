import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { AccountCreatedPage } from './account-created-page';
import type { NewUser } from '../data/users';

/** /signup "ENTER ACCOUNT INFORMATION", reached from the signup form on /login. */
export class SignupPage extends SitePage {
  protected readonly path = '/signup';
  readonly heading: Locator;
  readonly titleMr: Locator;
  readonly titleMrs: Locator;
  readonly password: Locator;
  readonly days: Locator;
  readonly months: Locator;
  readonly years: Locator;
  readonly newsletter: Locator;
  readonly specialOffers: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly company: Locator;
  readonly address1: Locator;
  readonly address2: Locator;
  readonly country: Locator;
  readonly state: Locator;
  readonly city: Locator;
  readonly zipcode: Locator;
  readonly mobile: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Enter Account Information' });
    // The title radios and the two checkboxes have no data-qa.
    this.titleMr = page.locator('#id_gender1');
    this.titleMrs = page.locator('#id_gender2');
    this.password = page.getByTestId('password');
    this.days = page.getByTestId('days');
    this.months = page.getByTestId('months');
    this.years = page.getByTestId('years');
    this.newsletter = page.locator('#newsletter');
    this.specialOffers = page.locator('#optin');
    this.firstName = page.getByTestId('first_name');
    this.lastName = page.getByTestId('last_name');
    this.company = page.getByTestId('company');
    this.address1 = page.getByTestId('address');
    this.address2 = page.getByTestId('address2');
    this.country = page.getByTestId('country');
    this.state = page.getByTestId('state');
    this.city = page.getByTestId('city');
    this.zipcode = page.getByTestId('zipcode');
    this.mobile = page.getByTestId('mobile_number');
    this.createAccountButton = page.getByTestId('create-account');
  }

  protected async waitForContent(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  /** Fills every field, ticks both checkboxes and creates the account. */
  async createAccount(user: NewUser): Promise<AccountCreatedPage> {
    await (user.title === 'Mr' ? this.titleMr : this.titleMrs).check();
    await this.password.fill(user.password);
    await this.days.selectOption(user.birthDay);
    await this.months.selectOption(user.birthMonth);
    await this.years.selectOption(user.birthYear);
    await this.newsletter.check();
    await this.specialOffers.check();
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.company.fill(user.company);
    await this.address1.fill(user.address1);
    await this.address2.fill(user.address2);
    await this.country.selectOption(user.country);
    await this.state.fill(user.state);
    await this.city.fill(user.city);
    await this.zipcode.fill(user.zipcode);
    await this.mobile.fill(user.mobile);
    await this.createAccountButton.click();
    const created = new AccountCreatedPage(this.page);
    await created.waitUntilLoaded();
    return created;
  }
}
