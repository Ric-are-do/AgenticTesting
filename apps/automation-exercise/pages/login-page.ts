import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { SignupPage } from './signup-page';
import { HomePage } from './home-page';

/** /login: the login form and the "New User Signup!" form. */
export class LoginPage extends SitePage {
  protected readonly path = '/login';
  readonly loginHeading: Locator;
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;
  readonly signupHeading: Locator;
  readonly signupName: Locator;
  readonly signupEmail: Locator;
  readonly signupButton: Locator;
  readonly signupError: Locator;
  /** The next step's heading; must not appear when signup is refused. */
  readonly accountInformationHeading: Locator;
  /** Django's debug error page heading, e.g. "KeyError at /logout". */
  readonly serverErrorPage: Locator;

  constructor(page: Page) {
    super(page);
    this.loginHeading = page.getByRole('heading', { name: 'Login to your account' });
    this.loginEmail = page.getByTestId('login-email');
    this.loginPassword = page.getByTestId('login-password');
    this.loginButton = page.getByTestId('login-button');
    this.loginError = page.getByText('Your email or password is incorrect!');
    this.signupHeading = page.getByRole('heading', { name: 'New User Signup!' });
    this.signupName = page.getByTestId('signup-name');
    this.signupEmail = page.getByTestId('signup-email');
    this.signupButton = page.getByTestId('signup-button');
    this.signupError = page.getByText('Email Address already exist!');
    this.accountInformationHeading = page.getByRole('heading', { name: 'Enter Account Information' });
    this.serverErrorPage = page.getByRole('heading', { name: /Error at \// });
  }

  protected async waitForContent(): Promise<void> {
    await expect(this.loginHeading).toBeVisible();
  }

  /** Opens /logout by URL (normally reached from the menu). Returns the HTTP status. */
  async openLogoutUrl(): Promise<number | undefined> {
    const response = await this.page.goto('/logout', { waitUntil: 'domcontentloaded' });
    return response?.status();
  }

  /** Fills and submits the login form; stays here when the login fails. */
  async submitLogin(email: string, password: string): Promise<void> {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }

  async login(email: string, password: string): Promise<HomePage> {
    await this.submitLogin(email, password);
    const home = new HomePage(this.page);
    await home.waitUntilLoaded();
    return home;
  }

  /** Fills and submits the signup form; stays here when the email is taken. */
  async submitSignup(name: string, email: string): Promise<void> {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
  }

  async startSignup(name: string, email: string): Promise<SignupPage> {
    await this.submitSignup(name, email);
    const signup = new SignupPage(this.page);
    await signup.waitUntilLoaded();
    return signup;
  }
}
