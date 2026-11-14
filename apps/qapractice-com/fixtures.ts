import { test as base, expect } from '@core/fixtures';
import { PracticeSitesPage } from './pages/practice-sites-page';
import { LoginPage } from './pages/login-page';
import { RegisterPage } from './pages/register-page';
import { ForgotPasswordPage } from './pages/forgot-password-page';
import { WebFormsPage } from './pages/web-forms-page';
import { ShopPage } from './pages/shop-page';
import { FlightBookingPage } from './pages/flight-booking-page';
import { UiElementsPage } from './pages/ui-elements-page';

type QapracticeComFixtures = {
  practiceSitesPage: PracticeSitesPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  forgotPasswordPage: ForgotPasswordPage;
  webFormsPage: WebFormsPage;
  shopPage: ShopPage;
  flightBookingPage: FlightBookingPage;
  uiElementsPage: UiElementsPage;
};

/**
 * The practice login is a page under test, not a gate (every page is public),
 * so there is no login setup project. Page objects are created lazily; tests
 * call goto() themselves.
 */
export const test = base.extend<QapracticeComFixtures>({
  practiceSitesPage: async ({ page }, use) => use(new PracticeSitesPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  forgotPasswordPage: async ({ page }, use) => use(new ForgotPasswordPage(page)),
  webFormsPage: async ({ page }, use) => use(new WebFormsPage(page)),
  shopPage: async ({ page }, use) => use(new ShopPage(page)),
  flightBookingPage: async ({ page }, use) => use(new FlightBookingPage(page)),
  uiElementsPage: async ({ page }, use) => use(new UiElementsPage(page)),
});

export { expect };
