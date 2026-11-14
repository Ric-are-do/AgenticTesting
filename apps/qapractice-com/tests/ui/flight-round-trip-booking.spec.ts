// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { dateFromToday, traveller } from '@apps/qapractice-com/data/flight';
import { invalidCard, validCard } from '@apps/qapractice-com/data/payment';

test.describe('Booking', () => {
  test('Round trip books both flights', async ({ flightBookingPage }) => {
    // 1. Search a round trip, select GW100 and GW200, continue, enter the traveller, continue.
    await flightBookingPage.goto();
    await flightBookingPage.search({ from: 'New York', to: 'London', departure: dateFromToday(60), return: dateFromToday(67) });
    await flightBookingPage.selectFlight('GW100');
    await flightBookingPage.selectFlight('GW200');
    await flightBookingPage.continueToPassengers();
    await flightBookingPage.enterTraveller(traveller);
    await expect(flightBookingPage.total).toHaveText('$420');

    // 2. Pay.
    await flightBookingPage.pay(validCard);
    await expect(flightBookingPage.bookingConfirmed).toHaveText('Booking Confirmed!');
    await expect(flightBookingPage.message('Global Wings (GW100)')).toBeVisible();
    await expect(flightBookingPage.message('Global Wings (GW200)')).toBeVisible();
  });
});
