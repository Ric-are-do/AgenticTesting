import type { Locator, Page } from '@playwright/test';

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Card {
  number: string;
  expiry: string;
  cvv: string;
}

/** Address → payment → order confirmation on the shop page (no route change). */
export class Checkout {
  readonly addressName: Locator;
  readonly addressStreet: Locator;
  readonly addressCity: Locator;
  readonly addressState: Locator;
  readonly addressZip: Locator;
  readonly saveAddressButton: Locator;
  readonly cardNumber: Locator;
  readonly expiry: Locator;
  readonly cvv: Locator;
  readonly buyNowButton: Locator;
  readonly orderSuccess: Locator;

  constructor(private readonly page: Page) {
    this.addressName = page.getByTestId('ecom-address-name');
    this.addressStreet = page.getByTestId('ecom-address-street');
    this.addressCity = page.getByTestId('ecom-address-city');
    this.addressState = page.getByTestId('ecom-address-state');
    this.addressZip = page.getByTestId('ecom-address-zip');
    this.saveAddressButton = page.getByTestId('ecom-save-address');
    this.cardNumber = page.getByTestId('ecom-card-number');
    this.expiry = page.getByTestId('ecom-expiry');
    this.cvv = page.getByTestId('ecom-cvv');
    this.buyNowButton = page.getByTestId('ecom-buy-now');
    this.orderSuccess = page.getByTestId('ecom-order-success');
  }

  /** A validation message under a field, e.g. "Please enter CVV." (no test id). */
  message(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  /** A line of the order confirmation, e.g. "Wireless Mouse - $25 x 1". */
  orderLine(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  /** Fills the address fields given and clicks Save Address & Continue to Payment. */
  async saveAddress(address?: Address) {
    if (address) {
      await this.addressName.fill(address.name);
      await this.addressStreet.fill(address.street);
      await this.addressCity.fill(address.city);
      await this.addressState.fill(address.state);
      await this.addressZip.fill(address.zip);
    }
    await this.saveAddressButton.click();
  }

  /** Fills the card fields given and clicks Buy Now. */
  async buyNow(card?: Card) {
    if (card) {
      await this.cardNumber.fill(card.number);
      await this.expiry.fill(card.expiry);
      await this.cvv.fill(card.cvv);
    }
    await this.buyNowButton.click();
  }
}
