import type { Locator, Page } from '@playwright/test';
import type { ProductsPage } from '../pages/products-page';
import type { CartPage } from '../pages/cart-page';
import type { LoginPage } from '../pages/login-page';
import type { ContactPage } from '../pages/contact-page';
import type { TestCasesPage } from '../pages/test-cases-page';
import type { AccountDeletedPage } from '../pages/account-deleted-page';

/**
 * Top menu on every page. Pages are imported inside the methods: every page
 * extends SitePage, which holds this header, so a top-level import would be a
 * cycle.
 */
export class Header {
  readonly menu: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly testCasesLink: Locator;
  readonly contactUsLink: Locator;
  readonly loggedInAs: Locator;

  constructor(readonly page: Page) {
    // The menu has no data-qa; its links are found by role inside it.
    this.menu = page.locator('.shop-menu');
    this.productsLink = menuLink(this.menu, 'Products');
    this.cartLink = menuLink(this.menu, 'Cart');
    this.signupLoginLink = menuLink(this.menu, 'Signup / Login');
    this.logoutLink = menuLink(this.menu, 'Logout');
    this.deleteAccountLink = menuLink(this.menu, 'Delete Account');
    this.testCasesLink = menuLink(this.menu, 'Test Cases');
    this.contactUsLink = menuLink(this.menu, 'Contact us');
    this.loggedInAs = this.menu.getByText(/Logged in as/);
  }

  async openProducts(): Promise<ProductsPage> {
    await this.productsLink.click();
    const { ProductsPage } = await import('../pages/products-page');
    return loaded(new ProductsPage(this.page));
  }

  async openCart(): Promise<CartPage> {
    await this.cartLink.click();
    const { CartPage } = await import('../pages/cart-page');
    return loaded(new CartPage(this.page));
  }

  async openSignupLogin(): Promise<LoginPage> {
    await this.signupLoginLink.click();
    const { LoginPage } = await import('../pages/login-page');
    return loaded(new LoginPage(this.page));
  }

  async logout(): Promise<LoginPage> {
    await this.logoutLink.click();
    const { LoginPage } = await import('../pages/login-page');
    return loaded(new LoginPage(this.page));
  }

  async deleteAccount(): Promise<AccountDeletedPage> {
    await this.deleteAccountLink.click();
    const { AccountDeletedPage } = await import('../pages/account-deleted-page');
    return loaded(new AccountDeletedPage(this.page));
  }

  async openTestCases(): Promise<TestCasesPage> {
    await this.testCasesLink.click();
    const { TestCasesPage } = await import('../pages/test-cases-page');
    return loaded(new TestCasesPage(this.page));
  }

  async openContactUs(): Promise<ContactPage> {
    await this.contactUsLink.click();
    const { ContactPage } = await import('../pages/contact-page');
    return loaded(new ContactPage(this.page));
  }
}

/**
 * A menu link by its text. Each link starts with an icon-font glyph that is
 * part of its accessible name (" Home"), so the name is matched at the end.
 */
function menuLink(menu: Locator, text: string): Locator {
  return menu.getByRole('link', { name: new RegExp(`(^|\\s)${text}$`) });
}

async function loaded<T extends { waitUntilLoaded(): Promise<void> }>(target: T): Promise<T> {
  await target.waitUntilLoaded();
  return target;
}
