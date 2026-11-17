import { test as base, expect } from '@core/fixtures';
import { AccountApi } from './api/account-api';
import { makeUser, type NewUser } from './data/users';
import { HomePage } from './pages/home-page';
import { ProductsPage } from './pages/products-page';
import { ProductDetailPage } from './pages/product-detail-page';
import { LoginPage } from './pages/login-page';
import { CartPage } from './pages/cart-page';
import { ContactPage } from './pages/contact-page';

/** Google ads, including full-page "vignette" ads that hijack navigation. */
const AD_HOSTS = /googlesyndication|doubleclick|googleads|adservice|fundingchoices|google-analytics|googletagmanager|adsbygoogle/;

type AutomationExerciseFixtures = {
  /** Aborts ad requests in every test. Runs automatically. */
  blockAds: void;
  /** Data for a new account (not created). Deleted after the test if a test created it. */
  newUser: NewUser;
  /** An account that already exists (created through the account API), deleted after the test. */
  account: NewUser;
  homePage: HomePage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  loginPage: LoginPage;
  cartPage: CartPage;
  contactPage: ContactPage;
};

/** Page objects are created lazily; tests call goto() themselves. */
export const test = base.extend<AutomationExerciseFixtures>({
  blockAds: [
    async ({ context }, use) => {
      await context.route(AD_HOSTS, (route) => route.abort());
      await use();
    },
    { auto: true },
  ],
  newUser: async ({ request }, use) => {
    const user = makeUser();
    await use(user);
    await new AccountApi(request).deleteIfExists(user);
  },
  account: async ({ newUser, request }, use) => {
    await new AccountApi(request).create(newUser);
    await use(newUser);
  },
  homePage: async ({ page }, use) => use(new HomePage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),
  productDetailPage: async ({ page }, use) => use(new ProductDetailPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  contactPage: async ({ page }, use) => use(new ContactPage(page)),
});

export { expect };
