import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';
import { CheckoutPage } from './checkout-page';
import { LoginPage } from './login-page';

/** /view_cart. No data-qa in the cart: the table's ids and classes. */
export class CartPage extends SitePage {
  protected readonly path = '/view_cart';
  readonly breadcrumb: Locator;
  readonly rows: Locator;
  readonly itemNames: Locator;
  /** Quantity cells showing 0 or a negative number. */
  readonly invalidQuantities: Locator;
  /** Total cells with a negative amount ("Rs. -500"). */
  readonly negativeTotals: Locator;
  readonly emptyMessage: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly checkoutModal: Locator;
  readonly checkoutModalMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumb = page.locator('.breadcrumb').getByText('Shopping Cart');
    this.rows = page.locator('#cart_info_table tbody tr');
    this.itemNames = this.rows.locator('.cart_description h4');
    this.invalidQuantities = this.rows.locator('.cart_quantity').filter({ hasText: /^\s*(0|-\d+)\s*$/ });
    this.negativeTotals = this.rows.locator('.cart_total').filter({ hasText: 'Rs. -' });
    this.emptyMessage = page.locator('#empty_cart');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout', { exact: true });
    this.checkoutModal = page.locator('#checkoutModal');
    this.checkoutModalMessage = this.checkoutModal.getByText('Register / Login account to proceed on checkout.');
  }

  protected async waitForContent(): Promise<void> {
    await expect(this.breadcrumb).toBeVisible();
  }

  row(productId: number): Locator {
    return this.page.locator(`#product-${productId}`);
  }

  price(productId: number): Locator {
    return this.row(productId).locator('.cart_price');
  }

  quantity(productId: number): Locator {
    return this.row(productId).locator('.cart_quantity');
  }

  total(productId: number): Locator {
    return this.row(productId).locator('.cart_total');
  }

  async remove(productId: number): Promise<void> {
    await this.row(productId).locator('.cart_quantity_delete').click();
  }

  /** Logged in: goes to /checkout. */
  async proceedToCheckout(): Promise<CheckoutPage> {
    await this.proceedToCheckoutButton.click();
    const checkout = new CheckoutPage(this.page);
    await checkout.waitUntilLoaded();
    return checkout;
  }

  /** Logged out: opens the "Register / Login" modal and stays on the cart. */
  async proceedToCheckoutLoggedOut(): Promise<void> {
    await this.proceedToCheckoutButton.click();
    await this.checkoutModalMessage.waitFor();
  }

  /** From the logged-out checkout modal to /login. */
  async registerOrLogin(): Promise<LoginPage> {
    await this.checkoutModal.getByRole('link', { name: 'Register / Login' }).click();
    const login = new LoginPage(this.page);
    await login.waitUntilLoaded();
    return login;
  }
}
