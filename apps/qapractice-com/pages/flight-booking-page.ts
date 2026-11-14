import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';

export interface FlightSearch {
  from?: string;
  to?: string;
  /** YYYY-MM-DD */
  departure?: string;
  /** YYYY-MM-DD; ignored when oneWay */
  return?: string;
  passengers?: number;
  oneWay?: boolean;
}

export interface Traveller {
  name: string;
  email: string;
  phone: string;
}

/**
 * /flight-booking-scenarios: search → select flights → passengers → payment →
 * confirmation, all on one page. Flight codes (GW100, BJ211…) are in the test ids.
 */
export class FlightBookingPage extends SitePage {
  protected readonly path = '/flight-booking-scenarios';
  // search
  readonly from: Locator;
  readonly to: Locator;
  readonly departureDate: Locator;
  readonly returnDate: Locator;
  readonly passengers: Locator;
  readonly cabinClass: Locator;
  readonly oneWay: Locator;
  readonly searchButton: Locator;
  // results
  readonly sort: Locator;
  readonly airlineFilter: Locator;
  readonly nonStopFilter: Locator;
  /** Departure results, in display order. */
  readonly departureResults: Locator;
  readonly returnResults: Locator;
  readonly continueToPassengersButton: Locator;
  // passengers
  readonly travellerName: Locator;
  readonly travellerEmail: Locator;
  readonly travellerPhone: Locator;
  readonly continueToPaymentButton: Locator;
  // payment
  readonly total: Locator;
  readonly cardNumber: Locator;
  readonly expiry: Locator;
  readonly cvv: Locator;
  readonly payButton: Locator;
  // confirmation
  readonly bookingConfirmed: Locator;
  /** Booking reference, e.g. "TB6QG3AE". */
  readonly bookingReference: Locator;

  constructor(page: Page) {
    super(page);
    this.from = page.getByTestId('flight-from');
    this.to = page.getByTestId('flight-to');
    this.departureDate = page.getByTestId('flight-departure-date');
    this.returnDate = page.getByTestId('flight-return-date');
    this.passengers = page.getByTestId('flight-passengers');
    this.cabinClass = page.getByTestId('flight-class');
    this.oneWay = page.getByTestId('flight-one-way');
    this.searchButton = page.getByTestId('flight-search');
    this.sort = page.getByTestId('flight-sort');
    this.airlineFilter = page.getByTestId('flight-filter-airline');
    this.nonStopFilter = page.getByTestId('flight-filter-nonstop');
    this.departureResults = page.getByTestId('flight-departure-list').getByTestId(/^flight-result-/);
    this.returnResults = page.getByTestId('flight-return-list').getByTestId(/^flight-result-/);
    this.continueToPassengersButton = page.getByTestId('flight-continue-to-passengers');
    this.travellerName = page.getByTestId('flight-passenger-name');
    this.travellerEmail = page.getByTestId('flight-passenger-email');
    this.travellerPhone = page.getByTestId('flight-passenger-phone');
    this.continueToPaymentButton = page.getByTestId('flight-continue-to-payment');
    this.total = page.getByTestId('flight-total');
    this.cardNumber = page.getByTestId('flight-card-number');
    this.expiry = page.getByTestId('flight-expiry');
    this.cvv = page.getByTestId('flight-cvv');
    this.payButton = page.getByTestId('flight-book');
    this.bookingConfirmed = page.getByTestId('flight-booking-success');
    this.bookingReference = page.getByTestId('flight-pnr');
  }

  async waitUntilLoaded() {
    await expect(this.searchButton).toBeVisible();
  }

  /** A validation message under a field (no test id), e.g. "Please select a departure city.". */
  message(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  /** One result row by flight code, e.g. "GW100". */
  result(code: string): Locator {
    return this.page.getByTestId(`flight-result-${code}`);
  }

  /** Fills the search fields given and clicks Search Flights. */
  async search(s: FlightSearch) {
    if (s.from) await this.from.selectOption(s.from);
    if (s.to) await this.to.selectOption(s.to);
    if (s.departure) await this.departureDate.fill(s.departure);
    if (s.oneWay) await this.oneWay.check();
    else if (s.return) await this.returnDate.fill(s.return);
    if (s.passengers !== undefined) await this.passengers.fill(String(s.passengers));
    await this.searchButton.click();
  }

  async sortBy(label: string) {
    await this.sort.selectOption({ label });
  }

  async selectFlight(code: string) {
    await this.page.getByTestId(`flight-select-${code}`).click();
  }

  async continueToPassengers() {
    await this.continueToPassengersButton.click();
  }

  /** Fills the traveller fields given and clicks Continue to payment. */
  async enterTraveller(t?: Partial<Traveller>) {
    if (t?.name !== undefined) await this.travellerName.fill(t.name);
    if (t?.email !== undefined) await this.travellerEmail.fill(t.email);
    if (t?.phone !== undefined) await this.travellerPhone.fill(t.phone);
    await this.continueToPaymentButton.click();
  }

  /** Fills the card fields given and clicks Pay & Confirm Booking. */
  async pay(card?: { number: string; expiry: string; cvv: string }) {
    if (card) {
      await this.cardNumber.fill(card.number);
      await this.expiry.fill(card.expiry);
      await this.cvv.fill(card.cvv);
    }
    await this.payButton.click();
  }
}
