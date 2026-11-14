// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { dateFromToday, traveller } from '@apps/qapractice-com/data/flight';

test.describe('Booking', () => {
  test('Traveller details are required and checked', async ({ flightBookingPage }) => {
    // 1. Reach the traveller step and click Continue to payment with everything empty.
    await flightBookingPage.goto();
    await flightBookingPage.search({ from: 'New York', to: 'London', departure: dateFromToday(60), oneWay: true });
    await flightBookingPage.selectFlight('GW100');
    await flightBookingPage.continueToPassengers();
    await flightBookingPage.enterTraveller();
    for (const text of ['Please enter the traveller name.', 'Please enter an email.', 'Please enter a phone number.'])
      await expect(flightBookingPage.message(text)).toBeVisible();

    // 2. Fill the traveller but email "jane@example", continue.
    await flightBookingPage.enterTraveller({ ...traveller, email: 'jane@example' });
    await expect(flightBookingPage.message('Enter a valid email address.')).toBeVisible();
    await expect(flightBookingPage.cardNumber).toBeHidden();
  });
});
