// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { dateFromToday, traveller } from '@apps/qapractice-com/data/flight';
import { invalidCard, validCard } from '@apps/qapractice-com/data/payment';

test.describe('Booking', () => {
  test('Invalid card is refused (known bug)', async ({ flightBookingPage }) => {
    // Known bug (seen 2026-11-13): card 1234, expiry 13/99 and CVV 1 still give "Booking Confirmed!".
    // The test states the correct behaviour and is expected to fail until the
    // site is fixed; then Playwright reports it as an unexpected pass.
    test.fail(true, 'Known bug: card 1234, expiry 13/99 and CVV 1 still give "Booking Confirmed!".');
    // 1. Reach payment, enter card 1234, expiry 13/99, CVV 1, pay.
    await flightBookingPage.goto();
    await flightBookingPage.search({ from: 'New York', to: 'London', departure: dateFromToday(60), oneWay: true });
    await flightBookingPage.selectFlight('GW100');
    await flightBookingPage.continueToPassengers();
    await flightBookingPage.enterTraveller(traveller);
    await flightBookingPage.pay(invalidCard);
    await expect(flightBookingPage.cardNumber).toBeVisible();
    await expect(flightBookingPage.bookingConfirmed).toBeHidden();
  });
});
