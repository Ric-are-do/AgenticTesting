import { test as base, expect } from '@core/fixtures';
import { HomePage } from './pages/home-page';
import { LoginPage } from './pages/login-page';
import { RestaurantPage } from './pages/restaurant-page';
import { SignupPage } from './pages/signup-page';
import { ForgotPasswordPage } from './pages/forgot-password-page';

type ThathaZonkeFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  restaurantPage: RestaurantPage;
  signupPage: SignupPage;
  forgotPasswordPage: ForgotPasswordPage;
};

/**
 * Ordering is login-gated, so there is no login setup project yet: these tests
 * cover the public surface. Page objects are created lazily; tests call goto().
 */
export const test = base.extend<ThathaZonkeFixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  restaurantPage: async ({ page }, use) => use(new RestaurantPage(page)),
  signupPage: async ({ page }, use) => use(new SignupPage(page)),
  forgotPasswordPage: async ({ page }, use) => use(new ForgotPasswordPage(page)),
});

export { expect };
