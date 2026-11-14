// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { dateFromToday, traveller } from '@apps/qapractice-com/data/flight';

test.describe('Booking', () => {
  test('Empty payment details are refused', async ({ flightBookingPage }) => {
    // 1. Reach payment and click Pay & Confirm Booking with the card fields empty.
    await flightBookingPage.goto();
    await flightBookingPage.search({ from: 'New York', to: 'London', departure: dateFromToday(60), oneWay: true });
    await flightBookingPage.selectFlight('GW100');
    await flightBookingPage.continueToPassengers();
    await flightBookingPage.enterTraveller(traveller);
    await flightBookingPage.pay();
    for (const text of ['Please enter the card number.', 'Please enter the expiry date.', 'Please enter the CVV.'])
      await expect(flightBookingPage.message(text)).toBeVisible();
    await expect(flightBookingPage.bookingConfirmed).toBeHidden();
  });
});
