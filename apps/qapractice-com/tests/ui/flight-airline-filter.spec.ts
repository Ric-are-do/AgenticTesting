// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { dateFromToday, traveller } from '@apps/qapractice-com/data/flight';

test.describe('Results', () => {
  test('Airline filter keeps one airline', async ({ flightBookingPage }) => {
    // 1. Search, choose BlueJet in the airline filter.
    await flightBookingPage.goto();
    await flightBookingPage.search({ from: 'New York', to: 'London', departure: dateFromToday(60), oneWay: true });
    await flightBookingPage.airlineFilter.selectOption({ label: 'BlueJet' });
    await expect(flightBookingPage.departureResults).toHaveText([/BJ211/]);
  });
});
