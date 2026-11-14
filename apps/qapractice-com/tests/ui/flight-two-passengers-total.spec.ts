// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { dateFromToday, traveller } from '@apps/qapractice-com/data/flight';

test.describe('Booking', () => {
  test('Total is per passenger', async ({ flightBookingPage }) => {
    // 1. Search one way with 2 passengers, select GW100, continue, enter the traveller, continue.
    await flightBookingPage.goto();
    await flightBookingPage.search({ from: 'New York', to: 'London', departure: dateFromToday(60), oneWay: true, passengers: 2 });
    await flightBookingPage.selectFlight('GW100');
    await flightBookingPage.continueToPassengers();
    await flightBookingPage.enterTraveller(traveller);
    await expect(flightBookingPage.total).toHaveText('$420');
  });
});
