// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { dateFromToday, traveller } from '@apps/qapractice-com/data/flight';

test.describe('Results', () => {
  test('Sort by price high to low and by duration', async ({ flightBookingPage }) => {
    // 1. Search New York → London one way, choose "Price: High to Low".
    await flightBookingPage.goto();
    await flightBookingPage.search({ from: 'New York', to: 'London', departure: dateFromToday(60), oneWay: true });
    await flightBookingPage.sortBy('Price: High to Low');
    await expect(flightBookingPage.departureResults).toHaveText([/BJ211/, /GW100/, /SH137/, /AS174/, /AL248/]);

    // 2. Choose "Duration: Shortest".
    await flightBookingPage.sortBy('Duration: Shortest');
    await expect(flightBookingPage.departureResults).toHaveText([/GW100/, /BJ211/, /SH137/, /AS174/, /AL248/]);
  });
});
